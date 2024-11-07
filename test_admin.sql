-- Create test administrator account
INSERT INTO users (
    medical_code,
    name,
    role,
    department,
    status
) VALUES (
    'TEST1234567',
    'Test Administrator',
    'administrator',
    'Administration',
    'active'
);