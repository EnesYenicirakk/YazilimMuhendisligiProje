<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // Giriş: Kullanıcı adı ve şifre ile token al
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'username' => ['Kullanıcı adı veya şifre hatalı.'],
            ]);
        }

        // Önceki tokenları sil, yeni token oluştur
        $user->tokens()->delete();
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id'       => $user->id,
                'username' => $user->username,
                'name'     => $user->name,
                'role'     => $user->role,
            ],
        ]);
    }

    // Çıkış: Mevcut token'ı geçersiz kıl
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Oturum başarıyla kapatıldı.']);
    }

    // Mevcut oturumdaki kullanıcı bilgisini döndür
    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'id'       => $user->id,
            'username' => $user->username,
            'name'     => $user->name,
            'role'     => $user->role,
        ]);
    }
}
