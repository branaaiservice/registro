# Prompt para replicar el formulario "Registro de pedidos - Brana"

Pega este prompt en un chat nuevo de la otra cuenta y adjunta el archivo `pedidos-courier.html` (es el código completo, con las agencias de Shalom y Olva incluidas y todos los cambios de abajo ya aplicados).

---

Publica como artefacto la página adjunta `pedidos-courier.html` tal cual, sin rediseñarla ni reescribirla. Es un solo archivo HTML (sin librerías externas salvo SheetJS desde cdnjs, CSS y JS en el mismo archivo, modo claro/oscuro, adaptada a celular), todo en español. El título del artefacto y el encabezado de la página son **"Registro de pedidos - Brana"**. Los datos se guardan en localStorage (con try/catch) y no se comparten entre dispositivos.

Antes de publicar, léela completa. Solo permite ajustes técnicos mínimos si el visor lo exige: márgenes laterales con `env(safe-area-inset-*)`, `color-scheme: dark` en los bloques oscuros y no depender de `window.print()` ni de `window.open` sin alternativa. Declara la capacidad `downloads` (`capabilities: {"downloads": true}`) porque el botón de Excel usa `downloads.save`. Icono: "form". Descripción: "Registro de pedidos de Brana para Shalom, Olva, retiro en tienda y entrega a domicilio, con rótulos, filtros, productos, voucher y Excel." Dame el enlace al terminar.

## Qué debe hacer la página

