<?php
require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/bootstrap/app.php';

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use App\Models\VerificationRequest;
use App\Models\Rental;
use App\Models\User;

try {
    echo "=== Verification Debug Test ===\n\n";
    
    // 1. Check if table exists
    echo "1. Checking if verification_requests table exists...\n";
    if (Schema::hasTable('verification_requests')) {
        echo "   ✓ Table EXISTS\n";
        
        // Get column info
        $columns = Schema::getColumnListing('verification_requests');
        echo "   Columns: " . implode(', ', $columns) . "\n";
        
        // Check for required columns
        $requiredCols = ['id', 'verification_request_id', 'rental_id', 'agent_id', 'user_id', 'request_type', 'status', 'proof_documents'];
        $missing = array_diff($requiredCols, $columns);
        if ($missing) {
            echo "   ✗ Missing columns: " . implode(', ', $missing) . "\n";
        } else {
            echo "   ✓ All required columns present\n";
        }
        
        // Count records
        $count = DB::table('verification_requests')->count();
        echo "   Records in table: $count\n";
        
    } else {
        echo "   ✗ Table DOES NOT EXIST - Migration hasn't run!\n";
    }
    
    echo "\n2. Testing VerificationRequest model...\n";
    
    // Check fillable
    $model = new VerificationRequest();
    echo "   Fillable fields: " . implode(', ', $model->getFillable()) . "\n";
    
    echo "\n3. Checking Rental table...\n";
    if (Schema::hasTable('rentals')) {
        echo "   ✓ Rentals table exists\n";
        $rentalCount = DB::table('rentals')->count();
        echo "   Rentals in database: $rentalCount\n";
        
        if ($rentalCount > 0) {
            $sample = DB::table('rentals')->first();
            echo "   Sample rental ID: " . $sample->id . ", rental_id: " . $sample->rental_id . "\n";
        }
    } else {
        echo "   ✗ Rentals table doesn't exist\n";
    }
    
    echo "\n4. Testing direct VerificationRequest creation...\n";
    
    // Get a rental
    $rental = Rental::first();
    if ($rental) {
        echo "   Found rental: " . $rental->rental_id . " (id: " . $rental->id . ")\n";
        
        // Get a user
        $user = User::first();
        if ($user) {
            echo "   Found user: " . $user->id . "\n";
            
            // Try creating a verification request
            try {
                $verification = VerificationRequest::create([
                    'verification_request_id' => 'test-uuid-' . time(),
                    'rental_id' => $rental->id,
                    'user_id' => $user->id,
                    'agent_id' => $user->id,
                    'agent_name' => $user->name ?? 'Test Agent',
                    'request_type' => 'initial_verification',
                    'status' => 'pending',
                    'proof_documents' => json_encode([]),
                    'ownership_documents' => json_encode([]),
                    'license_documents' => json_encode([]),
                    'utility_bills' => json_encode([]),
                    'submitted_at' => now(),
                ]);
                
                echo "   ✓ Successfully created verification request!\n";
                echo "   Created record ID: " . $verification->id . "\n";
                
                // Verify it was saved
                $verify = VerificationRequest::find($verification->id);
                if ($verify) {
                    echo "   ✓ Record can be retrieved from database\n";
                    echo "   Retrieved ID: " . $verify->id . "\n";
                } else {
                    echo "   ✗ Record NOT found after creation!\n";
                }
                
                // Clean up test record
                VerificationRequest::destroy($verification->id);
                echo "   Cleaned up test record\n";
                
            } catch (\Exception $e) {
                echo "   ✗ Error creating verification request:\n";
                echo "   " . $e->getMessage() . "\n";
                echo "   " . $e->getFile() . " : " . $e->getLine() . "\n";
            }
        } else {
            echo "   ✗ No users found in database\n";
        }
    } else {
        echo "   ✗ No rentals found in database\n";
    }
    
    echo "\n=== Debug Test Complete ===\n";
    
} catch (\Exception $e) {
    echo "Fatal Error: " . $e->getMessage() . "\n";
    echo $e->getFile() . " : " . $e->getLine() . "\n";
}
