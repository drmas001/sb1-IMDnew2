-- Drop existing consultations table if it exists
DROP TABLE IF EXISTS consultations;

-- Create consultations table with updated schema
CREATE TABLE consultations (
    id SERIAL PRIMARY KEY,
    patient_id VARCHAR(255) NOT NULL,
    mrn VARCHAR(255) NOT NULL,
    patient_name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
    requesting_department VARCHAR(255) NOT NULL,
    patient_location VARCHAR(255) NOT NULL,
    consultation_specialty VARCHAR(255) NOT NULL,
    shift_type VARCHAR(10) CHECK (shift_type IN ('morning', 'evening', 'night')),
    urgency VARCHAR(10) CHECK (urgency IN ('routine', 'urgent', 'emergency')),
    reason TEXT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('active', 'completed', 'cancelled')),
    doctor_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_patient_consultation UNIQUE (patient_id, created_at)
);

-- Create index for faster lookups
CREATE INDEX idx_consultations_patient_id ON consultations(patient_id);
CREATE INDEX idx_consultations_mrn ON consultations(mrn);
CREATE INDEX idx_consultations_status ON consultations(status);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_consultations_updated_at
    BEFORE UPDATE ON consultations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();