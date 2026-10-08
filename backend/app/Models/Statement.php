<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Statement extends Model
{
    protected $fillable = ['investment_id', 'period', 'version', 'correction_of_id'];

    /** @return BelongsTo<Investment, $this> */
    public function investment(): BelongsTo
    {
        return $this->belongsTo(Investment::class);
    }

    /** @return BelongsTo<Statement, $this> */
    public function correctionOf(): BelongsTo
    {
        return $this->belongsTo(Statement::class, 'correction_of_id');
    }
}
