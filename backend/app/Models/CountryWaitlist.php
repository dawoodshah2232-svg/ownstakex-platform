<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CountryWaitlist extends Model
{
    protected $table = 'country_waitlist';

    protected $fillable = ['name', 'email', 'country', 'country_code'];

    protected $casts = ['notified_at' => 'datetime'];
}
