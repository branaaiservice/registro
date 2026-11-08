# Registro de pedidos - Brana

Formulario web (un solo archivo `index.html`) para registrar pedidos de Shalom, Olva, retiro en tienda y entrega a domicilio.

- La aplicación conserva una copia local en el navegador.
- `api/registro.js` añade o actualiza cada pedido en Google Sheets, usando el ID del pedido como clave.
- `google-sheets-sync.js` sincroniza los pedidos locales y sus cambios cuando hay conexión.
- Pedidos, agencias y papelera siguen requiriendo inicio de sesión en la interfaz (esa protección es solo visual, no una barrera de seguridad).

## Activar Google Sheets en Vercel

1. Crea una hoja de cálculo y una pestaña llamada `Pedidos` (o configura `GOOGLE_SHEET_TAB`). Comparte la hoja con el correo de la cuenta de servicio de Google como **Editor**.
2. En Google Cloud crea una cuenta de servicio y habilita Google Sheets API. Descarga su clave privada; no la guardes en el repositorio.
3. En Vercel, configura estas variables de entorno para los entornos que uses (Production, Preview y/o Development):
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`: correo de la cuenta de servicio.
   - `GOOGLE_PRIVATE_KEY`: clave privada completa; si Vercel la almacena con `\\n`, la función los convierte a saltos de línea.
   - `GOOGLE_SHEET_ID`: ID de la hoja, tomado de su URL.
   - `GOOGLE_SHEET_TAB`: opcional; por defecto `Pedidos`.
4. **Conecta el script del navegador** agregando esta línea a `index.html`, antes de `</body>`:

   ```html
   <script src="/google-sheets-sync.js" defer></script>
   ```

5. Despliega de nuevo en Vercel. El primer envío inicializa la fila de cabeceras automáticamente. Los pedidos existentes guardados en el navegador se sincronizan al abrir la aplicación; pedidos nuevos y cambios posteriores también se actualizan en la misma fila.

El endpoint solo acepta POST del mismo origen cuando el navegador envía el encabezado `Origin`. Las credenciales de Google solo viven en variables de entorno de Vercel. El voucher no se envía a Sheets; solo se indica si hay uno adjunto. La información de la hoja (incluidos DNI/CE, teléfonos y direcciones) debe limitarse a personal autorizado y manejarse de acuerdo con las reglas de privacidad aplicables. La recepción pública sigue siendo susceptible a solicitudes automatizadas; revisa el uso de la función y aplica una capa de rate limiting si se publica ampliamente.

Los cambios de pedidos en dispositivos/navegadores diferentes se centralizan al guardar o modificar pedidos en cada dispositivo; los datos históricos que solo existan en otros navegadores no se pueden recuperar desde Vercel automáticamente.
