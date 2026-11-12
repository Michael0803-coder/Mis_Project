<?php
// Shared access to the system_settings table.
//
// The helper is deliberately tolerant: if the table has not been created yet
// (for example on an older database), callers receive the supplied default so
// enrollment and account provisioning keep working.

function getSystemSetting(PDO $pdo, string $key, ?string $default = null): ?string
{
    try {
        $stmt = $pdo->prepare(
            "SELECT setting_value FROM system_settings WHERE setting_key = ? LIMIT 1"
        );
        $stmt->execute([$key]);
        $value = $stmt->fetchColumn();

        return $value === false ? $default : (string) $value;
    } catch (Throwable $e) {
        return $default;
    }
}

function systemSettingBool(PDO $pdo, string $key, bool $default = true): bool
{
    $value = getSystemSetting($pdo, $key, $default ? "1" : "0");

    return in_array(
        strtolower(trim((string) $value)),
        ["1", "true", "yes", "on"],
        true
    );
}

function systemSettingInt(
    PDO $pdo,
    string $key,
    int $default,
    int $minimum,
    int $maximum
): int {
    $value = (int) getSystemSetting($pdo, $key, (string) $default);

    return max($minimum, min($maximum, $value));
}
