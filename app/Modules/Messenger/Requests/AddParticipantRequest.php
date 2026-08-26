<?php

namespace App\Modules\Messenger\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddParticipantRequest extends FormRequest
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
            'user_id' => ['required', 'uuid', 'exists:user,id'],
            'role' => ['sometimes', 'string', 'in:member,admin'],
        ];
    }
}
