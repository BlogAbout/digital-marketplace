<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: #4F46E5;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background: #f9fafb;
            padding: 30px;
            border-radius: 0 0 8px 8px;
        }
        .button {
            display: inline-block;
            background: #4F46E5;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 20px;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
        }
    </style>
</head>
<body>
<div class="header">
    <h1>Добро пожаловать в Marketplace!</h1>
</div>
<div class="content">
    <h2>Здравствуйте, {{ $user->name }}!</h2>
    <p>Спасибо за регистрацию в Marketplace. Мы рады приветствовать вас на нашей платформе.</p>
    <p>Теперь вы можете:</p>
    <ul>
        <li>Покупать цифровые товары</li>
        <li>Продавать свои товары</li>
        <li>Общаться с другими пользователями</li>
        <li>Вести блог</li>
    </ul>
    <a href="{{ config('app.url') }}" class="button">Начать работу</a>
</div>
<div class="footer">
    <p>© 2026 Marketplace. Все права защищены.</p>
    <p>Вы получили это письмо, потому что зарегистрировались на Marketplace.</p>
</div>
</body>
</html>
