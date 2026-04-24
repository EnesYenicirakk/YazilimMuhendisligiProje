<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\CustomerOrderController;
use App\Http\Controllers\SupplierOrderController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\StockLogController;

// --- Herkese Açık Rotalar (Token gerekmez) ---
Route::post('/login', [AuthController::class, 'login']);

// --- Korumalı Rotalar (Geçerli Sanctum token gerektirir) ---
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);

    // İş Mantığı Kaynakları
    Route::apiResource('categories',     CategoryController::class);
    Route::apiResource('products',       ProductController::class);
    Route::apiResource('customers',      CustomerController::class);
    Route::apiResource('suppliers',      SupplierController::class);
    Route::apiResource('customer-orders', CustomerOrderController::class);
    Route::apiResource('supplier-orders', SupplierOrderController::class);
    Route::apiResource('invoices',       InvoiceController::class);
    Route::apiResource('payments',       PaymentController::class);
    Route::apiResource('stock-logs',     StockLogController::class);
});