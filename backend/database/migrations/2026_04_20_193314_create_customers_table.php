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
    Schema::create('customers', function (Blueprint $table) {
        $table->id();
        $table->string('full_name');
        
        // I am adding ->nullable() here so the database doesn't crash if a user forgets to type a phone number!
        $table->string('phone')->nullable();
        $table->string('email')->nullable();
        $table->text('address')->nullable();
        $table->string('tax_number')->nullable();
        $table->date('last_purchase_date')->nullable();
        $table->text('notes')->nullable();
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
