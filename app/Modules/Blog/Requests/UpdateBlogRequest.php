<?php

namespace App\Modules\Blog\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UpdateBlogRequest extends FormRequest
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
        $blogId = $this->route('id');

        return [
            'name' => [
                'sometimes',
                'string',
                'min:2',
                'max:255',
            ],
            'slug' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('blog', 'slug')->ignore($blogId),
            ],
            'description' => [
                'nullable',
                'string',
                'max:5000',
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
            'settings' => [
                'nullable',
                'array',
            ],
            'is_active' => [
                'sometimes',
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
            'name.min' => 'Название блога должно содержать минимум 2 символа',
            'name.max' => 'Название блога не должно превышать 255 символов',
            'slug.unique' => 'Блог с таким slug уже существует',
            'cover_id.exists' => 'Файл обложки не найден',
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
