import React, { useState, useEffect } from 'react';
import { 
  Users, Package, ShoppingCart, DollarSign, Plus, Edit, Trash2, 
  BarChart3, Loader2, AlertCircle, Search, RefreshCw, X,
  LayoutDashboard, Settings, Database, TrendingUp, Clock
} from 'lucide-react';
import { apiService } from '../services/apiService';

export const AdminDashboard = ({ setVistaActual }) => {
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  
  const [estadisticas, setEstadisticas] = useState({
    totalProductos: 0,
    totalClientes: 0,
    totalVentas: 0,
    ingresosTotales: 0,
    totalProveedores: 0
  });
  
  const [vistaActual, setVistaActualLocal] = useState('dashboard');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modalTipo, setModalTipo] = useState('');
  const [modalAccion, setModalAccion] = useState('crear');
  const [itemSeleccionado, setItemSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');

  const [formProducto, setFormProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagenUrl: '',
    categoria: { id: '' },
    proveedor: { id: '' }
  });

  const [formCategoria, setFormCategoria] = useState({ nombre: '' });
  const [formProveedor, setFormProveedor] = useState({
    nombre: '',
    direccion: '',
    email: '',
    telefono: ''
  });

  const cargarDatos = async () => {
    setCargando(true);
    setError(null);
    
    try {
      const [prod, cat, cli, vent, prov] = await Promise.all([
        apiService.getProductos().catch(() => []),
        apiService.getCategorias().catch(() => []),
        apiService.getClientes().catch(() => []),
        apiService.getVentas().catch(() => []),
        apiService.getProveedores().catch(() => [])
      ]);
      
      setProductos(prod || []);
      setCategorias(cat || []);
      setClientes(cli || []);
      setVentas(vent || []);
      setProveedores(prov || []);
      
      const ingresos = vent?.reduce((sum, v) => sum + (v.total || 0), 0) || 0;
      
      setEstadisticas({
        totalProductos: prod?.length || 0,
        totalClientes: cli?.length || 0,
        totalVentas: vent?.length || 0,
        ingresosTotales: ingresos,
        totalProveedores: prov?.length || 0
      });
      
    } catch (err) {
      setError('Error al cargar los datos');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // ============ CRUD ============
  const crearProducto = async (producto) => {
    try {
      const nuevo = await apiService.crearProducto(producto);
      setProductos([...productos, nuevo]);
      cerrarModal();
      cargarDatos();
    } catch (err) {
      setError('Error al crear el producto');
    }
  };

  const editarProducto = async (id, producto) => {
    try {
      const actualizado = await apiService.actualizarProducto(id, producto);
      setProductos(productos.map(p => p.id === id ? actualizado : p));
      cerrarModal();
      cargarDatos();
    } catch (err) {
      setError('Error al actualizar el producto');
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await apiService.eliminarProducto(id);
      setProductos(productos.filter(p => p.id !== id));
      cargarDatos();
    } catch (err) {
      setError('Error al eliminar el producto');
    }
  };

  const crearCategoria = async (categoria) => {
    try {
      const nueva = await apiService.crearCategoria(categoria);
      setCategorias([...categorias, nueva]);
      cerrarModal();
      cargarDatos();
    } catch (err) {
      setError('Error al crear la categoría');
    }
  };

  const eliminarCategoria = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return;
    try {
      await apiService.eliminarCategoria(id);
      setCategorias(categorias.filter(c => c.id !== id));
      cargarDatos();
    } catch (err) {
      setError('Error al eliminar la categoría');
    }
  };

  const crearProveedor = async (proveedor) => {
    try {
      const nuevo = await apiService.crearProveedor(proveedor);
      setProveedores([...proveedores, nuevo]);
      cerrarModal();
      cargarDatos();
    } catch (err) {
      setError('Error al crear el proveedor');
    }
  };

  const eliminarProveedor = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este proveedor?')) return;
    try {
      await apiService.eliminarProveedor(id);
      setProveedores(proveedores.filter(p => p.id !== id));
      cargarDatos();
    } catch (err) {
      setError('Error al eliminar el proveedor');
    }
  };

  // ============ UI ============
  const abrirModal = (tipo, accion, item = null) => {
    setModalTipo(tipo);
    setModalAccion(accion);
    setItemSeleccionado(item);
    
    if (tipo === 'producto') {
      if (accion === 'crear') {
        setFormProducto({ nombre: '', descripcion: '', precio: '', stock: '', imagenUrl: '', categoria: { id: '' }, proveedor: { id: '' } });
      } else if (accion === 'editar' && item) {
        setFormProducto({
          nombre: item.nombre || '',
          descripcion: item.descripcion || '',
          precio: item.precio || '',
          stock: item.stock || '',
          imagenUrl: item.imagenUrl || '',
          categoria: item.categoria || { id: '' },
          proveedor: item.proveedor || { id: '' }
        });
      }
    } else if (tipo === 'categoria') {
      setFormCategoria({ nombre: item?.nombre || '' });
    } else if (tipo === 'proveedor') {
      setFormProveedor({
        nombre: item?.nombre || '',
        direccion: item?.direccion || '',
        email: item?.email || '',
        telefono: item?.telefono || ''
      });
    }
    
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setItemSeleccionado(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (modalTipo === 'producto') {
      const productoData = {
        ...formProducto,
        precio: parseFloat(formProducto.precio),
        stock: parseInt(formProducto.stock)
      };
      if (modalAccion === 'crear') {
        await crearProducto(productoData);
      } else {
        await editarProducto(itemSeleccionado.id, productoData);
      }
    } else if (modalTipo === 'categoria') {
      await crearCategoria(formCategoria);
    } else if (modalTipo === 'proveedor') {
      await crearProveedor(formProveedor);
    }
  };

  const formatearPrecio = (precio) => {
    return `$${Number(precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
  };

  const productosFiltrados = productos.filter(p => {
    const coincideBusqueda = p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) || 
                           p.descripcion?.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = filtroCategoria === 'Todas' || p.categoria?.nombre === filtroCategoria;
    return coincideBusqueda && coincideCategoria;
  });

  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: '#00f0ff' }} />
          <p style={{ color: '#c8c8e8', fontFamily: "'Rajdhani', sans-serif" }}>
            Cargando datos del panel...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative min-h-screen overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 20% 50%, rgba(0, 240, 255, 0.05), transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(255, 0, 200, 0.05), transparent 50%), #0a0c15'
      }}
    >
      {/* === CÍRCULOS DECORATIVOS === */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute rounded-full opacity-20 animate-pulse"
          style={{
            width: '600px',
            height: '600px',
            top: '-200px',
            right: '-200px',
            background: 'radial-gradient(circle, rgba(0, 240, 255, 0.15), transparent 70%)',
            border: '2px solid rgba(0, 240, 255, 0.1)',
            animationDuration: '8s'
          }}
        />
        <div 
          className="absolute rounded-full opacity-15 animate-pulse"
          style={{
            width: '500px',
            height: '500px',
            bottom: '-150px',
            left: '-150px',
            background: 'radial-gradient(circle, rgba(255, 0, 200, 0.12), transparent 70%)',
            border: '2px solid rgba(255, 0, 200, 0.08)',
            animationDuration: '10s',
            animationDelay: '2s'
          }}
        />
        <div 
          className="absolute rounded-full opacity-10 animate-pulse"
          style={{
            width: '300px',
            height: '300px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(180, 0, 255, 0.08), transparent 70%)',
            border: '2px solid rgba(180, 0, 255, 0.06)',
            animationDuration: '12s',
            animationDelay: '4s'
          }}
        />
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              width: `${Math.random() * 80 + 20}px`,
              height: `${Math.random() * 80 + 20}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, ${['#00f0ff', '#ff00c8', '#b400ff', '#00ff41'][i % 4]}, transparent 70%)`,
              border: `1px solid ${['rgba(0, 240, 255, 0.1)', 'rgba(255, 0, 200, 0.1)', 'rgba(180, 0, 255, 0.1)', 'rgba(0, 255, 65, 0.1)'][i % 4]}`,
              animation: 'float 4s ease-in-out infinite',
              animationDelay: `${Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* === CONTENIDO PRINCIPAL === */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ===== ENCABEZADO ===== */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold" style={{ 
                fontFamily: "'Orbitron', monospace",
                color: '#00f0ff',
                textShadow: '0 0 40px rgba(0, 240, 255, 0.3), 0 0 80px rgba(0, 240, 255, 0.1)'
              }}>
                ADMIN PANEL
              </h1>
              <p style={{ color: '#8a8aaa', fontFamily: "'Rajdhani', sans-serif" }}>
                Acceso de alto nivel - Sistema NEO v2.0
              </p>
            </div>
            <button
              onClick={() => setVistaActual('catalogo')}
              className="px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105"
              style={{
                background: 'rgba(0, 240, 255, 0.1)',
                border: '1px solid rgba(0, 240, 255, 0.2)',
                color: '#00f0ff',
                fontFamily: "'Rajdhani', sans-serif",
                letterSpacing: '1px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(0, 240, 255, 0.2)';
                e.target.style.boxShadow = '0 0 30px rgba(0, 240, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(0, 240, 255, 0.1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              ← Volver al Catálogo
            </button>
          </div>
        </div>

        {/* ===== ESTADÍSTICAS ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Productos', value: estadisticas.totalProductos, icon: Package, color: '#00f0ff' },
            { label: 'Categorías', value: categorias.length, icon: BarChart3, color: '#ff00c8' },
            { label: 'Proveedores', value: estadisticas.totalProveedores, icon: Users, color: '#b400ff' },
            { label: 'Clientes', value: estadisticas.totalClientes, icon: Users, color: '#00ff41' },
            { label: 'Ventas', value: estadisticas.totalVentas, icon: ShoppingCart, color: '#ffe600' },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded-2xl p-4 relative overflow-hidden group transition-all duration-300 hover:scale-105"
              style={{
                background: 'rgba(0, 0, 0, 0.6)',
                border: `1px solid ${stat.color}33`,
                boxShadow: `0 0 30px ${stat.color}11, inset 0 0 60px ${stat.color}05`,
                backdropFilter: 'blur(10px)'
              }}
            >
              <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <stat.icon className="w-8 h-8" style={{ color: stat.color }} />
              </div>
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: '#6a6a8a', fontFamily: "'Rajdhani', sans-serif" }}>
                {stat.label}
              </p>
              <p className="text-2xl font-bold" style={{ color: stat.color, textShadow: `0 0 30px ${stat.color}33`, fontFamily: "'Orbitron', monospace" }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* ===== TABS ===== */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-[#1a1a2e] pb-4">
          {['dashboard', 'productos', 'categorias', 'proveedores', 'clientes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setVistaActualLocal(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 capitalize ${
                vistaActual === tab ? 'scale-105' : ''
              }`}
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                letterSpacing: '1px',
                background: vistaActual === tab ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255,255,255,0.03)',
                border: vistaActual === tab ? '1px solid #00f0ff' : '1px solid transparent',
                color: vistaActual === tab ? '#00f0ff' : '#8a8aaa',
                boxShadow: vistaActual === tab ? '0 0 30px rgba(0, 240, 255, 0.05)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (vistaActual !== tab) {
                  e.target.style.color = '#c8c8e8';
                  e.target.style.borderColor = 'rgba(0, 240, 255, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (vistaActual !== tab) {
                  e.target.style.color = '#8a8aaa';
                  e.target.style.borderColor = 'transparent';
                }
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-4 rounded-xl flex items-start gap-2.5 text-sm mb-6"
            style={{
              background: 'rgba(255, 0, 200, 0.08)',
              border: '1px solid rgba(255, 0, 200, 0.2)',
              color: '#ff44b0'
            }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* ===== CONTENIDO ===== */}
        <div className="bg-[#0a0c1a]/80 rounded-2xl p-6 border border-[#1a1a2e] backdrop-blur-sm">
          {vistaActual === 'dashboard' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0, 240, 255, 0.08)' }}>
                <h3 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: '#00f0ff', fontFamily: "'Orbitron', monospace" }}>
                  <TrendingUp className="w-4 h-4 inline mr-2" />
                  Resumen del Sistema
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-[#1a1a2e]">
                    <span style={{ color: '#8a8aaa' }}>Total Productos</span>
                    <span style={{ color: '#e8e8ff', fontWeight: 'bold' }}>{estadisticas.totalProductos}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#1a1a2e]">
                    <span style={{ color: '#8a8aaa' }}>Total Ventas</span>
                    <span style={{ color: '#e8e8ff', fontWeight: 'bold' }}>{estadisticas.totalVentas}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#1a1a2e]">
                    <span style={{ color: '#8a8aaa' }}>Total Clientes</span>
                    <span style={{ color: '#e8e8ff', fontWeight: 'bold' }}>{estadisticas.totalClientes}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span style={{ color: '#8a8aaa' }}>Ingresos Totales</span>
                    <span style={{ color: '#00ff41', fontWeight: 'bold', fontFamily: "'Orbitron', monospace" }}>
                      {formatearPrecio(estadisticas.ingresosTotales)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255, 0, 200, 0.08)' }}>
                <h3 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: '#ff00c8', fontFamily: "'Orbitron', monospace" }}>
                  <Clock className="w-4 h-4 inline mr-2" />
                  Acciones Rápidas
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => abrirModal('producto', 'crear')}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'rgba(0, 240, 255, 0.12)',
                      border: '1px solid rgba(0, 240, 255, 0.2)',
                      color: '#00f0ff'
                    }}
                  >
                    <Plus className="w-4 h-4 inline mr-1" /> Producto
                  </button>
                  <button
                    onClick={() => abrirModal('categoria', 'crear')}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'rgba(255, 0, 200, 0.12)',
                      border: '1px solid rgba(255, 0, 200, 0.2)',
                      color: '#ff00c8'
                    }}
                  >
                    <Plus className="w-4 h-4 inline mr-1" /> Categoría
                  </button>
                  <button
                    onClick={() => abrirModal('proveedor', 'crear')}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'rgba(180, 0, 255, 0.12)',
                      border: '1px solid rgba(180, 0, 255, 0.2)',
                      color: '#b400ff'
                    }}
                  >
                    <Plus className="w-4 h-4 inline mr-1" /> Proveedor
                  </button>
                </div>
              </div>
            </div>
          )}

          {vistaActual === 'productos' && (
            <div>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6a6a8a' }} />
                  <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(0, 240, 255, 0.15)',
                      color: '#e8e8ff'
                    }}
                  />
                </div>
                <select
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                  className="px-4 py-2.5 rounded-xl text-sm"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(0, 240, 255, 0.15)',
                    color: '#e8e8ff'
                  }}
                >
                  <option value="Todas">Todas las categorías</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
                  ))}
                </select>
                <button
                  onClick={() => abrirModal('producto', 'crear')}
                  className="px-5 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #00f0ff, #0088cc)',
                    color: '#fff',
                    boxShadow: '0 0 30px rgba(0, 240, 255, 0.2)'
                  }}
                >
                  <Plus className="w-4 h-4" /> Nuevo Producto
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {productosFiltrados.map(p => (
                  <div
                    key={p.id}
                    className="rounded-xl p-4 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(0, 240, 255, 0.08)',
                      backdropFilter: 'blur(10px)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.3)';
                      e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 240, 255, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.08)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-bold text-white">{p.nombre}</h4>
                        <p className="text-sm text-[#8a8aaa] line-clamp-1">{p.descripcion}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="font-bold font-['Orbitron']" style={{ color: '#00f0ff' }}>
                            {formatearPrecio(p.precio)}
                          </span>
                          <span className="text-xs text-[#8a8aaa]">Stock: {p.stock}</span>
                        </div>
                        {p.categoria && (
                          <span className="text-xs px-2 py-1 rounded-full" style={{
                            background: 'rgba(0, 240, 255, 0.1)',
                            color: '#00f0ff'
                          }}>
                            {p.categoria.nombre}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => abrirModal('producto', 'editar', p)}
                          className="p-1.5 rounded-lg transition-all hover:scale-110"
                          style={{ color: '#00f0ff' }}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => eliminarProducto(p.id)}
                          className="p-1.5 rounded-lg transition-all hover:scale-110"
                          style={{ color: '#ff00c8' }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {productosFiltrados.length === 0 && (
                <p className="text-center py-8" style={{ color: '#6a6a8a' }}>No hay productos para mostrar</p>
              )}
            </div>
          )}

          {vistaActual === 'categorias' && (
            <div>
              <button
                onClick={() => abrirModal('categoria', 'crear')}
                className="mb-4 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #ff00c8, #cc0099)',
                  color: '#fff',
                  boxShadow: '0 0 30px rgba(255, 0, 200, 0.2)'
                }}
              >
                <Plus className="w-4 h-4 inline mr-1" /> Nueva Categoría
              </button>
              <div className="flex flex-wrap gap-3">
                {categorias.map(c => (
                  <div
                    key={c.id}
                    className="px-4 py-2 rounded-xl flex items-center gap-2 transition-all hover:scale-105"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255, 0, 200, 0.15)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <span className="text-white">{c.nombre}</span>
                    <button
                      onClick={() => eliminarCategoria(c.id)}
                      className="text-[#ff00c8] hover:scale-110 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {vistaActual === 'proveedores' && (
            <div>
              <button
                onClick={() => abrirModal('proveedor', 'crear')}
                className="mb-4 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #b400ff, #8800cc)',
                  color: '#fff',
                  boxShadow: '0 0 30px rgba(180, 0, 255, 0.2)'
                }}
              >
                <Plus className="w-4 h-4 inline mr-1" /> Nuevo Proveedor
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {proveedores.map(p => (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl transition-all hover:scale-[1.02]"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(180, 0, 255, 0.08)',
                      backdropFilter: 'blur(10px)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(180, 0, 255, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(180, 0, 255, 0.08)';
                    }}
                  >
                    <div className="flex justify-between">
                      <div>
                        <h4 className="text-white font-bold">{p.nombre}</h4>
                        <p className="text-sm text-[#8a8aaa]">{p.direccion}</p>
                        <p className="text-sm text-[#8a8aaa]">{p.email}</p>
                      </div>
                      <button
                        onClick={() => eliminarProveedor(p.id)}
                        className="text-[#ff00c8] hover:scale-110 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {vistaActual === 'clientes' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'rgba(0, 240, 255, 0.1)' }}>
                    <th className="p-3 text-left" style={{ color: '#8a8aaa' }}>Nombre</th>
                    <th className="p-3 text-left" style={{ color: '#8a8aaa' }}>Email</th>
                    <th className="p-3 text-left" style={{ color: '#8a8aaa' }}>Teléfono</th>
                    <th className="p-3 text-left" style={{ color: '#8a8aaa' }}>Rol</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map(c => (
                    <tr key={c.id} className="border-b" style={{ borderColor: 'rgba(255,255,255,0.03)' }}>
                      <td className="p-3 text-white">{c.nombre}</td>
                      <td className="p-3 text-[#8a8aaa]">{c.email}</td>
                      <td className="p-3 text-[#8a8aaa]">{c.telefono || '-'}</td>
                      <td className="p-3">
                        <span className="text-xs px-2 py-1 rounded-full" style={{
                          background: c.rol === 'ROLE_ADMIN' ? 'rgba(255, 0, 200, 0.15)' : 'rgba(0, 240, 255, 0.15)',
                          color: c.rol === 'ROLE_ADMIN' ? '#ff00c8' : '#00f0ff'
                        }}>
                          {c.rol === 'ROLE_ADMIN' ? 'Admin' : 'Cliente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ===== MODAL ===== */}
        {mostrarModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
              style={{
                background: 'rgba(10, 12, 25, 0.95)',
                border: '1px solid rgba(0, 240, 255, 0.2)',
                boxShadow: '0 0 60px rgba(0, 240, 255, 0.05)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold" style={{ color: '#00f0ff', fontFamily: "'Orbitron', monospace" }}>
                  {modalAccion === 'crear' ? 'Crear' : 'Editar'} {modalTipo}
                </h3>
                <button
                  onClick={cerrarModal}
                  className="text-[#8a8aaa] hover:text-white transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {modalTipo === 'producto' && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Nombre"
                      value={formProducto.nombre}
                      onChange={(e) => setFormProducto({...formProducto, nombre: e.target.value})}
                      className="w-full p-3 rounded-xl text-sm"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(0, 240, 255, 0.15)',
                        color: '#e8e8ff'
                      }}
                      required
                    />
                    <textarea
                      placeholder="Descripción"
                      value={formProducto.descripcion}
                      onChange={(e) => setFormProducto({...formProducto, descripcion: e.target.value})}
                      className="w-full p-3 rounded-xl text-sm resize-none h-20"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(0, 240, 255, 0.15)',
                        color: '#e8e8ff'
                      }}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Precio"
                        value={formProducto.precio}
                        onChange={(e) => setFormProducto({...formProducto, precio: e.target.value})}
                        className="w-full p-3 rounded-xl text-sm"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(0, 240, 255, 0.15)',
                          color: '#e8e8ff'
                        }}
                        required
                      />
                      <input
                        type="number"
                        placeholder="Stock"
                        value={formProducto.stock}
                        onChange={(e) => setFormProducto({...formProducto, stock: e.target.value})}
                        className="w-full p-3 rounded-xl text-sm"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(0, 240, 255, 0.15)',
                          color: '#e8e8ff'
                        }}
                        required
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="URL de Imagen"
                      value={formProducto.imagenUrl}
                      onChange={(e) => setFormProducto({...formProducto, imagenUrl: e.target.value})}
                      className="w-full p-3 rounded-xl text-sm"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(0, 240, 255, 0.15)',
                        color: '#e8e8ff'
                      }}
                    />
                    <select
                      value={formProducto.categoria?.id || ''}
                      onChange={(e) => setFormProducto({...formProducto, categoria: { id: parseInt(e.target.value) }})}
                      className="w-full p-3 rounded-xl text-sm"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(0, 240, 255, 0.15)',
                        color: '#e8e8ff'
                      }}
                      required
                    >
                      <option value="">Seleccionar categoría</option>
                      {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                    <select
                      value={formProducto.proveedor?.id || ''}
                      onChange={(e) => setFormProducto({...formProducto, proveedor: { id: parseInt(e.target.value) }})}
                      className="w-full p-3 rounded-xl text-sm"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(0, 240, 255, 0.15)',
                        color: '#e8e8ff'
                      }}
                    >
                      <option value="">Seleccionar proveedor</option>
                      {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                    </select>
                  </div>
                )}

                {modalTipo === 'categoria' && (
                  <input
                    type="text"
                    placeholder="Nombre de la categoría"
                    value={formCategoria.nombre}
                    onChange={(e) => setFormCategoria({...formCategoria, nombre: e.target.value})}
                    className="w-full p-3 rounded-xl text-sm"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255, 0, 200, 0.15)',
                      color: '#e8e8ff'
                    }}
                    required
                  />
                )}

                {modalTipo === 'proveedor' && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Nombre"
                      value={formProveedor.nombre}
                      onChange={(e) => setFormProveedor({...formProveedor, nombre: e.target.value})}
                      className="w-full p-3 rounded-xl text-sm"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(180, 0, 255, 0.15)',
                        color: '#e8e8ff'
                      }}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Dirección"
                      value={formProveedor.direccion}
                      onChange={(e) => setFormProveedor({...formProveedor, direccion: e.target.value})}
                      className="w-full p-3 rounded-xl text-sm"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(180, 0, 255, 0.15)',
                        color: '#e8e8ff'
                      }}
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={formProveedor.email}
                      onChange={(e) => setFormProveedor({...formProveedor, email: e.target.value})}
                      className="w-full p-3 rounded-xl text-sm"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(180, 0, 255, 0.15)',
                        color: '#e8e8ff'
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Teléfono"
                      value={formProveedor.telefono}
                      onChange={(e) => setFormProveedor({...formProveedor, telefono: e.target.value})}
                      className="w-full p-3 rounded-xl text-sm"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(180, 0, 255, 0.15)',
                        color: '#e8e8ff'
                      }}
                    />
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #00f0ff, #0088cc)',
                      color: '#fff',
                      boxShadow: '0 0 30px rgba(0, 240, 255, 0.2)'
                    }}
                  >
                    {modalAccion === 'crear' ? 'Crear' : 'Actualizar'}
                  </button>
                  <button
                    type="button"
                    onClick={cerrarModal}
                    className="px-6 py-3 rounded-xl font-bold transition-all duration-300"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#6a6a8a'
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.4; }
          }
          .animate-pulse {
            animation: pulse 4s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};
