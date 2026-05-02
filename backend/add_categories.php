<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Category;

$categories = [
    'Aydınlatma',
    'Süspansiyon ve Direksiyon',
    'Soğutma Sistemi',
    'Yakıt ve Ateşleme',
    'Yağlar ve Sıvılar',
    'Kaporta ve Karoseri',
    'Debriyaj Sistemi',
    'Egzoz Sistemi',
    'Aksesuar ve Bakım'
];

foreach ($categories as $name) {
    Category::firstOrCreate(['name' => $name]);
    echo "Added: $name\n";
}
