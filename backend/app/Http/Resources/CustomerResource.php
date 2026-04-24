<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uid'           => $this->id,
            'ad'            => $this->full_name,
            'telefon'       => $this->phone,
            'email'         => $this->email,
            'adres'         => $this->address,
            'vergiNumarasi' => $this->tax_number,
            'sonAlimTarihi' => $this->last_purchase_date,
            'not'           => $this->notes,
            'created_at'    => $this->created_at,
        ];
    }
}
