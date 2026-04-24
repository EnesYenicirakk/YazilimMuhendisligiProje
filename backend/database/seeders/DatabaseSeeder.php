<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use \Illuminate\Database\Console\Seeds\WithoutModelEvents;

    public function run(): void
    {
        // Admin kullanıcısı oluştur (Frontend login: admin / admin123)
        User::firstOrCreate(
            ['username' => 'admin'],
            [
                'name'     => 'Yönetici',
                'username' => 'admin',
                'email'    => 'admin@erp.local',
                'password' => Hash::make('admin123'),
                'role'     => 'admin',
            ]
        );

        // Seeder sırası ÖNEMLİ — yabancı anahtar bağımlılıklarına göre sıralı çalışmalı
        $this->call([
            CategorySeeder::class,       // 1. Önce kategoriler (Products bağımlı)
            ProductSeeder::class,        // 2. Ürünler (Categories bağımlı)
            CustomerSeeder::class,       // 3. Müşteriler (Orders bağımlı)
            SupplierSeeder::class,       // 4. Tedarikçiler (SupplierOrders bağımlı)
            CustomerOrderSeeder::class,  // 5. Müşteri siparişleri (Customers + Products bağımlı)
            SupplierOrderSeeder::class,  // 6. Tedarikçi siparişleri (Suppliers + Products bağımlı)
            PaymentSeeder::class,        // 7. Ödemeler (Customers + Suppliers bağımlı)
        ]);
    }
}
