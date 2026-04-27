<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SupplierResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uid'           => $this->id,
            'firmaAdi'      => $this->company_name,
            'yetkiliKisi'   => $this->contact_person,
            'telefon'       => $this->phone,
            'email'         => $this->email,
            'adres'         => $this->address,
            'vergiNumarasi' => $this->tax_number,
            'urunGrubu'     => $this->product_group,
            'created_at'    => $this->created_at,
        ];
    }
}
