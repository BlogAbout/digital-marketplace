<?php

namespace App\Modules\User\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
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
        $userId = $this->route('id') ?? $this->user()->id;

        return [
            'name' => ['sometimes', 'string', 'min:2', 'max:255'],
            'email' => [
                'sometimes',
                'email',
                Rule::unique('user', 'email')->ignore($userId),
            ],
            'phone' => [
                'sometimes',
                'string',
                'max:20',
                Rule::unique('user', 'phone')->ignore($userId),
            ],
            'password' => ['sometimes', 'confirmed', Password::min(8)->letters()->numbers()],
            'slogan' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'timezone' => ['sometimes', 'string', 'timezone'],
            'locale' => ['sometimes', 'string', 'in:ru,en'],
            'theme' => ['sometimes', 'string', 'in:light,dark'],
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->input('phone')) {
            $this->merge([
                'phone' => preg_replace('/[^0-9+]/', '', $this->input('phone')),
            ]);
        }

        if ($this->has('settings') && is_array($this->input('settings'))) {
            $this->merge([
                'settings' => array_merge($this->user()->settings ?? [], $this->input('settings')),
            ]);
        }
    }
}
