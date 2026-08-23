<?php

use Elasticsearch\Client;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    $checks = [
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
        'php_version' => PHP_VERSION,
        'laravel_version' => app()->version(),
    ];

    // Проверка Redis
    try {
        Redis::set('health_check', 'ok');
        $checks['redis'] = Redis::get('health_check') === 'ok' ? 'ok' : 'error';
    } catch (Exception $e) {
        $checks['redis'] = 'error: ' . $e->getMessage();
    }

    // Проверка PostgreSQL
    try {
        DB::connection()->getPdo();
        $checks['database'] = 'ok';
    } catch (Exception $e) {
        $checks['database'] = 'error: ' . $e->getMessage();
    }

    // Проверка Elasticsearch
    try {
        $client = new Client([
            'hosts' => [env('ELASTICSEARCH_HOST', 'elasticsearch') . ':' . env('ELASTICSEARCH_PORT', 9200)],
        ]);
        $ping = $client->ping();
        $checks['elasticsearch'] = $ping ? 'ok' : 'error';
    } catch (Exception $e) {
        $checks['elasticsearch'] = 'error: ' . $e->getMessage();
    }

    return response()->json($checks);
});