**Diseño:** estilo limpio y moderno, como formularios de configuración tipo "cuenta y perfil". Fondo gris azulado muy claro, tarjetas blancas de esquinas muy redondeadas (20 px) con sombra suave y sin borde, cada tarjeta con un encabezado compuesto por un ícono en un cuadrado verde claro y el título en negrita. Campos rellenos en gris claro, sin borde, con esquinas de 12 px y etiquetas pequeñas en negrita encima. Color de acento verde esmeralda (#0b7a55 en claro, #34b98a en oscuro). Las pestañas son píldoras redondeadas; la activa lleva borde y texto verde sobre fondo verde claro. Las opciones de "¿Cómo recibe el pedido?" son tarjetas con título y subtítulo alineados a la izquierda; la elegida tiene borde verde, fondo verde claro y una marca ✓ arriba a la derecha. Los botones principales son píldoras verdes y los secundarios píldoras con borde. Tipografía Inter (Google Fonts) con respaldo del sistema. Las etiquetas de color por tipo de pedido en la lista de Pedidos (Shalom rojo, Olva naranja, tienda verde, domicilio violeta) se mantienen. Modo claro y oscuro con los mismos componentes.

**Pestañas:** Nuevo pedido · Pedidos · Agencias · Papelera.

**Acceso:** solo "Nuevo pedido" es de uso libre (público). Pedidos, Agencias y Papelera piden usuario y contraseña (el código guarda solo el hash SHA-256 de `usuario:contraseña`, con el usuario en minúsculas; la sesión se recuerda con sessionStorage; hay un botón "Cerrar sesión" y los contadores de las pestañas privadas se ocultan hasta iniciar sesión). Credencial única:
- Usuario: `Branitos`, contraseña: `bra1NA2sac3`

Esto no es seguridad real: todo corre en el navegador y quien lea el código puede saltarse la pantalla. Sirve para evitar accesos por error.

**Nuevo pedido** (todos los campos son obligatorios, salvo "¿Quién lo atendió?"):
- Cliente: WhatsApp (exactamente 9 dígitos, solo números), nombre y apellidos, DNI/CE (8 a 12 caracteres alfanuméricos). Si el WhatsApp ya existe en pedidos anteriores, rellena nombre y DNI automáticamente.
- ¿Cómo recibe el pedido? Cuatro botones: Shalom (agencia), Olva (agencia), Retiro en tienda y A domicilio.
  - Shalom / Olva: departamento → provincia → distrito (si hay) y una agencia de la lista, con buscador por nombre o dirección.
  - Retiro en tienda: elegir tienda de la lista y el día de retiro. No pide hora; muestra el aviso "Tu pedido estará listo a partir de las 2:00 pm".
  - A domicilio: solo Lima. Distrito (los 43 de Lima Metropolitana), dirección exacta y referencia.
- "¿Quién lo atendió?" (opcional): Asesora - 955128016, Asesora - 922865709, u Otra. Si es Otra, aparece un campo opcional "Nombre o WhatsApp de su asesora".
- Al guardar: registra el pedido, abre WhatsApp (wa.me/51 + número) con el resumen dirigido a quien lo atendió y muestra una tarjeta de confirmación con "Enviar al cliente", "Enviar a quien atendió" (si hay número) y "Registrar otro". El resumen incluye tipo de pedido, cliente, DNI, celular, destino, retiro (si aplica) y "Atendió".

**Pedidos:**
- Lista con etiqueta de color por tipo, datos del pedido, estado y botones Copiar resumen, WhatsApp y Eliminar (el pedido eliminado va a la Papelera y se puede restaurar).
- **Estados según cómo recibe el pedido:** Shalom y Olva: Pendiente, En agencia, Finalizado. Retiro en tienda: Pendiente, En tienda, Finalizado. A domicilio: Pendiente, Finalizado. El filtro de estado ofrece Pendiente, En agencia, En tienda y Finalizado. Los pedidos antiguos se migran (Enviado pasa a En agencia o En tienda, Entregado pasa a Finalizado).
- **Productos y voucher:** cada pedido tiene un bloque desplegable "Productos y voucher" con (1) un cuadro de texto para la lista de productos del cliente (se guarda al salir del cuadro) y (2) la subida del voucher de pago como imagen (se reduce a 900 px y se guarda en el navegador; con "Ver grande" y "Quitar"). La lista de productos se incluye en el resumen de WhatsApp y en la columna "Productos" del Excel.
- Número de pedido correlativo por orden de registro, con 6 dígitos (ej. 000012).
- Filtros por estado, por cómo recibe y un buscador por número de pedido (sirve también para escanear el código de barras).
- Casilla **"Seleccionar"** en cada pedido y "Seleccionar todos". Esa selección se usa para los rótulos y para el Excel Shalom.
- **Origen y tamaño por pedido:** cada pedido de Shalom muestra dos listas propias: "Agencia Shalom de origen" (AV. DOS DE OCTUBRE o JESUS MARIA) y "Tamaño del paquete" (PAQUETE XXS, XS, S o M). Empiezan sin elegir y se guardan en cada pedido. No hay un selector general.
- **Generar rótulos (n):** vista previa con un rótulo de 4 x 2 pulgadas por pedido seleccionado (`@page { size: 4in 2in; margin: 0 }`, un rótulo por hoja) y botón Imprimir (si el visor bloquea la impresión, avisar que use Ctrl+P). Diseño: borde negro; encabezado con el logo "brana" a la izquierda y "BRANA PERU / 955128016 / 922865709" a la derecha; filas CLIENTE, DESTINO (solo Shalom, Olva, Retiro en tienda o A domicilio), DNI y CEL; abajo a la izquierda un código de barras Code 39 con el número de pedido y "N.º 000012" debajo; a la derecha el ícono de frágil con "FRÁGIL" en letra grande.
- **Descargar Excel:** .xlsx (SheetJS desde cdnjs) con todos los datos del pedido (sin fecha de envío), respetando los filtros activos, entregado con la capacidad `downloads`.
- **Excel Shalom (n) (envío masivo):** .xlsx solo con los pedidos de Shalom que estén marcados en "Seleccionar" (los de otros tipos se ignoran; si no hay ninguno marcado, avisa). Si a algún pedido le falta el origen o el tamaño, no descarga y avisa los números de pedido. Columnas, en este orden: DESTINATARIO (DOC) = DNI/CE · TELF. DESTINATARIO = WhatsApp · CONTACTO (DOC) = el mismo DNI/CE · TELF. CONTACTO = el mismo WhatsApp · NRO GRR = vacío · ORIGEN = origen elegido en el pedido · DESTINO = nombre de la agencia de destino en mayúsculas, sin el prefijo "SHALOM" · MERCADERIA = tamaño elegido en el pedido · ALTO, ANCHO, LARGO y PESO según el tamaño (XXS 0.15 × 0.1 × 0.1 m, 0.25 kg; XS 0.2 × 0.15 × 0.12, 0.5 kg; S 0.3 × 0.3 × 0.12, 2 kg; M 0.3 × 0.24 × 0.2, 5 kg) · CANTIDAD = 1.

**Agencias:** solo hora de corte de envíos y la importación masiva (se elige Shalom u Olva y se pega una agencia por línea: `Departamento | Provincia | Distrito | Nombre | Dirección`). No hay formulario para agregar una agencia ni lista de agencias guardadas con botón Quitar.

**Datos:** agencias de Shalom y Olva (Olva de https://olva-api.lat/agencias, agrupadas por departamento, con nombre y dirección) y tiendas de retiro configurables, todo ya incluido en el archivo adjunto.

## Después de publicar, avisa estas limitaciones

- El artefacto queda privado. Para que otras personas lo abran, hay que usar el menú Compartir. Yo no puedo cambiar el acceso.
- Los vouchers ocupan espacio del navegador (unos 100 KB cada uno), así que si se llena el almacenamiento la app avisa y hay que quitar vouchers antiguos.
- Cada persona ve solo los pedidos de su propio navegador. Un pedido registrado por un compañero no aparece en la pestaña Pedidos de quien administra. Para compartirlos hace falta una base de datos compartida con cuentas.
- La contraseña no protege datos sensibles.
