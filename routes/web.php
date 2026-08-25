<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('app');
});

Route::get('/{any?}', static function () {
    return view('app');
})->where('any', '^(?!api|sanctum|docs|reverb).*$');
