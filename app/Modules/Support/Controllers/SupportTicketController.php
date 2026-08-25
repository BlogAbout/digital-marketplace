<?php

namespace App\Modules\Support\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Support\Models\SupportTicket;
use App\Modules\Support\Requests\CreateTicketRequest;
use App\Modules\Support\Resources\SupportTicketResource;
use App\Modules\Support\Services\SupportTicketService;
use App\Modules\User\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SupportTicketController extends Controller
{
    public function __construct(
        private readonly SupportTicketService $ticketService
    ) {}

    /**
     * Получить тикеты пользователя
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = (int) $request->get('per_page', 15);
        $status = $request->get('status');

        /** @var User $user */
        $user = $request->user();

        $tickets = SupportTicket::query()
            ->where('user_id', $user->id)
            ->when($status, function ($query) use ($status) {
                return $query->where('status', $status);
            })
            ->with(['assignedTo'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return SupportTicketResource::collection($tickets);
    }

    /**
     * Получить тикет
     */
    public function show(string $id): SupportTicketResource
    {
        $ticket = SupportTicket::query()
            ->with(['messages', 'messages.user'])
            ->findOrFail($id);

        return new SupportTicketResource($ticket);
    }

    /**
     * Создать тикет
     */
    public function store(CreateTicketRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $ticket = $this->ticketService->createTicket($user, $request->validated());

        return response()->json([
            'message' => 'Тикет успешно создан',
            'ticket' => new SupportTicketResource($ticket),
        ], 201);
    }

    /**
     * Добавить сообщение в тикет
     */
    public function addMessage(Request $request, string $id): JsonResponse
    {
        $ticket = SupportTicket::query()->findOrFail($id);

        /** @var User $user */
        $user = $request->user();

        $message = $this->ticketService->addMessage($ticket, $user, $request->all());

        return response()->json([
            'message' => 'Сообщение добавлено',
            'data' => $message,
        ], 201);
    }

    /**
     * Получить все тикеты (для админов)
     */
    public function allTickets(Request $request): AnonymousResourceCollection
    {
        $perPage = (int) $request->get('per_page', 15);
        $status = $request->get('status');
        $priority = $request->get('priority');

        /** @var User $user */
        $user = $request->user();

        if (! $user->hasRole('admin') && ! $user->hasRole('moderator')) {
            abort(403, 'Доступ запрещен');
        }

        $tickets = SupportTicket::query()
            ->when($status, function ($query) use ($status) {
                return $query->where('status', $status);
            })
            ->when($priority, function ($query) use ($priority) {
                return $query->where('priority', $priority);
            })
            ->with(['user', 'assignedTo'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return SupportTicketResource::collection($tickets);
    }

    /**
     * Назначить тикет
     */
    public function assign(Request $request, string $id): JsonResponse
    {
        $ticket = SupportTicket::query()->findOrFail($id);

        /** @var User $staff */
        $staff = User::query()->findOrFail($request->input('staff_id'));

        $ticket = $this->ticketService->assignTicket($ticket, $staff);

        return response()->json([
            'message' => 'Тикет назначен',
            'ticket' => new SupportTicketResource($ticket),
        ]);
    }

    /**
     * Решить тикет
     */
    public function resolve(string $id): JsonResponse
    {
        $ticket = SupportTicket::query()->findOrFail($id);

        $ticket = $this->ticketService->resolveTicket($ticket);

        return response()->json([
            'message' => 'Тикет решен',
            'ticket' => new SupportTicketResource($ticket),
        ]);
    }

    /**
     * Закрыть тикет
     */
    public function close(string $id): JsonResponse
    {
        $ticket = SupportTicket::query()->findOrFail($id);

        $ticket = $this->ticketService->closeTicket($ticket);

        return response()->json([
            'message' => 'Тикет закрыт',
            'ticket' => new SupportTicketResource($ticket),
        ]);
    }
}
