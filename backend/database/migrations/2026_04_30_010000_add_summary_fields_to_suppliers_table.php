<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('suppliers', function (Blueprint $table) {
            if (!Schema::hasColumn('suppliers', 'total_purchase_count')) {
                $table->unsignedInteger('total_purchase_count')->default(0);
            }

            if (!Schema::hasColumn('suppliers', 'average_delivery_time')) {
                $table->string('average_delivery_time')->default('');
            }

            if (!Schema::hasColumn('suppliers', 'total_spent')) {
                $table->decimal('total_spent', 12, 2)->default(0);
            }
        });
    }

    public function down(): void
    {
        Schema::table('suppliers', function (Blueprint $table) {
            $columns = [];

            if (Schema::hasColumn('suppliers', 'total_purchase_count')) {
                $columns[] = 'total_purchase_count';
            }

            if (Schema::hasColumn('suppliers', 'average_delivery_time')) {
                $columns[] = 'average_delivery_time';
            }

            if (Schema::hasColumn('suppliers', 'total_spent')) {
                $columns[] = 'total_spent';
            }

            if (!empty($columns)) {
                $table->dropColumn($columns);
            }
        });
    }
};
