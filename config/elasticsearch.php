<?php

return [
    'host' => env('ELASTICSEARCH_HOST', 'elasticsearch'),
    'port' => env('ELASTICSEARCH_PORT', 9200),
    'prefix' => env('ELASTICSEARCH_PREFIX', 'marketplace'),

    'indices' => [
        'products' => [
            'settings' => [
                'number_of_shards' => 1,
                'number_of_replicas' => 0,
            ],
        ],
        'blogs' => [
            'settings' => [
                'number_of_shards' => 1,
                'number_of_replicas' => 0,
            ],
        ],
        'users' => [
            'settings' => [
                'number_of_shards' => 1,
                'number_of_replicas' => 0,
            ],
        ],
    ],
];
