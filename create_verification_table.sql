-- Create verification_requests table for SQLite
CREATE TABLE IF NOT EXISTS verification_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    verification_request_id TEXT UNIQUE NOT NULL,
    rental_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    agent_id INTEGER NOT NULL,
    agent_name TEXT NOT NULL,
    request_type TEXT DEFAULT 'initial_verification' CHECK(request_type IN ('initial_verification', 're_verification')),
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
    proof_documents TEXT,
    ownership_documents TEXT,
    license_documents TEXT,
    utility_bills TEXT,
    additional_notes TEXT,
    admin_notes TEXT,
    rejection_reason TEXT,
    submitted_at DATETIME,
    reviewed_at DATETIME,
    reviewed_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rental_id) REFERENCES rentals(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_verification_rental_id ON verification_requests(rental_id);
CREATE INDEX IF NOT EXISTS idx_verification_user_id ON verification_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_status ON verification_requests(status);
CREATE INDEX IF NOT EXISTS idx_verification_created_at ON verification_requests(created_at);

-- Add verification columns to rentals table
ALTER TABLE rentals ADD COLUMN IF NOT EXISTS verification_status TEXT;
ALTER TABLE rentals ADD COLUMN IF NOT EXISTS verification_requested_at DATETIME;
ALTER TABLE rentals ADD COLUMN IF NOT EXISTS verified_at DATETIME;
ALTER TABLE rentals ADD COLUMN IF NOT EXISTS is_verified INTEGER DEFAULT 0;
ALTER TABLE rentals ADD COLUMN IF NOT EXISTS verification_rejection_reason TEXT;
ALTER TABLE rentals ADD COLUMN IF NOT EXISTS verification_rejected_at DATETIME;
