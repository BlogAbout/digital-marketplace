<?php

namespace App\Modules\Shop\Resources;

use App\Modules\User\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShopOrderResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'currency' => $this->currency,
            'is_free' => $this->is_free,
            'cost' => $this->cost,
            'tax' => $this->tax,
            'discount' => $this->discount,
            'sum' => $this->sum,
            'total' => $this->total,
            'status' => $this->status,
            'payment_type' => $this->payment_type,
            'paid_at' => $this->paid_at,
            'file_link' => $this->file_link,
            'file_expired' => $this->file_expired,
            'domain' => $this->domain,
            'product' => new ShopProductResource($this->whenLoaded('product')),
            'buyer' => new UserResource($this->whenLoaded('buyer')),
            'seller' => new UserResource($this->whenLoaded('seller')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
