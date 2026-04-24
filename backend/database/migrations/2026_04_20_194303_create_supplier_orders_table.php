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
    Schema::create('supplier_orders', function (Blueprint $table) {
        $table->id();
        
        // Links this purchase to a specific supplier factory
        $table->foreignId('supplier_id')->constrained('suppliers')->onDelete('cascade');
        
        // Order details
        $table->string('order_number')->unique();
        $table->decimal('total_amount', 10, 2)->default(0);
        $table->date('order_date');
        
        // Tracking the status (e.g., pending, received, cancelled)
        $table->string('status')->default('pending');
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('supplier_orders');
    }
};
