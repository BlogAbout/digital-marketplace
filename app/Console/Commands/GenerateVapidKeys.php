<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class GenerateVapidKeys extends Command
{
    protected $signature = 'vapid:generate';
    protected $description = 'Generate VAPID keys for Web Push notifications';

    public function handle(): int
    {
        try {
            $keys = \Minishlink\WebPush\VAPID::createVapidKeys();

            $this->info('VAPID keys generated successfully!');
            $this->newLine();
            $this->info('Public Key:');
            $this->line($keys['publicKey']);
            $this->newLine();
            $this->info('Private Key:');
            $this->line($keys['privateKey']);
            $this->newLine();
            $this->info('Add these to your .env file:');
            $this->line("VAPID_PUBLIC_KEY={$keys['publicKey']}");
            $this->line("VAPID_PRIVATE_KEY={$keys['privateKey']}");

            return self::SUCCESS;
        } catch (\Exception $e) {
            $this->error('Failed to generate VAPID keys: ' . $e->getMessage());
            return self::FAILURE;
        }
    }
}
