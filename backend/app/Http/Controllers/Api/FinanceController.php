<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;

class FinanceController extends Controller
{
    public function index()
    {
        $data = \Illuminate\Support\Facades\Cache::remember('finance_summary', 600, function () {
            $payments = Payment::with(['customer', 'supplier'])->get()->map(function ($payment) {
                $taraf = 'Genel';
                if ($payment->customer) {
                    $taraf = $payment->customer->full_name;
                } elseif ($payment->supplier) {
                    $taraf = $payment->supplier->company_name;
                } elseif ($payment->description) {
                    $taraf = $payment->description;
                }

                return [
                    'odemeNo' => (string)$payment->id,
                    'taraf' => $taraf,
                    'tarih' => $payment->payment_date ? $payment->payment_date->format('Y-m-d') : null,
                    'durum' => $this->mapStatus($payment->status),
                    'tutar' => (float)$payment->amount,
                    'type' => $payment->type, // incoming / outgoing
                    'favori' => (bool) $payment->is_favorite,
                ];
            });

            return [
                'gelen' => $payments->where('type', 'incoming')->values(),
                'giden' => $payments->where('type', 'outgoing')->values(),
            ];
        });

        return response()->json($data);
    }

    public function toggleFavorite($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->update([
            'is_favorite' => !$payment->is_favorite,
        ]);

        \Illuminate\Support\Facades\Cache::forget('finance_summary');

        return response()->json([
            'odemeNo' => (string) $payment->id,
            'favori' => (bool) $payment->is_favorite,
            'type' => $payment->type,
        ]);
    }

    private function mapStatus($status) {
        $map = ['completed' => 'Ödendi', 'pending' => 'Beklemede', 'cancelled' => 'İptal'];
        return $map[$status] ?? 'Ödendi';
    }
}
