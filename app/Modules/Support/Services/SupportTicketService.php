<?php

namespace App\Modules\Support\Services;

use App\Modules\Support\Models\SupportTicket;
use App\Modules\Support\Models\SupportTicketMessage;
use App\Modules\User\Models\User;
use Illuminate\Support\Facades\DB;

class SupportTicketService
{
    /**
     * Создать тикет
     *
     * @param array<string, mixed> $data
     */
    public function createTicket(User $user, array $data): SupportTicket
    {
        /** @var SupportTicket $ticket */
        $ticket = SupportTicket::create([
            'user_id' => $user->id,
            'subject' => $data['subject'],
            'description' => $data['description'],
            'priority' => $data['priority'] ?? 'normal',
            'category' => $data['category'] ?? 'general',
            'related_order_id' => $data['related_order_id'] ?? null,
            'related_product_id' => $data['related_product_id'] ?? null,
            'status' => 'open',
        ]);

        return $ticket;
    }

    /**
     * Добавить сообщение в тикет
     *
     * @param array<string, mixed> $data
     */
    public function addMessage(SupportTicket $ticket, User $user, array $data): SupportTicketMessage
    {
        /** @var SupportTicketMessage $message */
        $message = SupportTicketMessage::create([
            'ticket_id' => $ticket->id,
            'user_id' => $user->id,
            'message' => $data['message'],
            'attachments' => $data['attachments'] ?? null,
            'is_internal' => $data['is_internal'] ?? false,
        ]);

        // Если тикет был закрыт, переоткрываем
        if ($ticket->status === 'closed') {
            $ticket->update(['status' => 'open']);
        }

        return $message;
    }

    /**
     * Назначить тикет сотруднику
     */
    public function assignTicket(SupportTicket $ticket, User $staff): SupportTicket
    {
        $ticket->update([
            'assigned_to' => $staff->id,
            'status' => 'in_progress',
        ]);

        /** @var SupportTicket $ticket */
        return $ticket->fresh();
    }

    /**
     * Решить тикет
     */
    public function resolveTicket(SupportTicket $ticket): SupportTicket
    {
        $ticket->update([
            'status' => 'resolved',
            'resolved_at' => now(),
        ]);

        /** @var SupportTicket $ticket */
        return $ticket->fresh();
    }

    /**
     * Закрыть тикет
     */
    public function closeTicket(SupportTicket $ticket): SupportTicket
    {
        $ticket->update([
            'status' => 'closed',
            'closed_at' => now(),
        ]);

        /** @var SupportTicket $ticket */
        return $ticket->fresh();
    }
}
