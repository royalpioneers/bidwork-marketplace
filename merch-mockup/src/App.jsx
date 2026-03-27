import { useState, useRef, useEffect, useCallback } from 'react';
import { PRODUCTS, COLORS } from './products';
import { getClientes, createCliente, deleteCliente, uploadLogo, saveMockup } from './api';
import './App.css';

export default function App() {
  // Backend state
  const [clientes, setClientes] = useState([]);
  const [clienteActivo, setClienteActivo] = useState(null);
  const [nuevoCliente, setNuevoCliente] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [tab, setTab] = useState('editor'); // 'editor' | 'clientes'

  // Editor state
  const [logoSrc, setLogoSrc] = useState(null);
  const [logoImg, setLogoImg] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [productColor, setProductColor] = useState(COLORS[1].hex);
  const [companyName, setCompanyName] = useState('');
  const [logoScale, setLogoScale] = useState(1);
  const [logoOpacity, setLogoOpacity] = useState(1);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      const data = await getClientes();
      setClientes(data);
    } catch {
      // backend may not be running
    }
  };

  useEffect(() => {
    if (!logoSrc) { setLogoImg(null); return; }
    const img = new Image();
    img.onload = () => setLogoImg(img);
    img.src = logoSrc;
  }, [logoSrc]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { canvasWidth: w, canvasHeight: h } = selectedProduct;
    canvas.width = w;
    canvas.height = h;
    ctx.fillStyle = '#f8f8f8';
    ctx.fillRect(0, 0, w, h);
    selectedProduct.draw(ctx, productColor, logoImg, {
      scale: logoScale,
      opacity: logoOpacity,
    }, companyName);
  }, [selectedProduct, productColor, logoImg, logoScale, logoOpacity, companyName]);

  useEffect(() => { drawCanvas(); }, [drawCanvas]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogoSrc(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogoSrc(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `${companyName || 'mockup'}-${selectedProduct.name}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCrearCliente = async (e) => {
    e.preventDefault();
    if (!nuevoCliente.trim()) return;
    const cliente = await createCliente(nuevoCliente.trim());
    setClientes(prev => [cliente, ...prev]);
    setNuevoCliente('');
  };

  const handleSeleccionarCliente = (cliente) => {
    setClienteActivo(cliente);
    setCompanyName(cliente.nombre);
    setTab('editor');
    // Load logo if client has one
    if (cliente.logo_url) {
      setLogoSrc(cliente.logo_url);
    }
  };

  const handleEliminarCliente = async (e, id) => {
    e.stopPropagation();
    if (!confirm('¿Eliminar este cliente?')) return;
    await deleteCliente(id);
    setClientes(prev => prev.filter(c => c.id !== id));
    if (clienteActivo?.id === id) {
      setClienteActivo(null);
      setCompanyName('');
    }
  };

  const handleGuardarMockup = async () => {
    if (!clienteActivo) return;
    setGuardando(true);
    try {
      const canvas = canvasRef.current;
      const imagenBase64 = canvas.toDataURL('image/png');

      // Upload logo if present and not already saved for this client
      if (logoSrc && !clienteActivo.logo_url) {
        const ext = logoSrc.includes('image/png') ? 'png' : 'jpg';
        await uploadLogo(clienteActivo.id, logoSrc, ext);
      }

      await saveMockup({
        clienteId: clienteActivo.id,
        producto: selectedProduct.id,
        colorProducto: productColor,
        logoEscala: logoScale,
        logoOpacidad: logoOpacity,
        imagenBase64,
      });

      setSavedMsg('¡Mockup guardado!');
      setTimeout(() => setSavedMsg(''), 3000);
      loadClientes();
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Merch<span>Studio</span></h1>
        </div>
        <div className="header-tabs">
          <button className={`header-tab ${tab === 'editor' ? 'active' : ''}`} onClick={() => setTab('editor')}>
            Editor
          </button>
          <button className={`header-tab ${tab === 'clientes' ? 'active' : ''}`} onClick={() => setTab('clientes')}>
            Clientes {clientes.length > 0 && <span className="badge">{clientes.length}</span>}
          </button>
        </div>
        <p>Generador de mockups para merchandising</p>
      </header>

      {tab === 'clientes' ? (
        <div className="clientes-page">
          <div className="clientes-header">
            <h2>Clientes</h2>
            <form className="nuevo-cliente-form" onSubmit={handleCrearCliente}>
              <input
                className="company-input"
                type="text"
                placeholder="Nombre del cliente..."
                value={nuevoCliente}
                onChange={e => setNuevoCliente(e.target.value)}
              />
              <button type="submit" className="btn-add">+ Agregar</button>
            </form>
          </div>

          {clientes.length === 0 ? (
            <div className="empty-clientes">
              <div style={{ fontSize: 48, marginBottom: 12 }}>🏢</div>
              <p>No hay clientes aún</p>
              <small>Agrega tu primer cliente para empezar</small>
            </div>
          ) : (
            <div className="clientes-grid">
              {clientes.map(c => (
                <div
                  key={c.id}
                  className={`cliente-card ${clienteActivo?.id === c.id ? 'active' : ''}`}
                  onClick={() => handleSeleccionarCliente(c)}
                >
                  <div className="cliente-logo">
                    {c.logo_url
                      ? <img src={c.logo_url} alt={c.nombre} />
                      : <span>{c.nombre[0].toUpperCase()}</span>
                    }
                  </div>
                  <div className="cliente-info">
                    <strong>{c.nombre}</strong>
                    <small>{c.total_mockups} mockup{c.total_mockups !== 1 ? 's' : ''}</small>
                  </div>
                  <button
                    className="btn-delete"
                    onClick={(e) => handleEliminarCliente(e, c.id)}
                    title="Eliminar"
                  >×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="main">
          <aside className="sidebar">
            {/* Cliente activo */}
            <div>
              <div className="section-title">Cliente</div>
              {clienteActivo ? (
                <div className="cliente-activo">
                  <span className="cliente-activo-nombre">{clienteActivo.nombre}</span>
                  <button className="btn-change" onClick={() => setTab('clientes')}>Cambiar</button>
                </div>
              ) : (
                <button className="btn-select-cliente" onClick={() => setTab('clientes')}>
                  + Seleccionar cliente
                </button>
              )}
            </div>

            {/* Company name */}
            <div>
              <div className="section-title">Texto en el producto</div>
              <input
                className="company-input"
                type="text"
                placeholder="Nombre de la empresa..."
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
              />
            </div>

            {/* Logo Upload */}
            <div>
              <div className="section-title">Logo</div>
              <div
                className={`upload-area ${logoSrc ? 'has-logo' : ''}`}
                onClick={() => fileInputRef.current.click()}
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
              >
                {logoSrc ? (
                  <>
                    <img className="logo-preview" src={logoSrc} alt="Logo" />
                    <p>Logo cargado</p>
                    <button className="btn-change" onClick={e => { e.stopPropagation(); setLogoSrc(null); }}>
                      Quitar
                    </button>
                  </>
                ) : (
                  <>
                    <div className="upload-icon">🖼️</div>
                    <p>Sube el logo del cliente</p>
                    <small>PNG, JPG, SVG · Arrastra o haz clic</small>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>

            {/* Products */}
            <div>
              <div className="section-title">Producto</div>
              <div className="product-grid">
                {PRODUCTS.map(p => (
                  <div
                    key={p.id}
                    className={`product-card ${selectedProduct.id === p.id ? 'active' : ''}`}
                    onClick={() => setSelectedProduct(p)}
                  >
                    <span className="product-emoji">{p.emoji}</span>
                    <span className="product-name">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <div className="section-title">Color del producto</div>
              <div className="color-palette">
                {COLORS.map(c => (
                  <div
                    key={c.hex}
                    className={`color-swatch ${productColor === c.hex ? 'active' : ''}`}
                    style={{
                      backgroundColor: c.hex,
                      boxShadow: c.hex === '#FFFFFF' ? 'inset 0 0 0 1px #ddd' : 'none'
                    }}
                    title={c.name}
                    onClick={() => setProductColor(c.hex)}
                  />
                ))}
              </div>
            </div>

            {/* Logo controls */}
            {logoSrc && (
              <div>
                <div className="section-title">Ajustes del logo</div>
                <div className="control-group">
                  <div className="control-label">Tamaño</div>
                  <div className="control-row">
                    <input
                      type="range" min="0.3" max="2" step="0.05"
                      value={logoScale}
                      onChange={e => setLogoScale(parseFloat(e.target.value))}
                    />
                    <span className="control-value">{Math.round(logoScale * 100)}%</span>
                  </div>
                </div>
                <div className="control-group" style={{ marginTop: 8 }}>
                  <div className="control-label">Opacidad</div>
                  <div className="control-row">
                    <input
                      type="range" min="0.1" max="1" step="0.05"
                      value={logoOpacity}
                      onChange={e => setLogoOpacity(parseFloat(e.target.value))}
                    />
                    <span className="control-value">{Math.round(logoOpacity * 100)}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="actions-group">
              {clienteActivo && (
                <button
                  className="btn-save"
                  onClick={handleGuardarMockup}
                  disabled={guardando}
                >
                  {guardando ? '💾 Guardando...' : '💾 Guardar mockup'}
                </button>
              )}
              {savedMsg && <div className="saved-msg">{savedMsg}</div>}
              <button className="btn-download" onClick={handleDownload}>
                ⬇️ Descargar PNG
              </button>
            </div>
          </aside>

          <main className="canvas-area">
            <div className="canvas-wrapper">
              <canvas ref={canvasRef} />
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
