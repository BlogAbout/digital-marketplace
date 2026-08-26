<?php

namespace App\Modules\Core\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Models\DeveloperApiKey;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ApiKeyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $keys = DeveloperApiKey::query()
            ->where('user_id', $request->user()->id)
            ->get();

        return response()->json($keys);
    }

    public function store(Request $request): JsonResponse
    {
        $key = DeveloperApiKey::create([
            'user_id' => $request->user()->id,
            'name' => $request->input('name'),
            'key' => DeveloperApiKey::generateKey(),
            'permissions' => $request->input('permissions', []),
            'rate_limit' => $request->input('rate_limit', 60),
            'expires_at' => $request->input('expires_at'),
        ]);

        return response()->json($key, 201);
    }

    public function destroy(string $id): JsonResponse
    {
        $key = DeveloperApiKey::query()
            ->where('user_id', auth()->id())
            ->findOrFail($id);

        $key->delete();

        return response()->json(['message' => 'API ключ удален']);
    }
}
