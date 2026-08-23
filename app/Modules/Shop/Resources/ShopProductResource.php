<?php

namespace App\Modules\Shop\Resources;

use App\Modules\User\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShopProductResource extends JsonResource
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
            'description' => $this->description,
            'currency' => $this->currency,
            'is_free' => $this->is_free,
            'cost' => $this->cost,
            'cost_old' => $this->cost_old,
            'status' => $this->status,
            'is_link_domain' => $this->is_link_domain,
            'is_infinity_download' => $this->is_infinity_download,
            'file_days_expired' => $this->file_days_expired,
            'access_update' => $this->access_update,
            'update_discount' => $this->update_discount,
            'views_count' => $this->views_count,
            'sales_count' => $this->sales_count,
            'approved_at' => $this->approved_at,
            'category' => new ShopCategoryResource($this->whenLoaded('category')),
            'author' => new UserResource($this->whenLoaded('author')),
            'images' => ShopImageResource::collection($this->whenLoaded('images')),
            'latest_version' => $this->whenLoaded('changelogs', function () {
                return $this->changelogs->first()?->version;
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
