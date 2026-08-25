<?php

namespace App\Modules\Dispute\Resources;

use App\Modules\User\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DisputeResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reason' => $this->reason,
            'description' => $this->description,
            'status' => $this->status,
            'resolution' => $this->resolution,
            'resolution_note' => $this->resolution_note,
            'refund_amount' => $this->refund_amount,
            'resolved_at' => $this->resolved_at,
            'buyer' => new UserResource($this->whenLoaded('buyer')),
            'seller' => new UserResource($this->whenLoaded('seller')),
            'resolved_by' => new UserResource($this->whenLoaded('resolvedBy')),
            'messages' => DisputeMessageResource::collection($this->whenLoaded('messages')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
