<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Supplier;
use App\Models\Payment;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        $customer1 = Customer::where('full_name', 'Yıldız Oto')->first();
        $customer2 = Customer::where('full_name', 'Tekin Otomotiv')->first();
        $customer3 = Customer::where('full_name', 'Bora Yedek Parça')->first();
        $supplier1 = Supplier::where('company_name', 'Anadolu Filtre Sanayi')->first();
        $supplier2 = Supplier::where('company_name', 'Delta Fren Sistemleri')->first();

        $payments = [
            [
                'type'         => 'incoming',
                'amount'       => 580,
                'payment_date' => '2026-04-10',
                'customer_id'  => $customer1?->id,
                'status'       => 'completed',
                'description'  => 'Yıldız Oto - Sipariş ödemesi (Fren Balatası)',
            ],
            [
                'type'         => 'incoming',
                'amount'       => 1570,
                'payment_date' => '2026-04-11',
                'customer_id'  => $customer2?->id,
                'status'       => 'completed',
                'description'  => 'Tekin Otomotiv - Sipariş ödemesi',
            ],
            [
                'type'         => 'incoming',
                'amount'       => 675,
                'payment_date' => '2026-04-15',
                'customer_id'  => $customer3?->id,
                'status'       => 'completed',
                'description'  => 'Bora Yedek Parça - Triger Kayışı Seti',
            ],
            [
                'type'         => 'outgoing',
                'amount'       => 8500,
                'payment_date' => '2026-03-12',
                'supplier_id'  => $supplier1?->id,
                'status'       => 'completed',
                'description'  => 'Anadolu Filtre Sanayi - AP-103 tedarik ödemesi',
            ],
            [
                'type'         => 'outgoing',
                'amount'       => 15600,
                'payment_date' => '2026-03-22',
                'supplier_id'  => $supplier2?->id,
                'status'       => 'completed',
                'description'  => 'Delta Fren Sistemleri - DF-211 tedarik ödemesi',
            ],
            [
                'type'         => 'outgoing',
                'amount'       => 2500,
                'payment_date' => '2026-04-01',
                'description'  => 'Kira - Nisan 2026',
                'status'       => 'completed',
            ],
            [
                'type'         => 'outgoing',
                'amount'       => 1200,
                'payment_date' => '2026-04-05',
                'description'  => 'Elektrik faturası - Nisan 2026',
                'status'       => 'completed',
            ],
        ];

        foreach ($payments as $data) {
            Payment::create($data);
        }
    }
}
