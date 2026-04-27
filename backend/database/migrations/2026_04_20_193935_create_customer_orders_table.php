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
    Schema::create('customer_orders', function (Blueprint $table) {
        $table->id();
        
        // Links this order to a specific customer
        $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
        
        // Order totals and dates
        $table->decimal('total_amount', 10, 2)->default(0);
        $table->timestamp('order_date')->useCurrent();
        
        // Tracking the status of the order (using default statuses)
        $table->string('payment_status')->default('pending'); // pending, paid, cancelled
        $table->string('preparation_status')->default('pending'); // pending, preparing, ready
        $table->string('delivery_status')->default('pending'); // pending, shipped, delivered
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_orders');
    }
};
