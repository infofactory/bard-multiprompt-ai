<?php

use Illuminate\Support\Facades\Route;
use Infofactory\BardMultipromptAi\Controllers\ActionController;

Route::get('/', [ActionController::class, 'index']);
Route::post('/generate', [ActionController::class, 'generate']);
