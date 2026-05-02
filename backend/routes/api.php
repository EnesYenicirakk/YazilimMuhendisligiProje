<?php

use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\FinanceController;
use App\Http\Controllers\Api\SupplierController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\NotificationController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // Bildirimler
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{id}', [NotificationController::class, 'update']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
    Route::post('/notifications/clear-all', [NotificationController::class, 'clearAll']);

    // Ürünler
    Route::post('/products/bulk-stock-update', [ProductController::class, 'bulkStockUpdate']);
    Route::apiResource('products', ProductController::class);

    // Müşteriler
    Route::apiResource('customers', CustomerController::class);

    // Siparişler
    Route::post('/orders/{id}/cancel', [OrderController::class, 'cancel']);
    Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);
    Route::apiResource('orders', OrderController::class);

    // Diğerleri
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/finance', [FinanceController::class, 'index']);
    Route::apiResource('suppliers', SupplierController::class);
    Route::post('/suppliers/{id}/orders', [SupplierController::class, 'storeOrder']);
});
