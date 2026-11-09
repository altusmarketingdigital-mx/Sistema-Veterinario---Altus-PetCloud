-- ============================================================================
-- MIGRACIÓN FASE 3: EXPEDIENTES CLÍNICOS AVANZADOS, RECETAS Y ESTUDIOS
-- Plataforma Altus PetCloud
-- ============================================================================

-- 1. TABLA DE RECETAS MÉDICAS DIGITALES (prescriptions)
CREATE TABLE IF NOT EXISTS prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    veterinarian_id UUID NOT NULL REFERENCES users(id),
    medical_record_id UUID REFERENCES medical_records(id) ON DELETE SET NULL,
    prescription_code VARCHAR(50) UNIQUE NOT NULL, -- ej. "REC-2026-0045"
    diagnosis_summary TEXT NOT NULL,
    instructions TEXT NOT NULL, -- Indicaciones generales de cuidado
    digital_signature_hash VARCHAR(255),
    expires_at DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABLA DE MEDICAMENTOS RECETADOS (prescription_items)
CREATE TABLE IF NOT EXISTS prescription_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prescription_id UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    medication_name VARCHAR(150) NOT NULL,
    dosage VARCHAR(100) NOT NULL,       -- ej. "1 comprimido"
    frequency VARCHAR(100) NOT NULL,    -- ej. "Cada 12 horas con alimento"
    duration_days INT NOT NULL,         -- ej. 7 días
    notes TEXT
);

-- 3. TABLA DE ESTUDIOS Y ARCHIVOS DIAGNÓSTICOS (clinical_attachments)
CREATE TABLE IF NOT EXISTS clinical_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    medical_record_id UUID REFERENCES medical_records(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50) NOT NULL,     -- 'IMAGE', 'PDF', 'LAB_RESULT', 'X_RAY'
    description TEXT,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. AMPLIACIÓN DEL KARDEX CON ESTADOS Y SEMÁFORO DE CRITICIDAD
ALTER TABLE hospitalization_kardex ADD COLUMN IF NOT EXISTS criticality_level VARCHAR(20) DEFAULT 'STABLE'; -- 'STABLE' (Verde), 'OBSERVATION' (Amarillo), 'CRITICAL' (Rojo)
ALTER TABLE hospitalization_kardex ADD COLUMN IF NOT EXISTS patient_cage_number VARCHAR(30); -- Número de jaula / box
ALTER TABLE hospitalization_kardex ADD COLUMN IF NOT EXISTS notes TEXT;

-- Índices de consulta rápida
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_attachments_patient ON clinical_attachments(patient_id);
CREATE INDEX IF NOT EXISTS idx_kardex_status ON hospitalization_kardex(status);
