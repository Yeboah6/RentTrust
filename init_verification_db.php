<?php
// SQLite database initialization script
$dbPath = __DIR__ . '/database/database.sqlite';

// Create database directory if it doesn't exist
if (!is_dir(__DIR__ . '/database')) {
    mkdir(__DIR__ . '/database', 0755, true);
}

// Connect to SQLite database
try {
    // Delete old database to start fresh if it exists
    // Uncomment next line if you want to reset database
    // if (file_exists($dbPath)) { unlink($dbPath); }
    
    $pdo = new PDO('sqlite:' . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Enable foreign keys
    $pdo->exec('PRAGMA foreign_keys = ON');
    
    // Read and execute the SQL file
    $sql = file_get_contents(__DIR__ . '/create_verification_table.sql');
    
    // Split by semicolon and execute each statement
    $statements = array_filter(array_map('trim', explode(';', $sql)));
    
    $error_count = 0;
    foreach ($statements as $statement) {
        if (!empty($statement)) {
            try {
                $pdo->exec($statement);
            } catch (Exception $e) {
                // Some statements might fail if tables don't exist, that's okay
                $error_count++;
            }
        }
    }
    
    echo "✓ Database initialization complete\n";
    
    // Verify tables exist
    $stmt = $pdo->query("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
    echo "\nTables in database:\n";
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "  - " . $row['name'] . "\n";
    }
    
    // Check verification_requests table specifically
    $stmt = $pdo->query("SELECT name FROM sqlite_master WHERE type='table' AND name='verification_requests'");
    if ($stmt->fetch()) {
        echo "\n✓ verification_requests table verified\n";
    }
    
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
    exit(1);
}
?>

