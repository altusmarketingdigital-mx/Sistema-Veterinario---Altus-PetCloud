-- ============================================================================
-- MIGRACIÓN FASE 5: NOTIFICACIONES WHATSAPP, PORTAL DEL TUTOR Y BI
-- Plataforma Altus PetCloud
-- ============================================================================

-- 1. TABLA DE NOTIFICACIONES Y RECORDATORIOS (notification_logs)
CREATE TABLE IF NOT EXISTS notification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    channel VARCHAR(30) NOT NULL DEFAULT 'WHATSAPP', -- 'WHATSAPP', 'SMS', 'EMAIL'
    recipient_phone VARCHAR(30) NOT NULL,
    message_type VARCHAR(50) NOT NULL, -- 'APPOINTMENT_REMINDER', 'VACCINE_DUE', 'PRESCRIPTION_READY', 'PROMO'
    message_body TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'SENT', -- 'QUEUED', 'SENT', 'DELIVERED', 'FAILED'
    external_provider_id VARCHAR(100), -- ID de Twilio, Gupshup o Meta Cloud API
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABLA DE VACUNAS Y REFUERZOS PROGRAMADOS (patient_vaccinations)
CREATE TABLE IF NOT EXISTS patient_vaccinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    vaccine_name VARCHAR(150) NOT NULL, -- ej. "Séxtuple Canina", "Rabia", "Triple Felina"
    lot_number VARCHAR(80),
    applied_date DATE NOT NULL DEFAULT CURRENT_DATE,
    next_due_date DATE NOT NULL, -- Fecha de refuerzo para recordatorio automático
    veterinarian_id UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'APPLIED', -- 'APPLIED', 'PENDING_BOOSTER'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TOKEN DE ACCESO DIRECTO PARA EL PORTAL DEL TUTOR (SIN PASSWORD)
ALTER TABLE clients ADD COLUMN IF NOT EXISTS portal_access_token VARCHAR(100) UNIQUE DEFAULT md5(random()::text);

-- Índices de optimización para analíticas y notificaciones
CREATE INDEX IF NOT EXISTS idx_notifications_client ON notification_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_vaccinations_due ON patient_vaccinations(next_due_date);
CREATE INDEX IF NOT EXISTS idx_clients_portal ON clients(portal_access_token);
