<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $prefix = $this->type === 'incoming' ? 'GN' : 'GD';

        // Karşı taraf adını belirle: ya müşteri ya tedarikçi
        $taraf = $this->relationLoaded('customer')
            ? ($this->customer?->full_name)
            : ($this->relationLoaded('supplier') ? $this->supplier?->company_name : null);

        // Durumu Türkçe'ye çevir
        $durum = match($this->status) {
            'completed' => $this->type === 'incoming' ? 'Tahsil Edildi' : 'Ödendi',
            'pending'   => 'Beklemede',
            default     => $this->status,
        };

        return [
            'uid'         => $this->id,
            'odemeNo'     => $prefix . '-' . str_pad($this->id, 4, '0', STR_PAD_LEFT),
            'tur'         => $this->type,
            'taraf'       => $taraf,
            'tutar'       => (float) $this->amount,
            'tarih'       => $this->payment_date,
            'durum'       => $durum,
            'aciklama'    => $this->description,
            'faturaId'    => $this->invoice_id,
            'musteriUid'  => $this->customer_id,
            'tedarikciUid'=> $this->supplier_id,
            'created_at'  => $this->created_at,
        ];
    }
}
