<?php

namespace App\Modules\Shop\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateProductRequest extends FormRequest
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
            'category_id' => ['required', 'uuid', 'exists:shop_category,id'],
            'name' => ['required', 'string', 'min:3', 'max:255'],
            'description' => ['required', 'string', 'min:10'],
            'currency' => ['sometimes', 'string', 'size:3', 'exists:currency,id'],
            'is_free' => ['sometimes', 'boolean'],
            'cost' => ['required_unless:is_free,true', 'numeric', 'min:0', 'nullable'],
            'cost_old' => ['sometimes', 'numeric', 'min:0', 'nullable'],
            'meta_title' => ['sometimes', 'string', 'max:255', 'nullable'],
            'meta_description' => ['sometimes', 'string', 'max:500', 'nullable'],
            'fields' => ['sometimes', 'array', 'nullable'],
            'is_link_domain' => ['sometimes', 'boolean'],
            'api_key_id' => ['required_if:is_link_domain,true', 'uuid', 'exists:shop_api_key,id', 'nullable'],
            'is_infinity_download' => ['sometimes', 'boolean'],
            'file_days_expired' => ['sometimes', 'integer', 'min:1', 'max:365'],
            'access_update' => ['sometimes', 'string', 'in:free,paid,none'],
            'update_discount' => ['sometimes', 'numeric', 'min:0', 'max:100', 'nullable'],
            'images' => ['sometimes', 'array', 'max:10'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,gif,webp', 'max:5120'],
            'file' => ['sometimes', 'file', 'max:1048576'], // Максимум 1GB
        ];
    }
}
