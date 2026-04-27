<?php

use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\FinanceController;
use App\Http\Controllers\Api\SupplierController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/customers', [CustomerController::class, 'index']);
Route::get('/orders', [OrderController::class, 'index']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/finance', [FinanceController::class, 'index']);
Route::get('/suppliers', [SupplierController::class, 'index']);
