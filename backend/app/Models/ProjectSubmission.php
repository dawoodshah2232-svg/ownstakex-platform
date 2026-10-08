<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectSubmission extends Model
{
    protected $fillable = ['name', 'email', 'company', 'role', 'asset_type', 'funding_aed', 'location', 'description', 'files'];

    protected $casts = ['funding_aed' => 'decimal:2'];
}
