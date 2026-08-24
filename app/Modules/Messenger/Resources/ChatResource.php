<?php

namespace App\Modules\Messenger\Resources;

use App\Modules\User\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChatResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'name' => $this->name,
            'description' => $this->description,
            'is_active' => $this->is_active,
            'participants' => UserResource::collection($this->whenLoaded('participants')),
            'last_message' => new MessageResource($this->whenLoaded('lastMessage')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
