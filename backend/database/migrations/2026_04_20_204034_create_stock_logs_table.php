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
    Schema::create('stock_logs', function (Blueprint $table) {
        $table->id();
        
        // Which product changed, and who changed it?
        $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
        $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
        
        // What kind of change was it? (e.g., 'in' for purchase, 'out' for sale, 'adjustment' for manual fix)
        $table->string('type'); 
        
        // The math: Before and After
        $table->integer('old_stock');
        $table->integer('new_stock');
        
        // A written reason for the change (e.g., "Sold 2 units to Justin" or "Found 1 extra in warehouse")
        $table->text('description')->nullable();
        
        $table->timestamps(); // This automatically acts as the 'tarih' (date) field your frontend wants!
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_logs');
    }
};
