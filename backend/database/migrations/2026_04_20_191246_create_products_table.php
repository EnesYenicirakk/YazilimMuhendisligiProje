<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('products', function (Blueprint $table) {
        $table->id();
        
        // The Foreign Key linking to the categories table we just made
        $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
        
        // Core product details
        $table->string('sku')->unique();
        $table->string('barcode')->nullable(); // Added for the frontend
        $table->string('name');
        $table->string('avatar')->nullable(); // Added for the frontend (display color/image)
        
        // Inventory numbers
        $table->integer('stock_quantity')->default(0);
        $table->integer('store_stock')->default(0);
        $table->integer('minimum_stock')->default(5);
        
        // Financials (decimal with 10 digits total, 2 after the decimal point)
        $table->decimal('purchase_price', 10, 2);
        $table->decimal('sale_price', 10, 2);
        
        // Is it a favorited product?
        $table->boolean('is_favorite')->default(false);
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
