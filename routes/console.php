<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Ежедневная агрегация статистики
Schedule::command('statistics:aggregate')
    ->dailyAt('00:30')
    ->withoutOverlapping();

// Пересчет статистики раз в неделю
Schedule::command('statistics:recalculate --type=all')
    ->weeklyOn(1, '02:00') // Каждый понедельник в 2:00
    ->withoutOverlapping();

// Очистка кэша статистики раз в день
Schedule::command('statistics:clear-cache')
    ->dailyAt('03:00')
    ->withoutOverlapping();
