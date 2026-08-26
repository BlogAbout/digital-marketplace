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
        .order-info {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .order-info h3 {
            margin-top: 0;
            color: #4F46E5;
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
    <h1>Новый заказ!</h1>
</div>
<div class="content">
    <h2>Здравствуйте, {{ $user->name }}!</h2>
    <p>У вас новый заказ:</p>

    <div class="order-info">
        <h3>Заказ #{{ substr($order->id, 0, 8) }}</h3>
        <p><strong>Товар:</strong> {{ $order->product->name }}</p>
        <p><strong>Сумма:</strong> {{ $order->total }} {{ $order->currency }}</p>
        <p><strong>Дата:</strong> {{ $order->created_at->format('d.m.Y H:i') }}</p>
    </div>

    <a href="{{ config('app.url') }}/dashboard/orders" class="button">Просмотреть заказ</a>
</div>
<div class="footer">
    <p>© 2026 Marketplace. Все права защищены.</p>
</div>
</body>
</html>
