<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'title',
        'details',
        'page',
        'tab',
        'is_read',
        'is_archived',
        'is_transactional',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'is_archived' => 'boolean',
        'is_transactional' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
