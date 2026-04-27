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
    Schema::create('invoices', function (Blueprint $table) {
        $table->id();
        $table->string('invoice_number')->unique();
        $table->string('type'); // 'sales' (satış) or 'purchase' (alış)
        
        // Nullable Foreign Keys
        $table->foreignId('customer_id')->nullable()->constrained('customers')->nullOnDelete();
        $table->foreignId('supplier_id')->nullable()->constrained('suppliers')->nullOnDelete();
        
        // Dates
        $table->date('issue_date');
        $table->date('due_date')->nullable();
        
        // Financials
        $table->decimal('sub_total', 10, 2)->default(0);
        $table->decimal('tax_total', 10, 2)->default(0);
        $table->decimal('grand_total', 10, 2)->default(0);
        
        $table->string('status')->default('pending'); // pending, paid, cancelled
        $table->text('notes')->nullable();
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
