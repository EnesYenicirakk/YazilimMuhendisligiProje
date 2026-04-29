<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = \App\Models\User::where('username', 'admin')->first();
        if (!$user) return;

        // 1. Kritik Bildirim (Görünmeli)
        \App\Models\Notification::create([
            'user_id' => $user->id,
            'type' => 'kritik',
            'title' => 'Kritik Stok Uyarısı',
            'details' => 'iPhone 15 Pro stokları kritik seviyeye (2 adet) düştü.',
            'page' => 'envanter',
            'is_transactional' => false,
            'created_at' => now(),
        ]);

        // 2. Yeni İşlemsel Bildirim (Görünmeli - < 24s)
        \App\Models\Notification::create([
            'user_id' => $user->id,
            'type' => 'satis',
            'title' => 'Yeni Sipariş Kaydedildi',
            'details' => 'Mehmet Yılmaz için 1 adet MacBook Air satışı yapıldı.',
            'page' => 'siparisler',
            'is_transactional' => true,
            'created_at' => now()->subHours(2),
        ]);

        // 3. Eski İşlemsel Bildirim (Gizlenmeli - > 24s)
        \App\Models\Notification::create([
            'user_id' => $user->id,
            'type' => 'satis',
            'title' => 'Eski Sipariş Onayı',
            'details' => 'Bu bildirim 2 günden eski olduğu için görünmemeli.',
            'page' => 'siparisler',
            'is_transactional' => true,
            'created_at' => now()->subDays(2),
        ]);

        // 4. Okunmuş Bildirim (Gizlenmeli)
        \App\Models\Notification::create([
            'user_id' => $user->id,
            'type' => 'tahsilat',
            'title' => 'Ödeme Alındı',
            'details' => 'Okunduğu için görünmemeli.',
            'is_read' => true,
            'is_transactional' => false,
            'created_at' => now(),
        ]);

        // 5. Arşivlenmiş Bildirim (Gizlenmeli)
        \App\Models\Notification::create([
            'user_id' => $user->id,
            'type' => 'sistem',
            'title' => 'Sistem Güncellemesi',
            'details' => 'Arşivlendiği için görünmemeli.',
            'is_archived' => true,
            'is_transactional' => false,
            'created_at' => now(),
        ]);
    }
}
