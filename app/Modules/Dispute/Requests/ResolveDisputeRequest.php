<?php

namespace App\Modules\Dispute\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ResolveDisputeRequest extends FormRequest
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
            'resolution' => ['required', 'string', 'in:refund,partial_refund,no_refund,other'],
            'resolution_note' => ['nullable', 'string', 'max:5000'],
            'refund_amount' => [
                'required_if:resolution,partial_refund',
                'numeric',
                'min:0.01',
                'nullable',
            ],
        ];
    }
}
