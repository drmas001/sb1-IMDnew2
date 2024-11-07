-- Insert admin user with medical code M1019
INSERT INTO users (
    medical_code,
    name,
    role,
    department,
    status
) VALUES (
    'M1019',
    'System Administrator',
    'administrator',
    'Administration',
    'active'
);