<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use App\Jobs\TestJob;

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
