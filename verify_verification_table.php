<?php
// Verify verification_requests table
$dbPath = __DIR__ . '/database/database.sqlite';

try {
    $pdo = new PDO('sqlite:' . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Check if verification_requests table exists
    $stmt = $pdo->query("SELECT name FROM sqlite_master WHERE type='table' AND name='verification_requests'");
    $result = $stmt->fetch();
    
    if ($result) {
        echo "SUCCESS: verification_requests table exists!\n\n";
        
        // Get table info
        $stmt = $pdo->query("PRAGMA table_info(verification_requests)");
        echo "Columns:\n";
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo "  ✓ " . str_pad($row['name'], 25) . " - " . $row['type'] . "\n";
        }
        
        // Check record count
        $stmt = $pdo->query("SELECT COUNT(*) as cnt FROM verification_requests");
        $record = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "\nRecords in table: " . $record['cnt'] . "\n";
        
    } else {
        echo "FAILURE: verification_requests table does not exist!\n";
        
        // List all tables
        $stmt = $pdo->query("SELECT name FROM sqlite_master WHERE type='table'");
        echo "\nExisting tables:\n";
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo "  - " . $row['name'] . "\n";
        }
    }
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
?>
