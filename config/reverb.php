<?php

return [
    'apps' => [
        'default' => [
            'key' => env('REVERB_APP_KEY', 'marketplace_key'),
            'secret' => env('REVERB_APP_SECRET', 'marketplace_secret'),
            'app_id' => env('REVERB_APP_ID', 'marketplace'),
            'options' => [
                'host' => env('REVERB_HOST', 'localhost'),
                'port' => env('REVERB_PORT', 8080),
                'scheme' => env('REVERB_SCHEME', 'http'),
                'useTLS' => env('REVERB_SCHEME', 'http') === 'https',
            ],
        ],
    ],
];
