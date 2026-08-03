<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('listing_verifications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('listing_id');
            $table->unsignedBigInteger('user_id');
            $table->string('property_title');
            $table->string('property_address');
            $table->text('ownership_documents')->nullable();
            $table->text('photos')->nullable();
            $table->string('availability_status')->default('available');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('other_documents')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->text('notes')->nullable();
            $table->text('admin_notes')->nullable();
            $table->string('reviewed_by')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listing_verifications');
    }
};
