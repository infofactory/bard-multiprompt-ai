<?php

use Illuminate\Support\Facades\Route;
use Infofactory\BardMultipromptAi\Controllers\ConfigController;

Route::prefix('bard-multiprompt-ai')->name('bard-multiprompt-ai.')->controller(ConfigController::class)->group(function () {
    Route::get('/config', 'edit')->name('config');
    Route::post('/config', 'update')->name('update-config');
});
