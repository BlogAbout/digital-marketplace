<?php

namespace App\Modules\Core\Models;

use App\Modules\Core\BaseModel;
use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class File extends BaseModel
{
    /**
     * @var string
     */
    protected $table = 'file';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'original_name',
        'mime_type',
        'size',
        'path',
        'disk',
        'type',
        'author_id',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'size' => 'integer',
    ];

    /**
     * Автор файла
     *
     * @return BelongsTo<User, $this>
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id', 'id');
    }

    /**
     * Полиморфная связь с владельцем файла
     *
     * @return MorphTo
     */
    public function fileable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Получить URL файла
     */
    public function getUrl(): string
    {
        return Storage::disk($this->disk)->url($this->path);
    }

    /**
     * Получить временный URL для скачивания
     */
    public function getTemporaryUrl(int $minutes = 60): string
    {
        return Storage::disk($this->disk)->temporaryUrl(
            $this->path,
            now()->addMinutes($minutes)
        );
    }

    /**
     * Получить содержимое файла
     */
    public function getContent(): ?string
    {
        return Storage::disk($this->disk)->get($this->path);
    }

    /**
     * Проверить существование файла
     */
    public function exists(): bool
    {
        return Storage::disk($this->disk)->exists($this->path);
    }

    /**
     * Удалить файл из хранилища
     */
    public function deleteFile(): bool
    {
        if ($this->exists()) {
            return Storage::disk($this->disk)->delete($this->path);
        }

        return true;
    }

    /**
     * Получить размер файла в читаемом формате
     */
    public function getHumanReadableSize(): string
    {
        $bytes = $this->size;
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        for ($i = 0; $bytes > 1024; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }

    /**
     * Получить расширение файла
     */
    public function getExtension(): string
    {
        return pathinfo($this->original_name, PATHINFO_EXTENSION);
    }

    /**
     * Проверить, является ли файл изображением
     */
    public function isImage(): bool
    {
        return Str::startsWith($this->mime_type, 'image/');
    }

    /**
     * Проверить, является ли файл видео
     */
    public function isVideo(): bool
    {
        return Str::startsWith($this->mime_type, 'video/');
    }

    /**
     * Проверить, является ли файл аудио
     */
    public function isAudio(): bool
    {
        return Str::startsWith($this->mime_type, 'audio/');
    }

    /**
     * Проверить, является ли файл документом
     */
    public function isDocument(): bool
    {
        return in_array($this->mime_type, [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        ]);
    }

    /**
     * Проверить, является ли файл архивом
     */
    public function isArchive(): bool
    {
        return in_array($this->mime_type, [
            'application/zip',
            'application/x-rar-compressed',
            'application/x-7z-compressed',
            'application/x-tar',
            'application/gzip',
        ]);
    }

    /**
     * Получить тип файла
     */
    public function getFileType(): string
    {
        if ($this->isImage()) {
            return 'image';
        }

        if ($this->isVideo()) {
            return 'video';
        }

        if ($this->isAudio()) {
            return 'audio';
        }

        if ($this->isDocument()) {
            return 'document';
        }

        if ($this->isArchive()) {
            return 'archive';
        }

        return 'other';
    }
}
