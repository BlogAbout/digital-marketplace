<?php

namespace App\Modules\Shop\Services;

use App\Modules\Shop\Events\CommentAdded;
use App\Modules\Shop\Models\ShopProduct;
use App\Modules\Shop\Models\ShopProductComment;
use App\Modules\User\Models\User;

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
        $comment->increment('likes_count');
    }

    public function unlikeComment(ShopProductComment $comment): void
    {
        if ($comment->likes_count > 0) {
            $comment->decrement('likes_count');
        }
    }

    public function getProductComments(ShopProduct $product, int $perPage = 20)
    {
        return ShopProductComment::query()
            ->where('product_id', $product->id)
            ->whereNull('parent_id')
            ->where('is_approved', true)
            ->with(['user', 'replies.user'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }
}
