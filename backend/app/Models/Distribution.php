<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Distribution extends Model
{
    public $timestamps = false;

    protected $fillable = ['project_id', 'amount', 'per_unit', 'note', 'paid_at'];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'per_unit' => 'decimal:2',
            'paid_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<Project, $this> */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
