<?php

namespace App\Modules\Shop\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Shop\Models\ShopProduct;
use App\Modules\Shop\Models\ShopProductComment;
use App\Modules\Shop\Requests\AddCommentRequest;
use App\Modules\Shop\Resources\CommentResource;
use App\Modules\Shop\Services\CommentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CommentController extends Controller
{
    public function __construct(
        private readonly CommentService $commentService
    ) {}

    public function index(Request $request, string $productId): AnonymousResourceCollection
    {
        $product = ShopProduct::query()->findOrFail($productId);
        $comments = $this->commentService->getProductComments($product);

        return CommentResource::collection($comments);
    }

    public function store(AddCommentRequest $request, string $productId): JsonResponse
    {
        $product = ShopProduct::query()->findOrFail($productId);
        $comment = $this->commentService->addComment(
            $product,
            $request->user(),
            $request->validated()
        );

        return response()->json([
            'message' => 'Комментарий добавлен',
            'comment' => new CommentResource($comment),
        ], 201);
    }

    public function like(string $id): JsonResponse
    {
        $comment = ShopProductComment::query()->findOrFail($id);
        $this->commentService->likeComment($comment);

        return response()->json([
            'message' => 'Лайк добавлен',
            'likes_count' => $comment->likes_count,
        ]);
    }

    public function unlike(string $id): JsonResponse
    {
        $comment = ShopProductComment::query()->findOrFail($id);
        $this->commentService->unlikeComment($comment);

        return response()->json([
            'message' => 'Лайк убран',
            'likes_count' => $comment->likes_count,
        ]);
    }
}
