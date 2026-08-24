<?php

namespace App\Modules\Social\Events;

use App\Modules\Shop\Models\ShopProduct;
use App\Modules\User\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProductUpdated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * @var ShopProduct
     */
    public ShopProduct $product;

    /**
     * @var User
     */
    public User $user;

    /**
     * Create a new event instance.
     */
    public function __construct(ShopProduct $product, User $user)
    {
        $this->product = $product;
        $this->user = $user;
    }
}
