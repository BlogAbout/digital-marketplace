<?php

namespace App\Console\Commands;

use App\Jobs\TestJob;
use Illuminate\Console\Command;

class TestQueue extends Command
{
    protected $signature = 'test:queue';

    protected $description = 'Test queue functionality';

    public function handle(): void
    {
        TestJob::dispatch();
        $this->info('Test job dispatched');
    }
}
