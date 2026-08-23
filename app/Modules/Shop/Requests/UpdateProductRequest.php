<?php

namespace App\Modules\Shop\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'category_id' => ['sometimes', 'uuid', 'exists:shop_category,id'],
            'name' => ['sometimes', 'string', 'min:3', 'max:255'],
            'description' => ['sometimes', 'string', 'min:10'],
            'currency' => ['sometimes', 'string', 'size:3', 'exists:currency,id'],
            'is_free' => ['sometimes', 'boolean'],
            'cost' => ['sometimes', 'numeric', 'min:0', 'nullable'],
            'cost_old' => ['sometimes', 'numeric', 'min:0', 'nullable'],
            'meta_title' => ['sometimes', 'string', 'max:255', 'nullable'],
            'meta_description' => ['sometimes', 'string', 'max:500', 'nullable'],
            'fields' => ['sometimes', 'array', 'nullable'],
            'is_link_domain' => ['sometimes', 'boolean'],
            'api_key_id' => ['sometimes', 'uuid', 'exists:shop_api_key,id', 'nullable'],
            'is_infinity_download' => ['sometimes', 'boolean'],
            'file_days_expired' => ['sometimes', 'integer', 'min:1', 'max:365'],
            'access_update' => ['sometimes', 'string', 'in:free,paid,none'],
            'update_discount' => ['sometimes', 'numeric', 'min:0', 'max:100', 'nullable'],
        ];
    }
}
