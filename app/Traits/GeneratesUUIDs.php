<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait GeneratesUUIDs
{
    /**
     * Boot the trait and set up UUID generation
     */
    public static function bootGeneratesUUIDs()
    {
        static::creating(function ($model) {
            $uuidField = $model->getUuidField();
            if ($uuidField && !$model->{$uuidField}) {
                $model->{$uuidField} = Str::uuid()->toString();
            }
        });
    }

    /**
     * Get the UUID field name for this model
     */
    protected function getUuidField()
    {
        // Map of models to their UUID field names
        $uuidFields = [
            'User' => 'user_id',
            'Rental' => 'rental_id',
            'Report' => 'report_id',
            'Review' => 'review_id',
            'VerificationRequest' => 'verification_request_id',
            'Subscription' => 'subscription_uuid',
            'Payment' => 'payment_id',
            'Plan' => 'plan_id',
            'ListingView' => 'listing_view_id',
            'ListingInquiry' => 'listing_inquiry_id',
            'PropertyType' => 'property_type_id',
            'Location' => 'location_id',
            'Amenity' => 'amenity_id',
            'SubscriptionAuditLog' => 'subscription_audit_log_id',
            'AdminAuditLog' => 'admin_audit_log_id',
            'PasswordResetToken' => 'token_id',
        ];

        $modelClass = class_basename($this);
        return $uuidFields[$modelClass] ?? null;
    }
}
