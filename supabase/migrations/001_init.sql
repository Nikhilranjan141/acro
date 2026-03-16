-- supabase/migrations/001_init.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-------------------------------------------------------------------------------
-- 1. Tables Creation
-------------------------------------------------------------------------------

-- Hospitals
CREATE TABLE IF NOT EXISTS hospitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    lat NUMERIC NOT NULL,
    lng NUMERIC NOT NULL,
    status TEXT DEFAULT 'Stable'
);

-- Resource Status
CREATE TABLE IF NOT EXISTS resource_status (
    hospital_id UUID PRIMARY KEY REFERENCES hospitals(id) ON DELETE CASCADE,
    icu JSONB NOT NULL DEFAULT '{"total": 0, "used": 0}'::jsonb,
    ventilators JSONB NOT NULL DEFAULT '{"total": 0, "used": 0}'::jsonb,
    doctors JSONB NOT NULL DEFAULT '{"total": 0, "available": 0}'::jsonb,
    ambulances JSONB NOT NULL DEFAULT '{"total": 0, "available": 0}'::jsonb,
    oxygen_pct NUMERIC NOT NULL DEFAULT 100,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ambulances
CREATE TABLE IF NOT EXISTS ambulances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    lat NUMERIC NOT NULL,
    lng NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'Available',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergencies
CREATE TABLE IF NOT EXISTS emergencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    severity TEXT NOT NULL,
    lat NUMERIC NOT NULL,
    lng NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transfers
CREATE TABLE IF NOT EXISTS transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_code TEXT NOT NULL,
    from_hospital TEXT NOT NULL,
    to_hospital TEXT NOT NULL,
    status TEXT NOT NULL,
    eta_min INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Log
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'info',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    meta_json JSONB
);

-------------------------------------------------------------------------------
-- 2. Mock Data Seeding
-------------------------------------------------------------------------------

-- Clear old data if running multiple times (safeguard for demo)
TRUNCATE TABLE resource_status CASCADE;
TRUNCATE TABLE hospitals CASCADE;
TRUNCATE TABLE ambulances CASCADE;
TRUNCATE TABLE transfers CASCADE;
TRUNCATE TABLE emergencies CASCADE;
TRUNCATE TABLE audit_log CASCADE;

-- Insert Hospitals
INSERT INTO hospitals (id, name, lat, lng, status)
VALUES 
    ('b0e8b150-1c5c-4860-a292-66858e3ea954', 'Central City General', 19.0760, 72.8777, 'Stable'),
    ('c4e0f135-26a1-4389-9bca-86b2089f92e6', 'North Wing District', 19.1023, 72.8456, 'Warning'),
    ('d91cfeba-5de7-47b3-82a1-faee6bc809e5', 'Eastside Medical Clinics', 19.0553, 72.9034, 'Critical');

-- Insert Resource Statuses
INSERT INTO resource_status (hospital_id, icu, ventilators, doctors, ambulances, oxygen_pct)
VALUES
    ('b0e8b150-1c5c-4860-a292-66858e3ea954', '{"total": 50, "used": 46}', '{"total": 20, "used": 8}', '{"total": 30, "available": 12}', '{"total": 5, "available": 2}', 85),
    ('c4e0f135-26a1-4389-9bca-86b2089f92e6', '{"total": 20, "used": 18}', '{"total": 10, "used": 9}', '{"total": 15, "available": 3}', '{"total": 3, "available": 0}', 45),
    ('d91cfeba-5de7-47b3-82a1-faee6bc809e5', '{"total": 10, "used": 10}', '{"total": 5, "used": 5}', '{"total": 10, "available": 1}', '{"total": 2, "available": 1}', 15);

-- Insert Ambulances
INSERT INTO ambulances (code, lat, lng, status)
VALUES
    ('AMB-101', 19.0660, 72.8677, 'Available'),
    ('AMB-102', 19.0960, 72.8577, 'In Transit'),
    ('AMB-103', 19.0560, 72.8977, 'Responding');

-- Insert Transfers
INSERT INTO transfers (patient_code, from_hospital, to_hospital, status, eta_min)
VALUES
    ('PT-1033', 'Eastside Medical', 'Central City', 'IN_TRANSIT', 12),
    ('PT-1034', 'Local Clinic', 'North Wing', 'ACCEPTED', 30),
    ('PT-1035', 'South Gen', 'Central City', 'COMPLETED', 0);

-- Insert Audit Logs
INSERT INTO audit_log (type, message, severity)
VALUES
    ('SYSTEM', 'Command Center initialization complete.', 'info'),
    ('RESOURCE', 'Eastside Medical reported oxygen reaching critically low levels.', 'critical'),
    ('TRANSFER', 'Transfer PT-1033 is en-route via AMB-102.', 'warning');
