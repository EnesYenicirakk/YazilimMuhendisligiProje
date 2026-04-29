<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Carbon\Carbon;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        $now = Carbon::now();
        $yesterday = $now->copy()->subHours(24);

        $notifications = Notification::where('user_id', $user->id)
            ->where('is_archived', false)
            ->where('is_read', false) // Okunanlar asla tekrar görünmemeli kuralı
            ->where(function ($query) use ($yesterday) {
                $query->where('is_transactional', false)
                      ->orWhere(function ($q) use ($yesterday) {
                          $q->where('is_transactional', true)
                            ->where('created_at', '>', $yesterday);
                      });
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($notifications);
    }

    public function update(Request $request, $id)
    {
        $notification = Notification::where('user_id', $request->user()->id)->findOrFail($id);
        $notification->update(['is_read' => true]);

        return response()->json(['success' => true]);
    }

    public function destroy(Request $request, $id)
    {
        $notification = Notification::where('user_id', $request->user()->id)->findOrFail($id);
        
        // "Temizle" butonuna basıldığında arayüzden tamamen gizleme kuralı
        $notification->update(['is_archived' => true]);

        return response()->json(['success' => true]);
    }

    public function clearAll(Request $request)
    {
        Notification::where('user_id', $request->user()->id)
            ->where('is_archived', false)
            ->update(['is_archived' => true]);

        return response()->json(['success' => true]);
    }
}
