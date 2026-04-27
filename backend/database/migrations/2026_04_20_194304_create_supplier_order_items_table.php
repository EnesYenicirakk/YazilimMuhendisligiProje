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
    Schema::create('supplier_order_items', function (Blueprint $table) {
        $table->id();
        
        // The Foreign Keys: linking the Purchase Order AND the Product
        $table->foreignId('supplier_order_id')->constrained('supplier_orders')->onDelete('cascade');
        $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
        
        // How many parts did the factory send, and how much did they cost us?
        $table->integer('quantity');
        $table->decimal('unit_price', 10, 2);
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('supplier_order_items');
    }
};
