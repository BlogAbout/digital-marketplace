<?php

namespace App\Providers;

use App\Modules\Social\Events\PostPublished;
use App\Modules\Social\Events\ProductCreated;
use App\Modules\Social\Events\ProductUpdated;
use App\Modules\Social\Listeners\CreateActivityAndNotify;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        ProductCreated::class => [
            CreateActivityAndNotify::class,
        ],
        ProductUpdated::class => [
            CreateActivityAndNotify::class,
        ],
        PostPublished::class => [
            CreateActivityAndNotify::class,
        ],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        parent::boot();
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
