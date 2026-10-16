<?php

namespace App\Models;

use Database\Factories\ServiceFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    /** @use HasFactory<ServiceFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'duration_minutes',
        'buffer_minutes',
        'requires_assessment',
        'is_active',
        'sort_order',
    ];

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    protected function casts(): array
    {
        return [
            'duration_minutes' => 'integer',
            'buffer_minutes' => 'integer',
            'requires_assessment' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
