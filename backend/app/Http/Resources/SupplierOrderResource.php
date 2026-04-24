<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SupplierOrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uid'          => $this->id,
            'siparisNo'    => $this->order_number,
            'tedarikciUid' => $this->supplier_id,
            'tedarikci'    => $this->whenLoaded('supplier', fn() => $this->supplier->company_name),
            'toplamTutar'  => (float) $this->total_amount,
            'siparisTarihi'=> $this->order_date,
            'durum'        => $this->status,
            'urunler'      => $this->whenLoaded('items', fn() => $this->items->map(fn($item) => [
                'uid'        => $item->id,
                'urunUid'    => $item->product_id,
                'urunAdi'    => $item->product?->name,
                'urunId'     => $item->product?->sku,
                'miktar'     => $item->quantity,
                'birimFiyat' => (float) $item->unit_price,
            ])),
            'created_at'   => $this->created_at,
        ];
    }
}
