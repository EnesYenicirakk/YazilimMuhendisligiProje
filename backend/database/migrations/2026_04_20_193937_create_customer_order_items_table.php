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
    Schema::create('customer_order_items', function (Blueprint $table) {
        $table->id();
        
        // The two Foreign Keys: linking the Order AND the Product
        $table->foreignId('customer_order_id')->constrained('customer_orders')->onDelete('cascade');
        $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
        
        // How many did they buy, and at what price?
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
        Schema::dropIfExists('customer_order_items');
    }
};
