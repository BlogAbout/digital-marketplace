<?php

namespace App\Modules\Dispute\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateDisputeRequest extends FormRequest
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
            'order_id' => ['required', 'uuid', 'exists:shop_order,id'],
            'reason' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'min:10'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'order_id.required' => 'Укажите заказ',
            'order_id.exists' => 'Заказ не найден',
            'reason.required' => 'Укажите причину спора',
            'description.required' => 'Опишите проблему',
            'description.min' => 'Описание должно содержать минимум 10 символов',
        ];
    }
}
