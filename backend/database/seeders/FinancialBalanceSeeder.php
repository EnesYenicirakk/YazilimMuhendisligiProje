<?php

namespace Database\Seeders;

use App\Models\CustomerOrder;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\SupplierOrder;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FinancialBalanceSeeder extends Seeder
{
    private const CUSTOMER_ORDER_MULTIPLIER = 3.8;
    private const CANCELLED_ORDER_MULTIPLIER = 4.0;
    private const SUPPLIER_AUTO_MULTIPLIER = 0.28;

    private const MANUAL_SUPPLIER_TOTALS = [
        'AP-103' => 3900,
        'AP-099' => 3300,
        'DF-211' => 4800,
        'MT-055' => 4000,
    ];

    public function run(): void
    {
        DB::transaction(function () {
            $this->rebalanceCustomerOrders();
            $this->rebalanceSupplierOrders();
            $this->syncSupplierSummaries();
        });
    }

    private function rebalanceCustomerOrders(): void
    {
        CustomerOrder::with(['items.product'])->get()->each(function (CustomerOrder $order) {
            $item = $order->items->first();
            $product = $item?->product;

            if (!$item || !$product) {
                return;
            }

            $multiplier = $order->payment_status === 'cancelled'
                ? self::CANCELLED_ORDER_MULTIPLIER
                : self::CUSTOMER_ORDER_MULTIPLIER;

            $unitPrice = round((float) $product->sale_price * $multiplier, 2);
            $totalAmount = round($unitPrice * (int) $item->quantity, 2);

            $item->update([
                'unit_price' => $unitPrice,
            ]);

            $order->update([
                'total_amount' => $totalAmount,
            ]);
        });
    }

    private function rebalanceSupplierOrders(): void
    {
        SupplierOrder::query()->get()->each(function (SupplierOrder $order) {
            if (!$order->is_automatic) {
                $totalAmount = self::MANUAL_SUPPLIER_TOTALS[$order->order_number] ?? (float) $order->total_amount;
                $unitPrice = (int) ($order->quantity ?? 0) > 0
                    ? round($totalAmount / (int) $order->quantity, 2)
                    : $totalAmount;

                $order->update([
                    'total_amount' => $totalAmount,
                    'unit_price' => $unitPrice,
                ]);

                return;
            }

            $product = null;
            if ($order->product_sku) {
                $product = Product::where('sku', $order->product_sku)->first();
            }

            if (!$product && $order->product_name) {
                $product = Product::where('name', $order->product_name)->first();
            }

            if (!$product) {
                return;
            }

            $quantity = max(1, (int) ($order->quantity ?? 1));
            $unitPrice = round((float) $product->purchase_price * self::SUPPLIER_AUTO_MULTIPLIER, 2);
            $totalAmount = round($unitPrice * $quantity, 2);

            $order->update([
                'unit_price' => $unitPrice,
                'total_amount' => $totalAmount,
            ]);
        });
    }

    private function syncSupplierSummaries(): void
    {
        Supplier::with('orders')->get()->each(function (Supplier $supplier) {
            $supplier->update([
                'total_purchase_count' => $supplier->orders->count(),
                'total_spent' => round((float) $supplier->orders->sum('total_amount'), 2),
            ]);
        });
    }
}
