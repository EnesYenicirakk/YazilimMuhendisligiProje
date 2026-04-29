<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        // Projede username kullanılıyor, DB'de email var. 
        // Kullanıcı adı 'admin' ise 'admin@example.com' olarak eşleştirebiliriz 
        // veya DB'ye username sütunu ekleyebiliriz. 
        // Şimdilik basitlik için email üzerinden gidelim veya name üzerinden.
        
        $user = User::where('name', $request->username)
                    ->orWhere('email', $request->username)
                    ->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Kullanıcı adı veya şifre hatalı.',
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Başarıyla çıkış yapıldı.'
        ]);
    }
}
