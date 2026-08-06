<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Rental;
// use App\Traits\GeneratesUUIDs;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'role',
        'type',
        'company',
        'bio',
        'status',
        'fee',
        'package',
        'password',
        'last_active',
        'setup_token',
        'setup_token_expires_at',
        'location',
    ];

    public function rentals()
    {
        return $this->hasMany(Rental::class, 'user_id');
    }

    public function reviews()
    {
        return $this->hasManyThrough(
            \App\Models\Review::class,
            \App\Models\Rental::class,
            'user_id',      // Foreign key on rentals table
            'rental_id',    // Foreign key on reviews table
            'id',           // Local key on users table
            'id'            // Local key on rentals table
        );
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'setup_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password'              => 'hashed',
            'last_active'           => 'datetime',
            'setup_token_expires_at'=> 'datetime',
        ];
    }

    protected static function boot(): void
    {
        parent::boot();
 
        static::creating(function (User $user) {
            if (empty($user->user_id)) {
                $user->user_id = (string) Str::uuid();
            }
        });
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isAgent(): bool
    {
        return $this->role === 'agent';
    }
 
    public function isTenant(): bool
    {
        return $this->role === 'tenant';
    }
 
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function verification()
    {
        return $this->hasOne(\App\Models\AgentVerification::class, 'agent_id');
    }

    public function subscription()
    {
        return $this->hasOne(Subscription::class)->latestOfMany('ends_at');
    }

    public function getRouteKeyName()
    {
        return 'id'; 
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function isSubscribedTo(string $planSlug): bool
    {
        return $this->subscription?->isActive()
            && $this->subscription->plan->slug === $planSlug;
    }

    public function hasActiveSubscription(): bool
    {
        return $this->subscription?->isActive() ?? false;
    }
}
