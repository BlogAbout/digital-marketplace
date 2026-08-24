<?php

namespace App\Modules\Shop\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CreateCategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'category_id' => [
                'nullable',
                'uuid',
                'exists:shop_category,id',
            ],
            'name' => [
                'required',
                'string',
                'min:2',
                'max:255',
            ],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('shop_category', 'slug'),
            ],
            'slogan' => [
                'nullable',
                'string',
                'max:255',
            ],
            'description' => [
                'nullable',
                'string',
                'max:5000',
            ],
            'avatar_id' => [
                'nullable',
                'uuid',
                'exists:file,id',
            ],
            'cover_id' => [
                'nullable',
                'uuid',
                'exists:file,id',
            ],
            'meta_title' => [
                'nullable',
                'string',
                'max:255',
            ],
            'meta_description' => [
                'nullable',
                'string',
                'max:500',
            ],
            'fields' => [
                'nullable',
                'array',
            ],
            'sort_order' => [
                'nullable',
                'integer',
                'min:0',
                'max:10000',
            ],
            'is_active' => [
                'nullable',
                'boolean',
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Название категории обязательно',
            'name.min' => 'Название должно содержать минимум 2 символа',
            'name.max' => 'Название не должно превышать 255 символов',
            'slug.unique' => 'Категория с таким slug уже существует',
            'category_id.exists' => 'Родительская категория не найдена',
            'avatar_id.exists' => 'Файл аватара не найден',
            'cover_id.exists' => 'Файл обложки не найден',
            'sort_order.min' => 'Порядок сортировки должен быть не меньше 0',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('name') && ! $this->has('slug')) {
            $this->merge([
                'slug' => Str::slug($this->input('name')),
            ]);
        }
    }
}
