<?php

namespace App\Modules\Messenger\Events;

use App\Modules\Messenger\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * @var Message
     */
    public Message $message;

    /**
     * Create a new event instance.
     */
    public function __construct(Message $message)
    {
        $this->message = $message->load(['user', 'replyTo']);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('chat.' . $this->message->chat_id),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'message.sent';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'id' => $this->message->id,
            'chat_id' => $this->message->chat_id,
            'user_id' => $this->message->user_id,
            'text' => $this->message->text,
            'media' => $this->message->media,
            'mentions' => $this->message->mentions,
            'reply_to_id' => $this->message->reply_to_id,
            'thread_id' => $this->message->thread_id,
            'is_edited' => $this->message->is_edited,
            'user' => [
                'id' => $this->message->user?->id,
                'name' => $this->message->user?->name,
            ],
            'created_at' => $this->message->created_at,
        ];
    }
}
