<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uid'         => $this->id,
            'urunId'      => $this->sku,
            'barkod'      => $this->barcode,
            'kategori'    => $this->whenLoaded('category', fn() => $this->category->name),
            'ad'          => $this->name,
            'avatar'      => $this->avatar,
            'urunAdedi'   => $this->stock_quantity,
            'magazaStok'  => $this->store_stock,
            'minimumStok' => $this->minimum_stock,
            'alisFiyati'  => (float) $this->purchase_price,
            'satisFiyati' => (float) $this->sale_price,
            'favori'      => (bool) $this->is_favorite,
            'created_at'  => $this->created_at,
        ];
    }
}
