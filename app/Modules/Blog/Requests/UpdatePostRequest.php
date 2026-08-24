<?php

namespace App\Modules\Blog\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UpdatePostRequest extends FormRequest
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
        $postId = $this->route('id');

        return [
            'blog_id' => [
                'sometimes',
                'uuid',
                'exists:blog,id',
            ],
            'title' => [
                'sometimes',
                'string',
                'min:3',
                'max:255',
            ],
            'slug' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('blog_post', 'slug')->ignore($postId),
            ],
            'excerpt' => [
                'nullable',
                'string',
                'max:500',
            ],
            'content' => [
                'sometimes',
                'string',
            ],
            'cover_id' => [
                'nullable',
                'uuid',
                'exists:file,id',
            ],
            'status' => [
                'sometimes',
                'string',
                'in:draft,published,archived',
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
            'tags' => [
                'nullable',
                'array',
            ],
            'tags.*' => [
                'string',
                'max:50',
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
            'title.min' => 'Заголовок должен содержать минимум 3 символа',
            'title.max' => 'Заголовок не должен превышать 255 символов',
            'slug.unique' => 'Пост с таким slug уже существует',
            'blog_id.exists' => 'Блог не найден',
            'cover_id.exists' => 'Файл обложки не найден',
            'status.in' => 'Неверный статус поста',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('title') && ! $this->has('slug')) {
            $this->merge([
                'slug' => Str::slug($this->input('title')),
            ]);
        }

        // Если статус меняется на published, устанавливаем дату публикации
        if ($this->input('status') === 'published') {
            $this->merge([
                'published_at' => now(),
            ]);
        }

        // Если статус меняется на draft, убираем дату публикации
        if ($this->input('status') === 'draft') {
            $this->merge([
                'published_at' => null,
            ]);
        }
    }
}
