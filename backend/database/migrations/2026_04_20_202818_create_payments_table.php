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
    Schema::create('payments', function (Blueprint $table) {
        $table->id();
        $table->string('type'); // 'incoming' (gelir) or 'outgoing' (gider)
        $table->decimal('amount', 10, 2);
        $table->date('payment_date');
        
        // Links to figure out who is paying and for what
        $table->foreignId('customer_id')->nullable()->constrained('customers')->nullOnDelete();
        $table->foreignId('supplier_id')->nullable()->constrained('suppliers')->nullOnDelete();
        $table->foreignId('invoice_id')->nullable()->constrained('invoices')->nullOnDelete();
        
        $table->string('status')->default('completed');
        $table->text('description')->nullable();
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
