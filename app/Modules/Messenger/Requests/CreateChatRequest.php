<?php

namespace App\Modules\Messenger\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateChatRequest extends FormRequest
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
            'name' => ['required', 'string', 'min:2', 'max:255'],
            'participants' => ['required', 'array', 'min:1'],
            'participants.*' => ['uuid', 'exists:user,id'],
        ];
    }
}
