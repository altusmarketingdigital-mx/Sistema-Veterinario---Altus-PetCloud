const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, requireRoles } = require('../middlewares/auth.middleware');

// Rutas de POS requieren autenticación
router.use(authenticateToken);

// POST /api/pos/checkout - Procesar venta, generar ticket y descontar inventario atómicamente
router.post('/checkout', requireRoles('ADMIN', 'RECEPTIONIST'), async (req, res, next) => {
  const client = await db.getClient();
  try {
    const { client_id, items, payment_method = 'CASH', discount_amount = 0, notes } = req.body;
    const user_id = req.user.id; // Asignado automáticamente desde el token autenticado

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'El carrito no contiene items' });
    }

    await client.query('BEGIN');

    // 1. Calcular totales y verificar stock
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const prodRes = await client.query('SELECT * FROM products WHERE id = $1 FOR UPDATE', [item.product_id]);
      if (prodRes.rows.length === 0) {
        throw new Error(`Producto ${item.product_id} no existe.`);
      }

      const product = prodRes.rows[0];

      // Si es producto físico, verificar inventario
      if (!product.is_service && product.stock_current < item.quantity) {
        throw new Error(`Stock insuficiente para "${product.name}". Disponible: ${product.stock_current}, Solicitado: ${item.quantity}`);
      }

      const lineTotal = Number(product.sale_price) * Number(item.quantity);
      subtotal += lineTotal;

      validatedItems.push({
        product_id: product.id,
        product_name: product.name,
        quantity: item.quantity,
        unit_price: product.sale_price,
        total_line: lineTotal,
        is_service: product.is_service
      });
    }

    const tax_amount = subtotal * 0.16; // 16% IVA estándar configurable
    const total = subtotal + tax_amount - Number(discount_amount);
    const invoiceNumber = `ALTUS-${Date.now().toString().slice(-8)}`;

    // 2. Insertar cabecera de la factura/ticket
    const invoiceInsertQuery = `
      INSERT INTO invoices (invoice_number, client_id, user_id, subtotal, tax_amount, discount_amount, total, payment_method, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const invoiceRes = await client.query(invoiceInsertQuery, [
      invoiceNumber,
      client_id || null,
      user_id || '00000000-0000-0000-0000-000000000000', // Mock o ID de usuario autenticado
      subtotal,
      tax_amount,
      discount_amount,
      total,
      payment_method,
      notes || null
    ]);

    const createdInvoice = invoiceRes.rows[0];

    // 3. Insertar items y descontar stock
    for (const vItem of validatedItems) {
      await client.query(`
        INSERT INTO invoice_items (invoice_id, product_id, product_name, quantity, unit_price, total_line)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [createdInvoice.id, vItem.product_id, vItem.product_name, vItem.quantity, vItem.unit_price, vItem.total_line]);

      if (!vItem.is_service) {
        await client.query(`
          UPDATE products 
          SET stock_current = stock_current - $1, updated_at = CURRENT_TIMESTAMP
          WHERE id = $2
        `, [vItem.quantity, vItem.product_id]);
      }
    }

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Venta registrada con éxito',
      data: {
        invoice: createdInvoice,
        items: validatedItems
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

// GET /api/pos/invoices/:id - Obtener detalle para re-impresión de ticket
router.get('/invoices/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const invRes = await db.query(`
      SELECT i.*, c.first_name, c.last_name, c.tax_id, c.phone, u.full_name AS cashier_name
      FROM invoices i
      LEFT JOIN clients c ON i.client_id = c.id
      LEFT JOIN users u ON i.user_id = u.id
      WHERE i.id = $1
    `, [id]);

    if (invRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Ticket no encontrado' });
    }

    const itemsRes = await db.query(`SELECT * FROM invoice_items WHERE invoice_id = $1`, [id]);

    res.json({
      success: true,
      data: {
        invoice: invRes.rows[0],
        items: itemsRes.rows
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
