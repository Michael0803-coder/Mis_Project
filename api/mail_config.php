<?php
// Mail settings used when a student account is activated.
//
// For real delivery, copy this file to api/mail_config.local.php and fill in
// your SMTP credentials. The local override is ignored by git.
//
// Gmail example (from_email must match the authenticated account):
//   'host' => 'smtp.gmail.com',
//   'port' => 587,
//   'encryption' => 'tls',
//   'username' => 'your-address@gmail.com',
//   'password' => 'your-16-character-app-password',
//   'from_email' => 'your-address@gmail.com',
//
// The default below points at a local SMTP relay on port 25. If no relay is
// running, the API still creates the account and returns the temporary
// password so an administrator can hand it to the student.

$config = [
    "transport" => "smtp", // "smtp" or "mail"
    "host" => "127.0.0.1",
    "port" => 25,
    "encryption" => "", // "", "tls", or "ssl"
    "username" => "",
    "password" => "",
    "from_email" => "no-reply@apexacademy.edu",
    "from_name" => "Apex Academy MIS",
    "app_url" => "http://localhost:5173/#login",
    "timeout" => 10,
];

$localConfig = __DIR__ . "/mail_config.local.php";

if (is_file($localConfig)) {
    $override = require $localConfig;

    if (is_array($override)) {
        $config = array_merge($config, $override);
    }
}

return $config;
