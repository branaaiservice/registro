// Vercel serverless endpoint: POST /api/registro
// Required environment variables:
//   GOOGLE_SERVICE_ACCOUNT_EMAIL
//   GOOGLE_PRIVATE_KEY (store with literal \\n or real newlines)
//   GOOGLE_SHEET_ID
// Optional: GOOGLE_SHEET_TAB (defaults to "Pedidos")
const { google } = require("googleapis");

const HEADERS = [
  "id", "numero_pedido", "fecha_registro", "estado", "cliente", "dni_ce",
  "whatsapp", "modalidad", "destino", "retiro", "atendido_por",
  "whatsapp_asesora", "productos", "shalom_origen", "tamano_paquete",
  "voucher_adjuntado", "pedido_json"
];

function reply(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  return res.end(JSON.stringify(body));
}

function asText(value, max = 5000) {
  return typeof value === "string" ? value.slice(0, max) : "";
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return reply(res, 405, { error: "Método no permitido" });
  }

  // This endpoint is intended to be called by the same-origin form, not from other websites.
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return reply(res, 403, { error: "Origen no permitido" });
    } catch (_) {
      return reply(res, 403, { error: "Origen no permitido" });
    }
  }

  const input = req.body && typeof req.body === "object" ? req.body : {};
  const p = input.order;
  if (!p || typeof p !== "object" || !/^[a-z0-9_-]{1,80}$/i.test(String(p.id || ""))) {
    return reply(res, 400, { error: "Pedido inválido" });
  }
  if (!asText(p.nom, 200) || !asText(p.cel, 30) || !asText(p.modo, 40)) {
    return reply(res, 400, { error: "Faltan datos obligatorios del pedido" });
  }

  const required = ["GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_PRIVATE_KEY", "GOOGLE_SHEET_ID"];
  const missing = required.filter((name) => !process.env[name]);
  if (missing.length) {
    console.error("Missing Google Sheets configuration:", missing.join(", "));
    return reply(res, 503, { error: "La conexión con Google Sheets no está configurada" });
  }

  try {
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });
    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const tab = (process.env.GOOGLE_SHEET_TAB || "Pedidos").replace(/[']/g, "''");
    const range = `'${tab}'`;

    const clean = {
      id: asText(p.id, 80), n: Number.isFinite(Number(p.n)) ? Number(p.n) : "",
      f: asText(p.f, 80), estado: asText(p.estado, 80), nom: asText(p.nom, 200),
      dni: asText(p.dni, 40), cel: asText(p.cel, 30), modo: asText(p.modo, 40),
      dest: asText(p.dest, 2000), retiro: asText(p.retiro, 300), at: asText(p.at, 200),
      atTel: asText(p.atTel, 40), prod: asText(p.prod, 5000), shO: asText(p.shO, 200),
      shM: asText(p.shM, 100), voucherAttached: Boolean(p.vou)
    };
    const values = [[
      clean.id, clean.n, clean.f, clean.estado, clean.nom, clean.dni, clean.cel,
      clean.modo, clean.dest, clean.retiro, clean.at, clean.atTel, clean.prod,
      clean.shO, clean.shM ? clean.shM : "", clean.voucherAttached ? "Sí" : "No",
      JSON.stringify(clean)
    ]];

    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId, range: `${range}!A:A`
    });
    const rows = existing.data.values || [];
    let rowIndex = rows.findIndex((row, index) => index > 0 && row[0] === clean.id);

    if (!rows.length) {
      await sheets.spreadsheets.values.update({
        spreadsheetId, range: `${range}!A1:Q1`, valueInputOption: "RAW",
        requestBody: { values: [HEADERS] }
      });
      rowIndex = -1;
    } else if (rows[0][0] !== "id") {
      return reply(res, 409, { error: "La primera fila de la hoja debe estar vacía o contener la cabecera id" });
    }

    if (rowIndex >= 0) {
      const sheetRow = rowIndex + 1;
      await sheets.spreadsheets.values.update({
        spreadsheetId, range: `${range}!A${sheetRow}:Q${sheetRow}`,
        valueInputOption: "RAW", requestBody: { values }
      });
    } else {
      await sheets.spreadsheets.values.append({
        spreadsheetId, range: `${range}!A:Q`, valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS", requestBody: { values }
      });
    }
    return reply(res, 200, { ok: true, id: clean.id });
  } catch (error) {
    console.error("Google Sheets write failed:", error);
    return reply(res, 500, { error: "No se pudo guardar el pedido en Google Sheets" });
  }
};
