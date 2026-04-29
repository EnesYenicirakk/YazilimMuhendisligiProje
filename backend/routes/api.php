<?php

use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\FinanceController;
use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\Api\ChatController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/products/bulk-stock-update', [ProductController::class, 'bulkStockUpdate']);
Route::apiResource('products', ProductController::class);
Route::apiResource('customers', CustomerController::class);
Route::apiResource('orders', OrderController::class);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/finance', [FinanceController::class, 'index']);
Route::apiResource('suppliers', SupplierController::class);
Route::post('/chat', [ChatController::class, 'send']);
