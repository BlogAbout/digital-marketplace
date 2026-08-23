<?php

namespace App\Modules\Shop\Resources;

use App\Modules\Shop\Models\ShopImage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShopImageResource extends JsonResource
{
    /**
     * @var ShopImage
     */
    public $resource;

    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $url = null;

        if ($this->resource->file) {
            $url = $this->resource->file->getUrl();
        }

        return [
            'id' => $this->resource->id,
            'type' => $this->resource->type,
            'sort_order' => $this->resource->sort_order,
            'is_main' => $this->resource->is_main,
            'url' => $url,
            'created_at' => $this->resource->created_at,
        ];
    }
}
