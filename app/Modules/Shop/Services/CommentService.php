<?php

namespace App\Modules\Shop\Services;

use App\Modules\Shop\Events\CommentAdded;
use App\Modules\Shop\Models\ShopProduct;
use App\Modules\Shop\Models\ShopProductComment;
use App\Modules\User\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class CommentService
{
    public function addComment(ShopProduct $product, User $user, array $data): ShopProductComment
    {
        $comment = ShopProductComment::create([
            'product_id' => $product->id,
            'user_id' => $user->id,
            'parent_id' => $data['parent_id'] ?? null,
            'content' => $data['content'],
            'rating' => $data['rating'] ?? null,
            'is_approved' => true,
        ]);

        broadcast(new CommentAdded($comment))->toOthers();

        return $comment;
    }

    public function likeComment(ShopProductComment $comment): void
    {
        $comment->update(['likes_count' => $comment->likes_count + 1]);
    }

    public function unlikeComment(ShopProductComment $comment): void
    {
        if ($comment->likes_count > 0) {
            $comment->update(['likes_count' => $comment->likes_count - 1]);
        }
    }

    /**
     * @return LengthAwarePaginator<int, ShopProductComment>
     */
    public function getProductComments(ShopProduct $product, int $perPage = 20): LengthAwarePaginator
    {
        /** @var LengthAwarePaginator<int, ShopProductComment> $comments */
        $comments = ShopProductComment::query()
            ->where('product_id', $product->id)
            ->whereNull('parent_id')
            ->where('is_approved', true)
            ->with(['user', 'replies.user'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return $comments;
    }
}
