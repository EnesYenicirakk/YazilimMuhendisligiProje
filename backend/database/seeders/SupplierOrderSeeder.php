<?php

namespace Database\Seeders;

use App\Models\Supplier;
use App\Models\Product;
use App\Models\SupplierOrder;
use App\Models\SupplierOrderItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SupplierOrderSeeder extends Seeder
{
    public function run(): void
    {
        $orders = [
            [
                'supplier_name' => 'Anadolu Filtre Sanayi',
                'order_number'  => 'AP-103',
                'total_amount'  => 8500,
                'order_date'    => '2026-03-12',
                'status'        => 'pending',
                'items' => [
                    ['sku' => 'FLT-2201', 'quantity' => 50, 'unit_price' => 75],
                    ['sku' => 'FLT-2202', 'quantity' => 30, 'unit_price' => 90],
                ],
            ],
            [
                'supplier_name' => 'Anadolu Filtre Sanayi',
                'order_number'  => 'AP-099',
                'total_amount'  => 12400,
                'order_date'    => '2026-03-08',
                'status'        => 'completed',
                'items' => [
                    ['sku' => 'FLT-2203', 'quantity' => 60, 'unit_price' => 55],
                    ['sku' => 'FLT-2204', 'quantity' => 50, 'unit_price' => 110],
                ],
            ],
            [
                'supplier_name' => 'Delta Fren Sistemleri',
                'order_number'  => 'DF-211',
                'total_amount'  => 15600,
                'order_date'    => '2026-03-20',
                'status'        => 'completed',
                'items' => [
                    ['sku' => 'FRN-2101', 'quantity' => 40, 'unit_price' => 180],
                    ['sku' => 'FRN-2102', 'quantity' => 30, 'unit_price' => 160],
                ],
            ],
            [
                'supplier_name' => 'MotorTek Endüstri',
                'order_number'  => 'MT-055',
                'total_amount'  => 9600,
                'order_date'    => '2026-04-01',
                'status'        => 'pending',
                'items' => [
                    ['sku' => 'SAN-2401', 'quantity' => 8,  'unit_price' => 750],
                    ['sku' => 'SAN-2402', 'quantity' => 20, 'unit_price' => 110],
                    ['sku' => 'SAN-2405', 'quantity' => 15, 'unit_price' => 145],
                ],
            ],
        ];

        foreach ($orders as $orderData) {
            $supplier = Supplier::where('company_name', $orderData['supplier_name'])->first();
            if (!$supplier) continue;

            DB::beginTransaction();
            try {
                $order = SupplierOrder::create([
                    'supplier_id'  => $supplier->id,
                    'order_number' => $orderData['order_number'],
                    'total_amount' => $orderData['total_amount'],
                    'order_date'   => $orderData['order_date'],
                    'status'       => $orderData['status'],
                ]);

                foreach ($orderData['items'] as $item) {
                    $product = Product::where('sku', $item['sku'])->first();
                    if (!$product) continue;

                    SupplierOrderItem::create([
                        'supplier_order_id' => $order->id,
                        'product_id'        => $product->id,
                        'quantity'          => $item['quantity'],
                        'unit_price'        => $item['unit_price'],
                    ]);
                }
                DB::commit();
            } catch (\Exception $e) {
                DB::rollBack();
            }
        }
    }
}
