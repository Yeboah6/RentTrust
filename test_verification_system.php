<?php
require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/bootstrap/app.php';

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use App\Models\VerificationRequest;
use App\Models\Rental;
use App\Models\User;

echo "================================\n";
echo "VERIFICATION SYSTEM TEST\n";
echo "================================\n\n";

try {
    // Step 1: Ensure database file exists
    $dbPath = database_path('database.sqlite');
    echo "1. Database File Check\n";
    echo "   Path: $dbPath\n";
    if (file_exists($dbPath)) {
        echo "   ✓ Database file exists\n";
        echo "   Size: " . filesize($dbPath) . " bytes\n";
    } else {
        echo "   ✗ Database file does NOT exist\n";
        // Try to create it by running migrations
        echo "   Running migrations...\n";
        \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
    }
    
    // Step 2: Check table existence
    echo "\n2. Table Existence Check\n";
    
    $tables = ['rentals', 'users', 'verification_requests'];
    foreach ($tables as $table) {
        $exists = Schema::hasTable($table);
        echo "   " . ($exists ? "✓" : "✗") . " Table '$table': " . ($exists ? "EXISTS" : "MISSING") . "\n";
        
        if ($exists && $table === 'verification_requests') {
            $columns = Schema::getColumnListing($table);
            echo "     Columns: " . implode(', ', array_slice($columns, 0, 5)) . "...\n";
        }
    }
    
    // Step 3: Check data existence
    echo "\n3. Data Availability Check\n";
    
    $userCount = DB::table('users')->count();
    $rentalCount = DB::table('rentals')->count();
    $verificationCount = DB::table('verification_requests')->count();
    
    echo "   Users: $userCount\n";
    echo "   Rentals: $rentalCount\n";
    echo "   Verification Requests: $verificationCount\n";
    
    // Step 4: Test model relationships
    echo "\n4. Model & Relationship Test\n";
    
    if ($rentalCount > 0 && $userCount > 0) {
        $rental = Rental::first();
        $user = User::first();
        
        echo "   Sample Rental: " . ($rental ? $rental->title : "N/A") . "\n";
        echo "   Sample User: " . ($user ? $user->name : "N/A") . "\n";
        
        // Test creating a verification request
        echo "\n5. Creating Test Verification Request\n";
        
        $verification = VerificationRequest::create([
            'verification_request_id' => 'test-' . time() . '-' . uniqid(),
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
            'additional_notes' => 'Test note',
            'submitted_at' => now(),
        ]);
        
        echo "   ✓ Verification request created with ID: " . $verification->id . "\n";
        echo "   Request ID: " . $verification->verification_request_id . "\n";
        
        // Try to retrieve it
        echo "\n6. Retrieving Test Record\n";
        $retrieved = VerificationRequest::find($verification->id);
        if ($retrieved) {
            echo "   ✓ Record retrieved successfully\n";
            echo "   Status: " . $retrieved->status . "\n";
            echo "   Rental ID: " . $retrieved->rental_id . "\n";
        } else {
            echo "   ✗ Record NOT found after creation!\n";
        }
        
        // Clean up
        VerificationRequest::destroy($verification->id);
        echo "   ✓ Test record cleaned up\n";
        
    } else {
        echo "   ✗ No rental or user data available for testing\n";
        echo "   Please seed the database first\n";
    }
    
    echo "\n================================\n";
    echo "TEST COMPLETE\n";
    echo "================================\n";
    
} catch (\Exception $e) {
    echo "\nERROR: " . $e->getMessage() . "\n";
    echo $e->getFile() . " : " . $e->getLine() . "\n";
    echo "\nStack Trace:\n" . $e->getTraceAsString() . "\n";
}
?>
