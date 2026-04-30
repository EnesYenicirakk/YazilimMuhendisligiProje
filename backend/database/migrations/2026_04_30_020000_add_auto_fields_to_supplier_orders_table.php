<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('supplier_orders', function (Blueprint $table) {
            $table->string('product_name')->nullable()->after('status');
            $table->string('product_sku')->nullable()->after('product_name');
            $table->integer('quantity')->default(0)->after('product_sku');
            $table->decimal('unit_price', 10, 2)->default(0)->after('quantity');
            $table->boolean('is_automatic')->default(false)->after('unit_price');
            $table->string('source')->nullable()->after('is_automatic');
            $table->integer('previous_stock')->nullable()->after('source');
            $table->integer('target_stock')->nullable()->after('previous_stock');
            $table->integer('expected_stock')->nullable()->after('target_stock');
        });
    }

    public function down(): void
    {
        Schema::table('supplier_orders', function (Blueprint $table) {
            $table->dropColumn([
                'product_name', 'product_sku', 'quantity', 'unit_price',
                'is_automatic', 'source', 'previous_stock', 'target_stock', 'expected_stock',
            ]);
        });
    }
};
