<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SusResponse extends Model
{
    protected $fillable = [
        'answers',
        'score',
        'submitted_at',
    ];

    protected function casts(): array
    {
        return [
            'answers' => 'array',
            'score' => 'decimal:2',
            'submitted_at' => 'datetime',
        ];
    }
}
