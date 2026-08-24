<?php

namespace App\Modules\Social\Events;

use App\Modules\Blog\Models\BlogPost;
use App\Modules\User\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PostPublished
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * @var BlogPost
     */
    public BlogPost $post;

    /**
     * @var User
     */
    public User $user;

    /**
     * Create a new event instance.
     */
    public function __construct(BlogPost $post, User $user)
    {
        $this->post = $post;
        $this->user = $user;
    }
}
