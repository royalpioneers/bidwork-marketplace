const BASE = 'http://localhost:8000/api';

export async function getClientes() {
  const res = await fetch(`${BASE}/clientes/`);
  return res.json();
}

export async function createCliente(nombre) {
  const res = await fetch(`${BASE}/clientes/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre }),
  });
  return res.json();
}

export async function deleteCliente(id) {
  await fetch(`${BASE}/clientes/${id}/`, { method: 'DELETE' });
}

export async function uploadLogo(clienteId, logoBase64, ext) {
  const res = await fetch(`${BASE}/clientes/${clienteId}/upload-logo/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ logo_base64: logoBase64, ext }),
  });
  return res.json();
}

export async function saveMockup({ clienteId, producto, colorProducto, logoEscala, logoOpacidad, imagenBase64 }) {
  const res = await fetch(`${BASE}/mockups/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cliente_id: clienteId,
      producto,
      color_producto: colorProducto,
      logo_escala: logoEscala,
      logo_opacidad: logoOpacidad,
      imagen_base64: imagenBase64,
    }),
  });
  return res.json();
}

export async function getClienteMockups(clienteId) {
  const res = await fetch(`${BASE}/clientes/${clienteId}/`);
  return res.json();
}
