<?php

namespace App\Modules\Shop\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShopCategoryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'slogan' => $this->slogan,
            'description' => $this->description,
            'avatar_id' => $this->avatar_id,
            'cover_id' => $this->cover_id,
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
            'parent_id' => $this->category_id,
            'children' => ShopCategoryResource::collection($this->whenLoaded('children')),
            'products_count' => $this->when(isset($this->products_count), $this->products_count),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
