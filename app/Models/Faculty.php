<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Faculty extends Model
{
    use HasFactory;

    protected $table = 'faculty';

    protected $fillable = [
        'user_id',
        'employee_id',
        'department_id',
        'position',
        'employment_type',
        'salary',
        'phone',
        'address',
        'qualifications',
        'specializations',
    ];

    protected $appends = [
        'user_name',
        'user_email',
        'department_name',
    ];

    /**
     * Get the user that owns the faculty record.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the department that the faculty belongs to.
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Accessors for flattened data
     */
    public function getUserNameAttribute(): string
    {
        return $this->user?->name ?? 'Unknown';
    }

    public function getUserEmailAttribute(): string
    {
        return $this->user?->email ?? 'Unknown';
    }

    public function getDepartmentNameAttribute(): string
    {
        return $this->department?->name ?? 'Unknown';
    }
}
