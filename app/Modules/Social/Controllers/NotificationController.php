<?php

namespace App\Modules\Social\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Social\Models\Notification;
use App\Modules\Social\Resources\NotificationResource;
use App\Modules\Social\Services\NotificationService;
use App\Modules\User\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class NotificationController extends Controller
{
    public function __construct(
        private readonly NotificationService $notificationService
    ) {}

    /**
     * Получить уведомления
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = (int) $request->get('per_page', 15);
        $unreadOnly = $request->get('unread_only', false);

        /** @var User $user */
        $user = $request->user();

        $notifications = Notification::query()
            ->where('user_id', $user->id)
            ->when($unreadOnly, function ($query) {
                return $query->whereNull('read_at');
            })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return NotificationResource::collection($notifications);
    }

    /**
     * Получить количество непрочитанных уведомлений
     */
    public function unreadCount(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $count = $this->notificationService->getUnreadCount($user);

        return response()->json([
            'unread_count' => $count,
        ]);
    }

    /**
     * Отметить уведомление как прочитанное
     */
    public function markAsRead(string $id): JsonResponse
    {
        $notification = Notification::query()->findOrFail($id);

        $this->notificationService->markAsRead($notification);

        return response()->json([
            'message' => 'Уведомление отмечено как прочитанное',
        ]);
    }

    /**
     * Отметить все уведомления как прочитанные
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $this->notificationService->markAllAsRead($user);

        return response()->json([
            'message' => 'Все уведомления отмечены как прочитанные',
        ]);
    }
}
