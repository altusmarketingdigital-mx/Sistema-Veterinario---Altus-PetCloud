# Guía de Despliegue en la Nube - Altus PetCloud
**Plataforma Integral de Gestión Veterinaria SaaS**  
*Desarrollada bajo el estándar tecnológico de Altus MKT Digital*

---

## 1. Arquitectura Cloud-Native
- **Base de Datos:** PostgreSQL en la nube ([Neon.tech](https://neon.tech) o [Supabase](https://supabase.com)).
- **Backend API:** Node.js/Express alojado en [Render](https://render.com) o [Railway](https://railway.app).
- **Frontend SPA:** Next.js / React alojado en [Vercel](https://vercel.com).

---

## 2. Paso 1: Configurar la Base de Datos (PostgreSQL en Neon o Supabase)
1. Crea un proyecto en [Neon Console](https://console.neon.tech).
2. Obtén la cadena de conexión con SSL:
   `postgres://usuario:password@ep-sample.neon.tech/altus_petcloud?sslmode=require`
3. Abre el editor SQL de Neon y ejecuta el script:
   `database/schema.sql`
   *(Crea las tablas users, clients, patients, appointments, products, medical_records, hospitalization_kardex, invoices, invoice_items e índices).*

---

## 3. Paso 2: Despliegue del Backend en Render
1. Sube el repositorio a GitHub o GitLab.
2. En Render, crea un **New Web Service** y selecciona la carpeta `/backend`.
3. Especifica los siguientes comandos:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Agrega las siguientes variables de entorno en el panel de Render:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: `postgres://usuario:password@ep-sample.neon.tech/altus_petcloud?sslmode=require`
   - `CORS_ORIGIN`: `https://tu-frontend.vercel.app`
5. Haz clic en **Create Web Service**. Tu backend estará en: `https://altus-petcloud-api.onrender.com`.

---

## 4. Paso 3: Despliegue del Frontend en Vercel
1. Ingresa a [Vercel](https://vercel.com) y selecciona **Add New Project**.
2. Conecta tu repositorio de GitHub e indica como **Root Directory** la carpeta `/frontend`.
3. Framework Preset: **Create React App / Vite / Next.js**.
4. En **Environment Variables**, configura:
   - `REACT_APP_API_URL` o `NEXT_PUBLIC_API_URL`: `https://altus-petcloud-api.onrender.com/api`
5. Haz clic en **Deploy**. Tu plataforma estará disponible globalmente con CDN de alta velocidad.

---

## 5. Configuración de Hardware en el Navegador (100% Web)
### A. Lector de Códigos de Barras
- Funciona como un dispositivo HID de teclado estándar USB o Bluetooth.
- Configura el escáner para que añada automáticamente un salto de línea (`ENTER / CR`) al final de cada lectura.
- La aplicación captura el evento nativo en el input y agrega automáticamente el ítem al carrito sin tocar el mouse.

### B. Impresora Térmica de Tickets (80mm o 58mm)
- Conecta la impresora térmica por USB, Ethernet o Wi-Fi e instálala en Windows/Mac con su driver.
- En Chrome / Edge, la primera vez que se ejecute la impresión:
  1. En **Destino**: Selecciona la impresora de tickets.
  2. En **Diseño**: Vertical.
  3. En **Márgenes**: Ninguno (None).
  4. En **Más ajustes**: Desmarca "Encabezados y pies de página".
- Al presionar **Cobrar e Imprimir**, el CSS `@media print` aislará exclusivamente el ticket `#thermal-pos-ticket` con ancho de 78mm exacto.
