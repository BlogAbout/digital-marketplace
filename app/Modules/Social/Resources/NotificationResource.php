<?php

namespace App\Modules\Social\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'title' => $this->title,
            'message' => $this->message,
            'data' => $this->data,
            'icon' => $this->icon,
            'url' => $this->url,
            'read_at' => $this->read_at,
            'sent_at' => $this->sent_at,
            'status' => $this->status,
            'created_at' => $this->created_at,
        ];
    }
}
