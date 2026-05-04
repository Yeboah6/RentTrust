<?php
// Simple database test without Laravel
$dbHost = 'localhost';
$dbUser = 'root';
$dbPass = '';
$dbName = 'rentwise';

try {
    $pdo = new PDO("mysql:host=$dbHost;dbname=$dbName", $dbUser, $dbPass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Check if table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'verification_requests'");
    $tableExists = $stmt->rowCount() > 0;
    
    echo "verification_requests table exists: " . ($tableExists ? "YES" : "NO") . "\n";
    
    if ($tableExists) {
        // Show table structure
        $stmt = $pdo->query("DESCRIBE verification_requests");
        echo "\nTable columns:\n";
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo "  - " . $row['Field'] . " (" . $row['Type'] . ")\n";
        }
        
        // Count records
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM verification_requests");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "\nRecords in table: " . $result['count'] . "\n";
    } else {
        echo "\nTable does not exist - need to run migration!\n";
        
        // Try to create it manually
        echo "\nAttempting to create verification_requests table...\n";
        
        $sql = "CREATE TABLE verification_requests (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            verification_request_id CHAR(36) UNIQUE NOT NULL,
            rental_id BIGINT UNSIGNED NOT NULL,
            user_id BIGINT UNSIGNED NOT NULL,
            agent_id BIGINT UNSIGNED NOT NULL,
            agent_name VARCHAR(255) NOT NULL,
            request_type ENUM('initial_verification', 're_verification') DEFAULT 'initial_verification',
            status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
            proof_documents LONGTEXT,
            ownership_documents LONGTEXT,
            license_documents LONGTEXT,
            utility_bills LONGTEXT,
            additional_notes LONGTEXT,
            admin_notes LONGTEXT,
            rejection_reason VARCHAR(500),
            submitted_at TIMESTAMP NULL,
            reviewed_at TIMESTAMP NULL,
            reviewed_by BIGINT UNSIGNED NULL,
            created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (rental_id) REFERENCES rentals(id) ON DELETE CASCADE,
            INDEX idx_rental (rental_id),
            INDEX idx_user (user_id),
            INDEX idx_status (status),
            INDEX idx_created (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
        
        $pdo->exec($sql);
        echo "✓ Table created successfully!\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
