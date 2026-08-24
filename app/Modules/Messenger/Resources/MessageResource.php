<?php

namespace App\Modules\Messenger\Resources;

use App\Modules\User\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'text' => $this->text,
            'media' => $this->media,
            'mentions' => $this->mentions,
            'reactions' => $this->reactions,
            'is_pinned' => $this->is_pinned,
            'is_edited' => $this->is_edited,
            'edited_at' => $this->edited_at,
            'self_destruct_at' => $this->self_destruct_at,
            'reply_to' => new self($this->whenLoaded('replyTo')),
            'thread' => new self($this->whenLoaded('thread')),
            'replies' => self::collection($this->whenLoaded('replies')),
            'user' => new UserResource($this->whenLoaded('user')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
