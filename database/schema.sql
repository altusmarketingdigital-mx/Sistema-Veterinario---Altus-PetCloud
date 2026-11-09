-- ============================================================================
-- PLATAFORMA INTEGRAL DE GESTIÓN VETERINARIA: ALTUS PETCLOUD
-- Esquema de Base de Datos Relacional (PostgreSQL / Neon / Supabase)
-- Branding & Technology Standard: Altus MKT Digital
-- ============================================================================

-- Extensión para generación de UUIDs si se requiere
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS DEL SISTEMA
CREATE TYPE user_role AS ENUM ('ADMIN', 'VETERINARIAN', 'RECEPTIONIST');
CREATE TYPE appointment_status AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE invoice_payment_method AS ENUM ('CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'TRANSFER', 'OTHER');
CREATE TYPE patient_species AS ENUM ('CANINE', 'FELINE', 'AVIAN', 'EXOTIC', 'OTHER');
CREATE TYPE patient_gender AS ENUM ('MALE', 'FEMALE', 'UNKNOWN');

-- 2. TABLA DE USUARIOS / PERSONAL CLÍNICO (users)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(180) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role user_role NOT NULL DEFAULT 'RECEPTIONIST',
    professional_license VARCHAR(60), -- Cédula profesional veterinaria
    phone VARCHAR(30),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABLA DE CLIENTES / TUTORES DE MASCOTAS (clients)
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    tax_id VARCHAR(50), -- RFC / RUT / DNI
    email VARCHAR(180),
    phone VARCHAR(30) NOT NULL,
    emergency_phone VARCHAR(30),
    address TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABLA DE PACIENTES / MASCOTAS (patients)
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    species patient_species NOT NULL DEFAULT 'CANINE',
    breed VARCHAR(100),
    gender patient_gender NOT NULL DEFAULT 'UNKNOWN',
    is_sterilized BOOLEAN DEFAULT FALSE,
    birth_date DATE,
    weight_kg NUMERIC(6, 2),
    microchip_number VARCHAR(80),
    allergies TEXT,
    photo_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABLA DE CITAS VETERINARIAS (appointments)
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    veterinarian_id UUID REFERENCES users(id) ON DELETE SET NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    estimated_duration_min INT DEFAULT 30,
    status appointment_status NOT NULL DEFAULT 'SCHEDULED',
    reason VARCHAR(255) NOT NULL,
    clinical_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. TABLA DE PRODUCTOS / SERVICIOS / MEDICAMENTOS (products)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barcode VARCHAR(100) UNIQUE, -- Para escáner de códigos de barras (EAN-13, UPC, Code128)
    sku VARCHAR(60) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(80) NOT NULL, -- 'MEDICATION', 'FOOD', 'ACCESORIOS', 'SPA_SERVICE', 'CONSULTATION'
    description TEXT,
    cost_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    sale_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    stock_current INT NOT NULL DEFAULT 0,
    stock_minimum INT NOT NULL DEFAULT 5,
    is_service BOOLEAN NOT NULL DEFAULT FALSE, -- Si es servicio no descuenta stock físico
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. TABLA DE HISTORIAL CLÍNICO Y KARDEX MÉDICO (medical_records)
CREATE TABLE medical_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    veterinarian_id UUID NOT NULL REFERENCES users(id),
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    anamnesis TEXT NOT NULL,
    physical_exam TEXT,
    diagnosis TEXT NOT NULL,
    treatment_plan TEXT NOT NULL,
    heart_rate_bpm INT,
    temperature_celsius NUMERIC(4, 1),
    respiratory_rate_rpm INT,
    weight_kg NUMERIC(6, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. KARDEX DE DOSIFICACIÓN Y APLICACIÓN DE FÁRMACOS (hospitalization_kardex)
CREATE TABLE hospitalization_kardex (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    medical_record_id UUID NOT NULL REFERENCES medical_records(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id), -- Medicamento vinculado al inventario
    medication_name VARCHAR(150) NOT NULL,
    dose VARCHAR(100) NOT NULL,       -- ej. "2.5 ml cada 8 hrs"
    route VARCHAR(50) NOT NULL,      -- "IV", "SC", "Oral", etc.
    frequency_hours INT NOT NULL,
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    administered_at TIMESTAMP WITH TIME ZONE,
    administered_by UUID REFERENCES users(id),
    status VARCHAR(30) DEFAULT 'PENDING' -- 'PENDING', 'ADMINISTERED', 'OMITTED'
);

-- 9. TABLA DE FACTURAS / TICKETS DE VENTA (invoices)
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL, -- ej. "TICK-2026-0001"
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES users(id), -- Cajero / Personal que cobró
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    payment_method invoice_payment_method NOT NULL DEFAULT 'CASH',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. TABLA DE DETALLE DE TICKET / ITEMS DE FACTURA (invoice_items)
CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    product_name VARCHAR(200) NOT NULL, -- Snapshot en caso de cambio futuro
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL,
    total_line NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ÍNDICES ESTRATÉGICOS PARA MÁXIMO RENDIMIENTO
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX idx_appointments_vet ON appointments(veterinarian_id);
CREATE INDEX idx_patients_client ON patients(client_id);
CREATE INDEX idx_invoices_created_at ON invoices(created_at);
CREATE INDEX idx_invoice_items_invoice ON invoice_items(invoice_id);
