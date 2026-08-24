<?php

namespace App\Modules\Messenger\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SendMessageRequest extends FormRequest
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
            'text' => ['nullable', 'string', 'max:10000'],
            'reply_to_id' => ['nullable', 'uuid', 'exists:message,id'],
            'forward_from_id' => ['nullable', 'uuid', 'exists:message,id'],
            'thread_id' => ['nullable', 'uuid', 'exists:message,id'],
            'mentions' => ['nullable', 'array'],
            'mentions.*' => ['uuid', 'exists:user,id'],
            'self_destruct_seconds' => ['nullable', 'integer', 'min:5', 'max:86400'],
            'files' => ['nullable', 'array', 'max:10'],
            'files.*' => ['file', 'max:102400'], // Максимум 100MB
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'text.max' => 'Сообщение слишком длинное',
            'reply_to_id.exists' => 'Сообщение для ответа не найдено',
            'files.max' => 'Можно загрузить не более 10 файлов',
            'files.*.max' => 'Размер файла не должен превышать 100MB',
        ];
    }
}
