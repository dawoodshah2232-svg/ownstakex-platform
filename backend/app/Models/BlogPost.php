<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlogPost extends Model
{
    protected $fillable = [
        'slug', 'title', 'excerpt', 'body', 'cover_image', 'tag', 'read_time', 'published_at',
    ];

    protected function casts(): array
    {
        return ['published_at' => 'datetime'];
    }
}
