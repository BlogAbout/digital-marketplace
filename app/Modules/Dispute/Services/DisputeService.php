<?php

namespace App\Modules\Dispute\Services;

use App\Modules\Dispute\Models\Dispute;
use App\Modules\Dispute\Models\DisputeMessage;
use App\Modules\Shop\Models\ShopOrder;
use App\Modules\User\Models\User;
use App\Modules\User\Services\BalanceService;
use Illuminate\Support\Facades\DB;

class DisputeService
{
    public function __construct(
        private readonly BalanceService $balanceService
    ) {}

    /**
     * Создать спор
     *
     * @param array<string, mixed> $data
     */
    public function createDispute(ShopOrder $order, User $buyer, array $data): Dispute
    {
        // Проверяем, что заказ принадлежит покупателю
        if ($order->buyer_id !== $buyer->id) {
            throw new \InvalidArgumentException('Вы не можете оспорить этот заказ');
        }

        // Проверяем, что заказ завершен
        if (!$order->isCompleted()) {
            throw new \InvalidArgumentException('Можно оспорить только завершенный заказ');
        }

        // Проверяем, что спор еще не создан
        $existingDispute = Dispute::query()
            ->where('order_id', $order->id)
            ->where('status', '!=', 'closed')
            ->first();

        if ($existingDispute) {
            throw new \InvalidArgumentException('Спор по этому заказу уже существует');
        }

        /** @var Dispute $dispute */
        $dispute = Dispute::create([
            'order_id' => $order->id,
            'buyer_id' => $buyer->id,
            'seller_id' => $order->seller_id,
            'reason' => $data['reason'],
            'description' => $data['description'],
            'status' => 'open',
        ]);

        return $dispute;
    }

    /**
     * Добавить сообщение в спор
     *
     * @param array<string, mixed> $data
     */
    public function addMessage(Dispute $dispute, User $user, array $data): DisputeMessage
    {
        // Проверяем, что пользователь участвует в споре
        if ($user->id !== $dispute->buyer_id && $user->id !== $dispute->seller_id && !$user->hasRole('admin')) {
            throw new \InvalidArgumentException('Вы не можете участвовать в этом споре');
        }

        /** @var DisputeMessage $message */
        $message = DisputeMessage::create([
            'dispute_id' => $dispute->id,
            'user_id' => $user->id,
            'message' => $data['message'],
            'attachments' => $data['attachments'] ?? null,
        ]);

        return $message;
    }

    /**
     * Разрешить спор
     *
     * @param array<string, mixed> $data
     */
    public function resolveDispute(Dispute $dispute, User $resolver, array $data): Dispute
    {
        return DB::transaction(function () use ($dispute, $resolver, $data) {
            $dispute->update([
                'status' => 'resolved',
                'resolution' => $data['resolution'],
                'resolution_note' => $data['resolution_note'] ?? null,
                'refund_amount' => $data['refund_amount'] ?? null,
                'resolved_by' => $resolver->id,
                'resolved_at' => now(),
            ]);

            // Если нужно вернуть средства
            if ($data['resolution'] === 'refund' || $data['resolution'] === 'partial_refund') {
                $refundAmount = $data['refund_amount'] ?? $dispute->order->total;

                $this->balanceService->deposit(
                    $dispute->buyer,
                    (float) $refundAmount,
                    $dispute->order->currency,
                    "Возврат по спору #{$dispute->id}"
                );
            }

            /** @var Dispute $dispute */
            return $dispute->fresh();
        });
    }
}
