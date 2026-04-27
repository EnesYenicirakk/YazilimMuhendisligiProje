<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StockLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $islem = match($this->type) {
            'in'         => 'Stok artışı',
            'out'        => 'Stok düşüşü',
            'adjustment' => 'Manuel düzeltme',
            default      => 'Ürün silindi',
        };

        return [
            'uid'       => $this->id,
            'tarih'     => $this->created_at?->format('Y-m-d H:i'),
            'urun'      => $this->whenLoaded('product', fn() => $this->product->name),
            'urunId'    => $this->whenLoaded('product', fn() => $this->product->sku),
            'islem'     => $islem,
            'eskiStok'  => $this->old_stock,
            'yeniStok'  => $this->new_stock,
            'kullanici' => $this->whenLoaded('user', fn() => $this->user?->name ?? 'Admin') ?? 'Admin',
            'aciklama'  => $this->description,
            'created_at'=> $this->created_at,
        ];
    }
}
