<?php
// Small dependency-free mailer used for student account credentials.
// It supports authenticated SMTP (including STARTTLS/SSL) and falls back to
// PHP's mail() when configured that way. Every attempt is written to
// logs/mail.log without the message body so passwords never reach the log.

function loadMailConfig(): array
{
    static $config = null;

    if ($config === null) {
        $config = require __DIR__ . "/mail_config.php";
    }

    return $config;
}

function mailLog(string $recipient, string $subject, bool $sent, string $error = ""): void
{
    $logDir = dirname(__DIR__) . "/logs";

    if (!is_dir($logDir)) {
        @mkdir($logDir, 0775, true);
    }

    $line = sprintf(
        "[%s] to=%s subject=%s status=%s%s\n",
        date("Y-m-d H:i:s"),
        $recipient,
        $subject,
        $sent ? "sent" : "failed",
        $error !== "" ? " error=" . $error : ""
    );

    @file_put_contents($logDir . "/mail.log", $line, FILE_APPEND | LOCK_EX);
}

function smtpReadResponse($socket): string
{
    $response = "";

    while (($line = fgets($socket, 515)) !== false) {
        $response .= $line;

        // A line with "250 " (space, not dash) is the final line of the reply.
        if (preg_match('/^\d{3} /', $line)) {
            break;
        }
    }

    return $response;
}

function smtpCommand($socket, string $command, array $expectedCodes): array
{
    fwrite($socket, $command . "\r\n");
    $response = smtpReadResponse($socket);
    $code = (int) substr(trim($response), 0, 3);

    return [
        "ok" => in_array($code, $expectedCodes, true),
        "code" => $code,
        "response" => $response,
    ];
}

function smtpSendMail(array $config, string $to, string $subject, string $headers, string $body): array
{
    $host = trim((string) ($config["host"] ?? ""));
    $port = (int) ($config["port"] ?? 25);
    $encryption = strtolower(trim((string) ($config["encryption"] ?? "")));
    $timeout = max(5, (int) ($config["timeout"] ?? 10));

    if ($host === "") {
        return ["success" => false, "error" => "SMTP host is not configured."];
    }

    $remote = ($encryption === "ssl" ? "ssl://" : "") . $host . ":" . $port;

    $context = stream_context_create([
        "ssl" => [
            "verify_peer" => true,
            "verify_peer_name" => true,
            "peer_name" => $host,
        ],
    ]);

    $socket = @stream_socket_client(
        $remote,
        $errno,
        $errstr,
        $timeout,
        STREAM_CLIENT_CONNECT,
        $context
    );

    if (!$socket) {
        return [
            "success" => false,
            "error" => "SMTP connection failed: " . $errstr . " (" . $errno . ")",
        ];
    }

    stream_set_timeout($socket, $timeout);

    $fail = function (string $message) use ($socket): array {
        @fclose($socket);

        return ["success" => false, "error" => $message];
    };

    $greeting = smtpReadResponse($socket);

    if ((int) substr(trim($greeting), 0, 3) !== 220) {
        return $fail("SMTP greeting rejected: " . trim($greeting));
    }

    $ehlo = smtpCommand($socket, "EHLO " . ($_SERVER["SERVER_NAME"] ?? "localhost"), [250]);

    if (!$ehlo["ok"]) {
        return $fail("SMTP EHLO rejected: " . trim($ehlo["response"]));
    }

    if ($encryption === "tls") {
        $startTls = smtpCommand($socket, "STARTTLS", [220]);

        if (!$startTls["ok"]) {
            return $fail("SMTP STARTTLS rejected: " . trim($startTls["response"]));
        }

        $cryptoMethod = STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT;

        if (defined("STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT")) {
            $cryptoMethod |= STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT;
        }

        $crypto = @stream_socket_enable_crypto($socket, true, $cryptoMethod);

        if ($crypto !== true) {
            return $fail("Unable to start TLS encryption.");
        }

        $ehlo = smtpCommand($socket, "EHLO " . ($_SERVER["SERVER_NAME"] ?? "localhost"), [250]);

        if (!$ehlo["ok"]) {
            return $fail("SMTP EHLO after STARTTLS rejected: " . trim($ehlo["response"]));
        }
    }

    $username = (string) ($config["username"] ?? "");
    $password = (string) ($config["password"] ?? "");

    if ($username !== "") {
        $auth = smtpCommand($socket, "AUTH LOGIN", [334]);

        if (!$auth["ok"]) {
            return $fail("SMTP AUTH LOGIN rejected: " . trim($auth["response"]));
        }

        $userStep = smtpCommand($socket, base64_encode($username), [334]);

        if (!$userStep["ok"]) {
            return $fail("SMTP username rejected: " . trim($userStep["response"]));
        }

        $passStep = smtpCommand($socket, base64_encode($password), [235]);

        if (!$passStep["ok"]) {
            return $fail("SMTP password rejected: " . trim($passStep["response"]));
        }
    }

    $fromEmail = (string) ($config["from_email"] ?? "no-reply@localhost");

    $mailFrom = smtpCommand($socket, "MAIL FROM:<" . $fromEmail . ">", [250]);

    if (!$mailFrom["ok"]) {
        return $fail("SMTP MAIL FROM rejected: " . trim($mailFrom["response"]));
    }

    $rcptTo = smtpCommand($socket, "RCPT TO:<" . $to . ">", [250, 251]);

    if (!$rcptTo["ok"]) {
        return $fail("SMTP RCPT TO rejected: " . trim($rcptTo["response"]));
    }

    $data = smtpCommand($socket, "DATA", [354]);

    if (!$data["ok"]) {
        return $fail("SMTP DATA rejected: " . trim($data["response"]));
    }

    // Dot-stuff any line that begins with "." before sending the body.
    $safeBody = preg_replace('/^\./m', '..', $body);

    fwrite($socket, $headers . "\r\n" . $safeBody . "\r\n.\r\n");
    $sent = smtpReadResponse($socket);

    if ((int) substr(trim($sent), 0, 3) !== 250) {
        return $fail("SMTP message rejected: " . trim($sent));
    }

    smtpCommand($socket, "QUIT", [221]);
    @fclose($socket);

    return ["success" => true, "error" => ""];
}

function sendSystemMail(string $to, string $subject, string $htmlBody): array
{
    $config = loadMailConfig();
    $fromEmail = (string) ($config["from_email"] ?? "no-reply@localhost");
    $fromName = (string) ($config["from_name"] ?? "Apex Academy MIS");

    $headers = "From: " . mb_encode_mimeheader($fromName, "UTF-8", "B", "\r\n")
        . " <" . $fromEmail . ">\r\n";
    $headers .= "To: <" . $to . ">\r\n";
    $headers .= "Subject: " . mb_encode_mimeheader($subject, "UTF-8", "B", "\r\n") . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "Content-Transfer-Encoding: 8bit\r\n";
    $headers .= "Date: " . date("r") . "\r\n";

    $transport = strtolower(trim((string) ($config["transport"] ?? "smtp")));

    if ($transport === "mail") {
        $sent = @mail($to, $subject, $htmlBody, $headers);
        $error = $sent ? "" : "PHP mail() returned false.";
    } else {
        $result = smtpSendMail($config, $to, $subject, $headers, $htmlBody);
        $sent = $result["success"];
        $error = $result["error"];
    }

    mailLog($to, $subject, $sent, $error);

    return ["success" => $sent, "error" => $error];
}
