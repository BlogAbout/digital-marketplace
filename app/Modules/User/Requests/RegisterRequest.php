<?php

namespace App\Modules\User\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
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
            'name' => ['required', 'string', 'min:2', 'max:255'],
            'email' => ['nullable', 'email', 'unique:user,email', 'required_without:phone'],
            'phone' => ['nullable', 'string', 'max:20', 'unique:user,phone', 'required_without:email'],
            'password' => ['required', 'confirmed', Password::min(8)->letters()->numbers()],
            'slogan' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'timezone' => ['nullable', 'string', 'timezone'],
            'locale' => ['nullable', 'string', 'in:ru,en'],
            'theme' => ['nullable', 'string', 'in:light,dark'],
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
    }
}
