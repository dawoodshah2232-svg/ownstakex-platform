<?php

namespace App\Models;

use App\Support\DeadlineSeverity;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    protected $fillable = [
        'code', 'name', 'slug', 'category', 'location', 'tagline', 'description',
        'capital', 'units', 'unit_price', 'min_units', 'max_units', 'reserved', 'funded',
        'status', 'version', 'campaign_ends', 'long_stop', 'operator', 'issuer',
        'cover_image', 'video_url',
        'closing_date', 'closing_original_date', 'extension_history', 'held_units',
    ];

    protected $casts = [
            'capital' => 'decimal:2',
            'unit_price' => 'decimal:2',
            'campaign_ends' => 'date',
            'long_stop' => 'date',
            'closing_date' => 'datetime',
            'closing_original_date' => 'datetime',
            'extension_history' => 'array',
            'held_units' => 'integer',
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

    /** @return HasMany<Poll> */
    public function polls(): HasMany
    {
        return $this->hasMany(Poll::class);
    }

    /**
     * Deadline severity array — mirrors the static demo's dlSev() bands.
     *
     * @return Attribute<array{key: string, label: string, days_left: float|null}, never>
     */
    protected function deadline(): Attribute
    {
        return Attribute::get(fn (): array => DeadlineSeverity::band($this->closing_date));
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
