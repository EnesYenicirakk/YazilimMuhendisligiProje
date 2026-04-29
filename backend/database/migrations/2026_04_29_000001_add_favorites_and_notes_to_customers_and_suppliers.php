<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            if (!Schema::hasColumn('customers', 'is_favorite')) {
                $table->boolean('is_favorite')->default(false);
            }
        });

        Schema::table('suppliers', function (Blueprint $table) {
            if (!Schema::hasColumn('suppliers', 'notes')) {
                $table->text('notes')->nullable();
            }
            if (!Schema::hasColumn('suppliers', 'is_favorite')) {
                $table->boolean('is_favorite')->default(false);
            }
        });

        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'is_favorite')) {
                $table->boolean('is_favorite')->default(false);
            }
        });
    }

    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn('is_favorite');
        });

        Schema::table('suppliers', function (Blueprint $table) {
            $table->dropColumn(['notes', 'is_favorite']);
        });
    }
};
