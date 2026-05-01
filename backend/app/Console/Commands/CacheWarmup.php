<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class CacheWarmup extends Command
{
    protected $signature = 'cache:warmup';
    protected $description = 'Warm up critical API caches for performance testing';

    public function handle()
    {
        $this->info('Starting Cache Warming...');

        // 1. Warm up via Internal Cache logic (Directly calling logic if possible or hitting local URL)
        // For simplicity, we just clear and hit the index logic
        Cache::forget('products_list');
        
        // Simulate a request to trigger Cache::remember
        $controller = new \App\Http\Controllers\Api\ProductController();
        $controller->index();
        
        $this->info('Products Cache: Warmed ✅');

        // Add more warming logic here if needed
        
        $this->info('Cache Warming Completed successfully.');
    }
}
