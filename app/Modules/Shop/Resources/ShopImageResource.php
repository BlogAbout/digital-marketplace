<?php

namespace App\Modules\Shop\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShopImageResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'sort_order' => $this->sort_order,
            'is_main' => $this->is_main,
            'url' => $this->getUrl(),
            'created_at' => $this->created_at,
        ];
    }
}
