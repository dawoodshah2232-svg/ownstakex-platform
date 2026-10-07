<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    protected $fillable = [
        'code', 'name', 'slug', 'category', 'location', 'tagline', 'description',
        'capital', 'units', 'unit_price', 'min_units', 'max_units', 'reserved', 'funded',
        'status', 'version', 'campaign_ends', 'long_stop', 'operator', 'issuer',
        'cover_image', 'video_url',
    ];

    protected $casts = [
            'capital' => 'decimal:2',
            'unit_price' => 'decimal:2',
            'campaign_ends' => 'date',
            'long_stop' => 'date',
        ];

    /** @return HasMany<ProjectImage> */
    public function images(): HasMany
    {
        return $this->hasMany(ProjectImage::class)->orderBy('sort_order');
    }

    /** @return HasMany<Document> */
    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    /** @return HasMany<Reservation> */
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    /** @return HasMany<Investment> */
    public function investments(): HasMany
    {
        return $this->hasMany(Investment::class);
    }

    /** @return HasMany<Distribution> */
    public function distributions(): HasMany
    {
        return $this->hasMany(Distribution::class);
    }

    public function availableUnits(): int
    {
        return max(0, $this->units - $this->reserved - $this->funded);
    }

    public function allocatedPercent(): float
    {
        if (! $this->units) {
            return 0.0;
        }

        return round(($this->reserved + $this->funded) / $this->units * 100, 1);
    }
}
