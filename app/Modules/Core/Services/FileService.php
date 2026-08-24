<?php

namespace App\Modules\Core\Services;

use App\Modules\Core\Models\File;
use App\Modules\User\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileService
{
    /**
     * Загрузить файл
     *
     * @param  UploadedFile  $file
     * @param  User  $user
     * @param  string  $type
     * @param  string|null  $directory
     * @return File
     */
    public function uploadFile(UploadedFile $file, User $user, string $type = 'general', ?string $directory = null): File
    {
        $originalName = $file->getClientOriginalName();
        $mimeType = $file->getMimeType();
        $size = $file->getSize();
        $extension = $file->getClientOriginalExtension();

        // Генерируем уникальное имя файла
        $name = Str::uuid7() . ($extension ? '.' . $extension : '');

        // Определяем директорию для сохранения
        $path = $directory ?? $this->getDirectoryByType($type, $user->id);

        // Сохраняем файл
        $storedPath = $file->storeAs($path, $name, 'public');

        // Создаем запись в БД
        $fileModel = File::create([
            'name' => $name,
            'original_name' => $originalName,
            'mime_type' => $mimeType,
            'size' => $size,
            'path' => $storedPath,
            'disk' => 'public',
            'type' => $type,
            'author_id' => $user->id,
        ]);

        return $fileModel;
    }

    /**
     * Загрузить несколько файлов
     *
     * @param  array<int, UploadedFile>  $files
     * @param  User  $user
     * @param  string  $type
     * @return array<int, File>
     */
    public function uploadFiles(array $files, User $user, string $type = 'gallery'): array
    {
        $uploadedFiles = [];

        foreach ($files as $file) {
            $uploadedFiles[] = $this->uploadFile($file, $user, $type);
        }

        return $uploadedFiles;
    }

    /**
     * Удалить файл
     */
    public function deleteFile(File $file): bool
    {
        // Удаляем из хранилища
        if ($file->exists()) {
            Storage::disk($file->disk)->delete($file->path);
        }

        // Удаляем из БД
        return $file->delete();
    }

    /**
     * Клонировать файл для скачивания
     */
    public function cloneFileForDownload(File $file, string $directory = 'downloads'): File
    {
        $extension = pathinfo($file->original_name, PATHINFO_EXTENSION);
        $newName = Str::uuid7() . ($extension ? '.' . $extension : '');
        $newPath = $directory . '/' . $newName;

        // Копируем файл
        Storage::disk($file->disk)->copy($file->path, $newPath);

        // Создаем новую запись
        $clonedFile = File::create([
            'name' => $newName,
            'original_name' => $file->original_name,
            'mime_type' => $file->mime_type,
            'size' => $file->size,
            'path' => $newPath,
            'disk' => $file->disk,
            'type' => 'download',
            'author_id' => $file->author_id,
        ]);

        return $clonedFile;
    }

    /**
     * Получить директорию по типу файла
     */
    protected function getDirectoryByType(string $type, string $userId): string
    {
        return match ($type) {
            'avatar' => 'avatars/' . $userId,
            'product' => 'products/' . $userId,
            'gallery' => 'gallery/' . $userId,
            'message' => 'messages/' . $userId,
            'blog' => 'blogs/' . $userId,
            'download' => 'downloads/' . $userId,
            default => 'files/' . $userId,
        };
    }
}
