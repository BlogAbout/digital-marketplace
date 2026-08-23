<?php

namespace App\Modules\User\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DepositRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount' => ['required', 'numeric', 'min:0.01', 'max:1000000'],
            'currency' => ['sometimes', 'string', 'size:3', 'exists:currency,id'],
            'description' => ['nullable', 'string', 'max:255'],
        ];
    }
}
