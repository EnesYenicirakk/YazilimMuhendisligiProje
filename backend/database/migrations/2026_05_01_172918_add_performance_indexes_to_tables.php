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
        Schema::table('products', function (Blueprint $table) {
            $indexes = Schema::getIndexes('products');
            $indexNames = array_column($indexes, 'name');
            
            if (!in_array('products_category_id_index', $indexNames)) $table->index('category_id');
            if (!in_array('products_sku_index', $indexNames)) $table->index('sku');
            if (!in_array('products_name_index', $indexNames)) $table->index('name');
        });

        Schema::table('payments', function (Blueprint $table) {
            $indexes = Schema::getIndexes('payments');
            $indexNames = array_column($indexes, 'name');

            if (!in_array('payments_type_index', $indexNames)) $table->index('type');
            if (!in_array('payments_customer_id_index', $indexNames)) $table->index('customer_id');
            if (!in_array('payments_supplier_id_index', $indexNames)) $table->index('supplier_id');
            if (!in_array('payments_status_index', $indexNames)) $table->index('status');
        });

        Schema::table('notifications', function (Blueprint $table) {
            $indexes = Schema::getIndexes('notifications');
            $indexNames = array_column($indexes, 'name');

            if (!in_array('notifications_user_id_index', $indexNames)) $table->index('user_id');
            if (!in_array('notifications_is_read_index', $indexNames)) $table->index('is_read');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['category_id']);
            $table->dropIndex(['sku']);
            $table->dropIndex(['name']);
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->dropIndex(['type']);
            $table->dropIndex(['customer_id']);
            $table->dropIndex(['supplier_id']);
            $table->dropIndex(['status']);
        });

        Schema::table('notifications', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
            $table->dropIndex(['is_read']);
        });
    }
};
