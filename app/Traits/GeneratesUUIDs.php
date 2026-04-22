<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait GeneratesUUIDs
{
    /**
     * Get a new prefixed ID for this model
     * Format: PREFIX_XXXXX (5 random characters)
     * Call this method in controllers before creating the model
     */
    public static function generateUUID()
    {
        $modelClass = class_basename(static::class);
        $prefix = static::getIdPrefix($modelClass);
        
        // Generate 5 random uppercase alphanumeric characters
        $randomPart = Str::random(5);
        
        return "{$prefix}_{$randomPart}";
    }

    /**
     * Get the ID prefix for this model
     */
    protected static function getIdPrefix($modelClass)
    {
        $prefixes = [
            'User' => 'USER',
            'Rental' => 'RENTAL',
            'Report' => 'REPORT',
            'Review' => 'REVIEW',
            'VerificationRequest' => 'VERIFY',
            'Subscription' => 'SUB',
            'Payment' => 'PAY',
            'Plan' => 'PLAN',
            'ListingView' => 'VIEW',
            'ListingInquiry' => 'INQUIRY',
            'PropertyType' => 'PTYPE',
            'Location' => 'LOC',
            'Amenity' => 'AMENITY',
            'SubscriptionAuditLog' => 'SUBAUDIT',
            'AdminAuditLog' => 'AUDIT',
            'PasswordResetToken' => 'RESET',
        ];

        return $prefixes[$modelClass] ?? 'ID';
    }

    /**
     * Get the UUID field name for this model
     */
    public static function getUuidFieldName()
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

        $modelClass = class_basename(static::class);
        return $uuidFields[$modelClass] ?? null;
    }
}
