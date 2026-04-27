<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // Fatura türüne göre karşı taraf adını belirle
        $karsiTarafAdi = $this->type === 'sales'
            ? ($this->relationLoaded('customer') ? $this->customer?->full_name : null)
            : ($this->relationLoaded('supplier') ? $this->supplier?->company_name : null);

        return [
            'uid'           => $this->id,
            'faturaNo'      => $this->invoice_number,
            'tur'           => $this->type === 'sales' ? 'Satış Faturası' : 'Alış Faturası',
            'karsiTarafUid' => $this->customer_id ?? $this->supplier_id,
            'karsiTarafAdi' => $karsiTarafAdi,
            'tarih'         => $this->issue_date,
            'odemeTarihi'   => $this->due_date,
            'araToplam'     => (float) $this->sub_total,
            'kdvToplam'     => (float) $this->tax_total,
            'genelToplam'   => (float) $this->grand_total,
            'durum'         => $this->status,
            'not'           => $this->notes,
            'satirlar'      => $this->whenLoaded('items', fn() => $this->items->map(fn($item) => [
                'uid'        => $item->id,
                'urunUid'    => $item->product_id,
                'urun'       => $item->product?->name,
                'miktar'     => $item->quantity,
                'birimFiyat' => (float) $item->unit_price,
                'kdvOrani'   => (float) $item->tax_rate,
            ])),
            'created_at'    => $this->created_at,
        ];
    }
}
