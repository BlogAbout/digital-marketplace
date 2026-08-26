<?php

namespace App\Modules\Core\Services;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SecurityService
{
    /**
     * Генерация безопасного токена
     */
    public function generateToken(int $length = 64): string
    {
        return Str::random($length);
    }

    /**
     * Хеширование пароля
     */
    public function hashPassword(string $password): string
    {
        return Hash::make($password);
    }

    /**
     * Проверка пароля
     */
    public function verifyPassword(string $password, string $hash): bool
    {
        return Hash::check($password, $hash);
    }

    /**
     * Санитизация HTML
     */
    public function sanitizeHtml(string $input): string
    {
        return strip_tags($input, '<p><br><strong><em><ul><ol><li><a><img>');
    }

    /**
     * Проверка на SQL инъекции
     */
    public function containsSqlInjection(string $input): bool
    {
        $patterns = [
            '/(\bSELECT\b.*\bFROM\b)/i',
            '/(\bINSERT\b.*\bINTO\b)/i',
            '/(\bUPDATE\b.*\bSET\b)/i',
            '/(\bDELETE\b.*\bFROM\b)/i',
            '/(\bDROP\b.*\bTABLE\b)/i',
            '/(\bUNION\b.*\bSELECT\b)/i',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $input)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Генерация CSRF токена
     */
    public function generateCsrfToken(): string
    {
        return csrf_token();
    }

    /**
     * Шифрование данных
     */
    public function encrypt(string $data): string
    {
        return encrypt($data);
    }

    /**
     * Дешифрование данных
     */
    public function decrypt(string $encryptedData): string
    {
        return decrypt($encryptedData);
    }
}
