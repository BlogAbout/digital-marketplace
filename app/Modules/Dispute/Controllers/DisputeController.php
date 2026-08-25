<?php

namespace App\Modules\Dispute\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Dispute\Models\Dispute;
use App\Modules\Dispute\Requests\AddDisputeMessageRequest;
use App\Modules\Dispute\Requests\CreateDisputeRequest;
use App\Modules\Dispute\Requests\ResolveDisputeRequest;
use App\Modules\Dispute\Resources\DisputeResource;
use App\Modules\Dispute\Services\DisputeService;
use App\Modules\Shop\Models\ShopOrder;
use App\Modules\User\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class DisputeController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private readonly DisputeService $disputeService
    ) {}

    /**
     * Получить споры пользователя
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = (int) $request->get('per_page', 15);
        $status = $request->get('status');

        /** @var User $user */
        $user = $request->user();

        $disputes = Dispute::query()
            ->where(function ($query) use ($user) {
                $query->where('buyer_id', $user->id)
                    ->orWhere('seller_id', $user->id);
            })
            ->when($status, function ($query) use ($status) {
                return $query->where('status', $status);
            })
            ->with(['buyer', 'seller'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return DisputeResource::collection($disputes);
    }

    /**
     * Получить спор
     */
    public function show(string $id): DisputeResource
    {
        $dispute = Dispute::query()
            ->with(['buyer', 'seller', 'messages', 'messages.user'])
            ->findOrFail($id);

        return new DisputeResource($dispute);
    }

    /**
     * Создать спор
     */
    public function store(CreateDisputeRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        /** @var ShopOrder $order */
        $order = ShopOrder::query()->findOrFail($request->input('order_id'));

        try {
            $dispute = $this->disputeService->createDispute(
                $order,
                $user,
                $request->validated()
            );

            return response()->json([
                'message' => 'Спор успешно создан',
                'dispute' => new DisputeResource($dispute),
            ], 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Добавить сообщение в спор
     */
    public function addMessage(AddDisputeMessageRequest $request, string $id): JsonResponse
    {
        $dispute = Dispute::query()->findOrFail($id);

        /** @var User $user */
        $user = $request->user();

        try {
            $message = $this->disputeService->addMessage(
                $dispute,
                $user,
                $request->validated()
            );

            return response()->json([
                'message' => 'Сообщение добавлено',
                'data' => $message,
            ], 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Разрешить спор
     */
    public function resolve(ResolveDisputeRequest $request, string $id): JsonResponse
    {
        $dispute = Dispute::query()->findOrFail($id);

        /** @var User $user */
        $user = $request->user();

        if (! $user->hasRole('admin') && ! $user->hasRole('moderator')) {
            return response()->json([
                'message' => 'Доступ запрещен',
            ], 403);
        }

        $dispute = $this->disputeService->resolveDispute(
            $dispute,
            $user,
            $request->validated()
        );

        return response()->json([
            'message' => 'Спор успешно разрешен',
            'dispute' => new DisputeResource($dispute),
        ]);
    }
}
