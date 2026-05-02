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
        Schema::table('customer_orders', function (Blueprint $table) {
            // customer_id alanını nullable yap (Kayıtsız müşteriler için)
            $table->unsignedBigInteger('customer_id')->nullable()->change();
            
            // Kayıtsız müşteri ismi için alan ekle (Opsiyonel, zaten order tablosunda musteri_adı olabilir ama emin olalım)
            // Eğer yoksa ekle:
            if (!Schema::hasColumn('customer_orders', 'guest_name')) {
                $table->string('guest_name')->nullable()->after('customer_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customer_orders', function (Blueprint $table) {
            $table->unsignedBigInteger('customer_id')->nullable(false)->change();
            if (Schema::hasColumn('customer_orders', 'guest_name')) {
                $table->dropColumn('guest_name');
            }
        });
    }
};
