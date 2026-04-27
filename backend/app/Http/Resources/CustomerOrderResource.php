<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerOrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uid'           => $this->id,
            'siparisNo'     => '#SP-' . str_pad($this->id, 4, '0', STR_PAD_LEFT),
            'musteriUid'    => $this->customer_id,
            'musteri'       => $this->whenLoaded('customer', fn() => $this->customer->full_name),
            'toplamTutar'   => (float) $this->total_amount,
            'siparisTarihi' => $this->order_date,
            'odemeDurumu'   => $this->payment_status,
            'urunHazirlik'  => $this->preparation_status,
            'teslimatDurumu'=> $this->delivery_status,
            'urunler'       => $this->whenLoaded('items', fn() => $this->items->map(fn($item) => [
                'uid'        => $item->id,
                'urunUid'    => $item->product_id,
                'urunAdi'    => $item->product?->name,
                'urunId'     => $item->product?->sku,
                'miktar'     => $item->quantity,
                'birimFiyat' => (float) $item->unit_price,
            ])),
            'created_at'    => $this->created_at,
        ];
    }
}
