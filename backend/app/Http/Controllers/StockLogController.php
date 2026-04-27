<?php

namespace App\Http\Controllers;

use App\Models\StockLog;
use App\Models\Product;
use App\Http\Resources\StockLogResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockLogController extends Controller
{
    // 1. READ: Tüm stok hareket geçmişini listele (En yeniden en eskiye doğru)
    public function index()
    {
        $logs = StockLog::with(['product', 'user'])->latest()->get();
        return StockLogResource::collection($logs);
    }

    // 2. CREATE: Stok hareketi oluştur ve ürünün stoğunu güncelle
    // 'target' alanı: 'warehouse' (depo) veya 'store' (mağaza) — varsayılan: 'warehouse'
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'product_id'  => 'required|exists:products,id',
            'user_id'     => 'nullable|exists:users,id',
            'type'        => 'required|string|in:in,out,adjustment',
            'new_stock'   => 'required|integer|min:0',
            'target'      => 'sometimes|string|in:warehouse,store',
            'description' => 'nullable|string',
        ]);

        $target = $validatedData['target'] ?? 'warehouse';
        $stockField = $target === 'store' ? 'store_stock' : 'stock_quantity';

        DB::beginTransaction();

        try {
            $product   = Product::findOrFail($validatedData['product_id']);
            $old_stock = $product->$stockField;

            $log = StockLog::create([
                'product_id'  => $validatedData['product_id'],
                'user_id'     => $validatedData['user_id'] ?? null,
                'type'        => $validatedData['type'],
                'old_stock'   => $old_stock,
                'new_stock'   => $validatedData['new_stock'],
                'description' => $validatedData['description'] ?? 'Manuel stok güncellemesi',
            ]);

            // Ürünün ilgili stok alanını güncelle
            $product->update([$stockField => $validatedData['new_stock']]);

            DB::commit();

            $log->load('product');
            return new StockLogResource($log);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Stok güncellenemedi.', 'details' => $e->getMessage()], 500);
        }
    }

    // 3. READ (Tekil): Sadece bir log detayını gör
    public function show(string $id)
    {
        $log = StockLog::with(['product', 'user'])->findOrFail($id);
        return new StockLogResource($log);
    }

    // 4. UPDATE: Log açıklamasını düzelt (stok değerleri değişmez)
    public function update(Request $request, string $id)
    {
        $log = StockLog::findOrFail($id);

        $validatedData = $request->validate([
            'description' => 'sometimes|nullable|string',
        ]);

        $log->update($validatedData);
        $log->load('product');

        return new StockLogResource($log);
    }

    // 5. DELETE: Log kaydını sil (ürün stok sayısı değişmez)
    public function destroy(string $id)
    {
        $log = StockLog::findOrFail($id);
        $log->delete();

        return response()->json(null, 204);
    }
}