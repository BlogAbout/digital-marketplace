<?php

namespace App\Modules\Shop\Events;

use App\Modules\Shop\Models\ShopProductComment;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CommentAdded implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public ShopProductComment $comment;

    public function __construct(ShopProductComment $comment)
    {
        $this->comment = $comment->load(['user', 'replies']);
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('product.' . $this->comment->product_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'comment.added';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->comment->id,
            'product_id' => $this->comment->product_id,
            'user_id' => $this->comment->user_id,
            'parent_id' => $this->comment->parent_id,
            'content' => $this->comment->content,
            'rating' => $this->comment->rating,
            'likes_count' => $this->comment->likes_count,
            'user' => [
                'id' => $this->comment->user?->id,
                'name' => $this->comment->user?->name,
            ],
            'created_at' => $this->comment->created_at,
        ];
    }
}
