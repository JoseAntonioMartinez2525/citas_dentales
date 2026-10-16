<?php

namespace App\Models;

use Database\Factories\PatientFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Patient extends Model
{
    /** @use HasFactory<PatientFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'email',
        'birth_date',
        'notes',
    ];

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    public function portalAccess(): HasOne
    {
        return $this->hasOne(PatientPortalAccess::class);
    }

    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
        ];
    }
}
