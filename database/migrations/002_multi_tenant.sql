-- ============================================================================
-- MIGRACIÓN: MULTI-TENANCY Y SUCURSALES (Fase 2 - Sprint 2)
-- Plataforma Altus PetCloud
-- ============================================================================

-- 1. TABLA DE CLÍNICAS / ORGANIZACIONES (tenants)
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL, -- ej. "Clínica Veterinaria San Jerónimo"
    subdomain VARCHAR(60) UNIQUE NOT NULL, -- ej. "sanjeronimo" -> sanjeronimo.altuspetcloud.com
    tax_name VARCHAR(150),
    tax_id VARCHAR(50), -- RFC / RUT / CIF
    contact_email VARCHAR(180) NOT NULL,
    contact_phone VARCHAR(30),
    logo_url TEXT,
    currency VARCHAR(10) DEFAULT 'MXN',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABLA DE SUCURSALES FÍSICAS (branches)
CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- ej. "Sucursal Del Valle", "Sucursal Coyoacán"
    code VARCHAR(20) NOT NULL, -- ej. "SUC-01"
    address TEXT NOT NULL,
    phone VARCHAR(30),
    ticket_footer_text TEXT DEFAULT '¡Gracias por confiar en Altus PetCloud!',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (tenant_id, code)
);

-- 3. VINCULAR TENANT_ID Y BRANCH_ID EN TABLAS OPERATIVAS
-- Usuarios
ALTER TABLE users ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES branches(id) ON DELETE SET NULL;

-- Clientes
ALTER TABLE clients ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;

-- Pacientes
ALTER TABLE patients ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;

-- Citas
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES branches(id) ON DELETE CASCADE;

-- Productos e Inventario (Stock por sucursal)
ALTER TABLE products ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES branches(id) ON DELETE SET NULL;

-- Facturas / Ventas POS
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES branches(id) ON DELETE SET NULL;

-- Historial Clínico
ALTER TABLE medical_records ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;

-- 4. ÍNDICES DE PARTICIONADO LÓGICO MULTI-TENANT
CREATE INDEX IF NOT EXISTS idx_users_tenant ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_clients_tenant ON clients(tenant_id);
CREATE INDEX IF NOT EXISTS idx_patients_tenant ON patients(tenant_id);
CREATE INDEX IF NOT EXISTS idx_appointments_tenant ON appointments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_products_tenant ON products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_invoices_tenant ON invoices(tenant_id);
CREATE INDEX IF NOT EXISTS idx_branches_tenant ON branches(tenant_id);
