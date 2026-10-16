<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CardSortingResponse extends Model
{
    protected $fillable = [
        'groups',
        'submitted_at',
    ];

    protected function casts(): array
    {
        return [
            'groups' => 'array',
            'submitted_at' => 'datetime',
        ];
    }
}
