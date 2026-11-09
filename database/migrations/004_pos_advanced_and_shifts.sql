-- ============================================================================
-- MIGRACIÓN FASE 4: POS AVANZADO, ARQUEO DE CAJA Y CONTROL DE LOTES
-- Plataforma Altus PetCloud
-- ============================================================================

-- 1. TABLA DE TURNOS Y APERTURA/CIERRE DE CAJA (cash_registers)
CREATE TABLE IF NOT EXISTS cash_shifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id), -- Cajero responsable
    opened_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP WITH TIME ZONE,
    opening_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00, -- Fondo inicial en efectivo
    cash_sales NUMERIC(12, 2) DEFAULT 0.00,
    card_sales NUMERIC(12, 2) DEFAULT 0.00,
    transfer_sales NUMERIC(12, 2) DEFAULT 0.00,
    total_sales NUMERIC(12, 2) DEFAULT 0.00,
    expected_cash NUMERIC(12, 2) DEFAULT 0.00,
    actual_cash NUMERIC(12, 2), -- Efectivo contado físicamente en el arqueo
    difference NUMERIC(12, 2) DEFAULT 0.00, -- Sobrante (+) o Faltante (-)
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN', -- 'OPEN', 'CLOSED'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABLA DE MOVIMIENTOS DE CAJA CHICA (cash_movements)
CREATE TABLE IF NOT EXISTS cash_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shift_id UUID NOT NULL REFERENCES cash_shifts(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL, -- 'INFLOW' (Entrada), 'OUTFLOW' (Salida / Gasto menor)
    amount NUMERIC(12, 2) NOT NULL,
    reason VARCHAR(255) NOT NULL, -- ej. "Pago de garrafones de agua", "Cambio de monedas"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABLA DE LOTES Y FECHAS DE CADUCIDAD DE MEDICAMENTOS (product_batches)
CREATE TABLE IF NOT EXISTS product_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    batch_number VARCHAR(80) NOT NULL, -- Número de lote
    expiration_date DATE NOT NULL,
    quantity_received INT NOT NULL DEFAULT 0,
    quantity_available INT NOT NULL DEFAULT 0,
    cost_price NUMERIC(12, 2) DEFAULT 0.00,
    is_expired BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. VINCULAR TICKET CON TURNO DE CAJA
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS shift_id UUID REFERENCES cash_shifts(id) ON DELETE SET NULL;

-- Índices de consulta rápida
CREATE INDEX IF NOT EXISTS idx_shifts_status ON cash_shifts(status);
CREATE INDEX IF NOT EXISTS idx_shifts_branch ON cash_shifts(branch_id);
CREATE INDEX IF NOT EXISTS idx_batches_product ON product_batches(product_id);
CREATE INDEX IF NOT EXISTS idx_batches_expiration ON product_batches(expiration_date);
