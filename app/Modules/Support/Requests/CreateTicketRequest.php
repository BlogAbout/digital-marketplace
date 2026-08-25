<?php

namespace App\Modules\Support\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateTicketRequest extends FormRequest
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
            'subject' => ['required', 'string', 'min:3', 'max:255'],
            'description' => ['required', 'string', 'min:10'],
            'priority' => ['sometimes', 'string', 'in:low,normal,high,urgent'],
            'category' => ['sometimes', 'string', 'in:general,technical,billing,other'],
            'related_order_id' => ['nullable', 'uuid', 'exists:shop_order,id'],
            'related_product_id' => ['nullable', 'uuid', 'exists:shop_product,id'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'subject.required' => 'Укажите тему обращения',
            'subject.min' => 'Тема должна содержать минимум 3 символа',
            'description.required' => 'Опишите проблему',
            'description.min' => 'Описание должно содержать минимум 10 символов',
        ];
    }
}
