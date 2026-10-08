<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Poll extends Model
{
    protected $fillable = ['project_id', 'question', 'options', 'closes_at'];

    protected $casts = [
        'options' => 'array',
        'closes_at' => 'datetime',
    ];

    /** @return BelongsTo<Project, $this> */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /** @return HasMany<PollVote> */
    public function votes(): HasMany
    {
        return $this->hasMany(PollVote::class);
    }

    /**
     * Open when closes_at is unset or in the future.
     */
    public function isOpen(): bool
    {
        return $this->closes_at === null || $this->closes_at->isFuture();
    }

    /**
     * Votes counted per option index (0-based).
     *
     * @return array<int, int>
     */
    public function votesPerOption(): array
    {
        $counts = array_fill(0, count($this->options ?? []), 0);

        foreach ($this->votes()->pluck('option_index') as $index) {
            if (isset($counts[$index])) {
                $counts[$index]++;
            }
        }

        return $counts;
    }
}
