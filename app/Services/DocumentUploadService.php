<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DocumentUploadService
{
    protected $disk;

    public function __construct()
    {
        $this->disk = config('filesystems.default');
    }

    /**
     * Upload a document and return structured data
     */
    public function upload(UploadedFile $file, string $directory, int $userId): array
    {
        $originalName = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        $mimeType = $file->getMimeType();
        $size = $file->getSize();

        // Generate unique filename
        $filename = sprintf(
            '%s_%s_%s.%s',
            Str::slug(pathinfo($originalName, PATHINFO_FILENAME), '_'),
            Str::random(8),
            time(),
            $extension
        );

        // Create directory structure: verification/{type}/{user_id}/{year}/{month}/
        $path = sprintf(
            '%s/%d/%s/%s',
            $directory,
            $userId,
            date('Y'),
            date('m')
        );

        // Store file
        $storedPath = $file->storeAs($path, $filename, [
            'visibility' => 'private',
            'directory_visibility' => 'private',
        ]);

        return [
            'original_name' => $originalName,
            'filename' => $filename,
            'path' => $storedPath,
            'url' => Storage::url($storedPath),
            'mime_type' => $mimeType,
            'size' => $size,
            'extension' => $extension,
            'uploaded_at' => now()->toDateTimeString(),
        ];
    }

    /**
     * Delete a document from storage
     */
    public function delete(string $path): bool
    {
        if (Storage::exists($path)) {
            return Storage::delete($path);
        }
        return false;
    }

    /**
     * Generate a temporary URL for private files
     */
    public function getTemporaryUrl(string $path, int $minutes = 5): string
    {
        return Storage::temporaryUrl($path, now()->addMinutes($minutes));
    }

    /**
     * Validate file type and size
     */
    public function validate(UploadedFile $file, array $allowedMimes = [], int $maxSize = 10240): bool
    {
        // Check mime type
        if (!empty($allowedMimes) && !in_array($file->getMimeType(), $allowedMimes)) {
            return false;
        }

        // Check size (in KB)
        if ($file->getSize() > ($maxSize * 1024)) {
            return false;
        }

        return true;
    }
}