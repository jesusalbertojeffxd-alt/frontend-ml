import React, { useState, useEffect } from 'react';
import { 
  Users, Package, ShoppingCart, DollarSign, Plus, Edit, Trash2, Settings,
  BarChart3, Loader2, AlertCircle, Search, RefreshCw, X
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
          <p style={{ color: '#c8c8e8' }}>Cargando datos del panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Encabezado */}
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Orbitron', monospace", color: '#00f0ff' }}>
            ADMIN PANEL
          </h1>
          <p style={{ color: '#8a8aaa' }}>Gestiona tu tienda</p>
        </div>
        <button
          onClick={() => setVistaActual('catalogo')}
          className="px-4 py-2 rounded-xl border border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff]/10 transition-all"
        >
          ← Ver Catálogo
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Productos', value: estadisticas.totalProductos, icon: Package, color: '#00f0ff' },
          { label: 'Categorías', value: categorias.length, icon: BarChart3, color: '#ff00c8' },
          { label: 'Proveedores', value: estadisticas.totalProveedores, icon: Users, color: '#b400ff' },
          { label: 'Clientes', value: estadisticas.totalClientes, icon: Users, color: '#00ff41' },
          { label: 'Ventas', value: estadisticas.totalVentas, icon: ShoppingCart, color: '#ffe600' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#0a0c1a]/80 p-4 rounded-xl border" style={{ borderColor: `${stat.color}33` }}>
            <div className="flex items-center gap-2">
              <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              <span className="text-xs" style={{ color: '#8a8aaa' }}>{stat.label}</span>
            </div>
            <p className="text-2xl font-bold font-['Orbitron']" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-[#1a1a2e] pb-4">
        {['dashboard', 'productos', 'categorias', 'proveedores', 'clientes'].map((tab) => (
          <button
            key={tab}
            onClick={() => setVistaActualLocal(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
              vistaActual === tab ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30' : 'text-[#8a8aaa] hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6">
          {error}
        </div>
      )}

      {/* Contenido */}
      <div className="bg-[#0a0c1a]/80 rounded-2xl p-6 border border-[#1a1a2e]">
        {vistaActual === 'dashboard' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-[#1a1a2e]">
              <h3 className="font-bold text-[#00f0ff] mb-4">Resumen</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span style={{ color: '#8a8aaa' }}>Total Productos</span><span style={{ color: '#e8e8ff' }}>{estadisticas.totalProductos}</span></div>
                <div className="flex justify-between"><span style={{ color: '#8a8aaa' }}>Total Ventas</span><span style={{ color: '#e8e8ff' }}>{estadisticas.totalVentas}</span></div>
                <div className="flex justify-between"><span style={{ color: '#8a8aaa' }}>Ingresos</span><span style={{ color: '#00ff41' }}>{formatearPrecio(estadisticas.ingresosTotales)}</span></div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#1a1a2e]">
              <h3 className="font-bold text-[#ff00c8] mb-4">Acciones Rápidas</h3>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => abrirModal('producto', 'crear')} className="px-4 py-2 bg-[#00f0ff]/20 text-[#00f0ff] rounded-lg text-sm">+ Producto</button>
                <button onClick={() => abrirModal('categoria', 'crear')} className="px-4 py-2 bg-[#ff00c8]/20 text-[#ff00c8] rounded-lg text-sm">+ Categoría</button>
                <button onClick={() => abrirModal('proveedor', 'crear')} className="px-4 py-2 bg-[#b400ff]/20 text-[#b400ff] rounded-lg text-sm">+ Proveedor</button>
              </div>
            </div>
          </div>
        )}

        {vistaActual === 'productos' && (
          <div>
            <div className="flex flex-wrap gap-4 mb-4">
              <input
                type="text"
                placeholder="Buscar..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="flex-1 p-3 bg-[#1a1a2e] rounded-xl text-sm text-white border border-[#2a2a3e] focus:border-[#00f0ff] focus:outline-none"
              />
              <button onClick={() => abrirModal('producto', 'crear')} className="px-4 py-2 bg-[#00f0ff] text-black rounded-xl font-bold hover:bg-[#00f0ff]/80 transition-all">+ Nuevo</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {productosFiltrados.map(p => (
                <div key={p.id} className="bg-[#1a1a2e] p-4 rounded-xl border border-[#2a2a3e] hover:border-[#00f0ff]/30 transition-all">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="text-white font-bold">{p.nombre}</h4>
                      <p className="text-sm text-[#8a8aaa] line-clamp-1">{p.descripcion}</p>
                      <p className="text-[#00f0ff] font-bold">{formatearPrecio(p.precio)}</p>
                      <p className="text-xs text-[#8a8aaa]">Stock: {p.stock}</p>
                      {p.categoria && <span className="text-xs bg-[#00f0ff]/10 text-[#00f0ff] px-2 py-1 rounded-full">{p.categoria.nombre}</span>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => abrirModal('producto', 'editar', p)} className="text-[#00f0ff] hover:scale-110 transition-all"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => eliminarProducto(p.id)} className="text-[#ff00c8] hover:scale-110 transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {vistaActual === 'categorias' && (
          <div>
            <button onClick={() => abrirModal('categoria', 'crear')} className="mb-4 px-4 py-2 bg-[#ff00c8] text-white rounded-xl font-bold hover:bg-[#ff00c8]/80 transition-all">+ Nueva Categoría</button>
            <div className="flex flex-wrap gap-2">
              {categorias.map(c => (
                <div key={c.id} className="bg-[#1a1a2e] px-4 py-2 rounded-xl flex items-center gap-2 border border-[#2a2a3e]">
                  <span className="text-white">{c.nombre}</span>
                  <button onClick={() => eliminarCategoria(c.id)} className="text-[#ff00c8] hover:scale-110 transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {vistaActual === 'proveedores' && (
          <div>
            <button onClick={() => abrirModal('proveedor', 'crear')} className="mb-4 px-4 py-2 bg-[#b400ff] text-white rounded-xl font-bold hover:bg-[#b400ff]/80 transition-all">+ Nuevo Proveedor</button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {proveedores.map(p => (
                <div key={p.id} className="bg-[#1a1a2e] p-4 rounded-xl border border-[#2a2a3e]">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="text-white font-bold">{p.nombre}</h4>
                      <p className="text-sm text-[#8a8aaa]">{p.direccion}</p>
                      <p className="text-sm text-[#8a8aaa]">{p.email}</p>
                    </div>
                    <button onClick={() => eliminarProveedor(p.id)} className="text-[#ff00c8] hover:scale-110 transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {vistaActual === 'clientes' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#2a2a3e]">
                <th className="p-3 text-left text-[#8a8aaa]">Nombre</th>
                <th className="p-3 text-left text-[#8a8aaa]">Email</th>
                <th className="p-3 text-left text-[#8a8aaa]">Teléfono</th>
              </tr></thead>
              <tbody>
                {clientes.map(c => (
                  <tr key={c.id} className="border-b border-[#1a1a2e]">
                    <td className="p-3 text-white">{c.nombre}</td>
                    <td className="p-3 text-[#8a8aaa]">{c.email}</td>
                    <td className="p-3 text-[#8a8aaa]">{c.telefono || '-'}</td>
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
          <div className="bg-[#0a0c1a] rounded-2xl p-6 w-full max-w-md border border-[#00f0ff]/20 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#00f0ff]">
                {modalAccion === 'crear' ? 'Crear' : 'Editar'} {modalTipo}
              </h3>
              <button onClick={cerrarModal} className="text-[#8a8aaa] hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {modalTipo === 'producto' && (
                <div className="space-y-3">
                  <input type="text" placeholder="Nombre" value={formProducto.nombre} onChange={(e) => setFormProducto({...formProducto, nombre: e.target.value})} className="w-full p-3 bg-[#1a1a2e] rounded-xl text-white border border-[#2a2a3e] focus:border-[#00f0ff] focus:outline-none" required />
                  <textarea placeholder="Descripción" value={formProducto.descripcion} onChange={(e) => setFormProducto({...formProducto, descripcion: e.target.value})} className="w-full p-3 bg-[#1a1a2e] rounded-xl text-white border border-[#2a2a3e] focus:border-[#00f0ff] focus:outline-none" rows="2" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" step="0.01" placeholder="Precio" value={formProducto.precio} onChange={(e) => setFormProducto({...formProducto, precio: e.target.value})} className="w-full p-3 bg-[#1a1a2e] rounded-xl text-white border border-[#2a2a3e] focus:border-[#00f0ff] focus:outline-none" required />
                    <input type="number" placeholder="Stock" value={formProducto.stock} onChange={(e) => setFormProducto({...formProducto, stock: e.target.value})} className="w-full p-3 bg-[#1a1a2e] rounded-xl text-white border border-[#2a2a3e] focus:border-[#00f0ff] focus:outline-none" required />
                  </div>
                  <input type="text" placeholder="URL de Imagen" value={formProducto.imagenUrl} onChange={(e) => setFormProducto({...formProducto, imagenUrl: e.target.value})} className="w-full p-3 bg-[#1a1a2e] rounded-xl text-white border border-[#2a2a3e] focus:border-[#00f0ff] focus:outline-none" />
                  <select value={formProducto.categoria?.id || ''} onChange={(e) => setFormProducto({...formProducto, categoria: { id: parseInt(e.target.value) }})} className="w-full p-3 bg-[#1a1a2e] rounded-xl text-white border border-[#2a2a3e] focus:border-[#00f0ff] focus:outline-none" required>
                    <option value="">Seleccionar categoría</option>
                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                  <select value={formProducto.proveedor?.id || ''} onChange={(e) => setFormProducto({...formProducto, proveedor: { id: parseInt(e.target.value) }})} className="w-full p-3 bg-[#1a1a2e] rounded-xl text-white border border-[#2a2a3e] focus:border-[#00f0ff] focus:outline-none">
                    <option value="">Seleccionar proveedor</option>
                    {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select>
                </div>
              )}
              
              {modalTipo === 'categoria' && (
                <input type="text" placeholder="Nombre de la categoría" value={formCategoria.nombre} onChange={(e) => setFormCategoria({...formCategoria, nombre: e.target.value})} className="w-full p-3 bg-[#1a1a2e] rounded-xl text-white border border-[#2a2a3e] focus:border-[#ff00c8] focus:outline-none" required />
              )}
              
              {modalTipo === 'proveedor' && (
                <div className="space-y-3">
                  <input type="text" placeholder="Nombre" value={formProveedor.nombre} onChange={(e) => setFormProveedor({...formProveedor, nombre: e.target.value})} className="w-full p-3 bg-[#1a1a2e] rounded-xl text-white border border-[#2a2a3e] focus:border-[#b400ff] focus:outline-none" required />
                  <input type="text" placeholder="Dirección" value={formProveedor.direccion} onChange={(e) => setFormProveedor({...formProveedor, direccion: e.target.value})} className="w-full p-3 bg-[#1a1a2e] rounded-xl text-white border border-[#2a2a3e] focus:border-[#b400ff] focus:outline-none" />
                  <input type="email" placeholder="Email" value={formProveedor.email} onChange={(e) => setFormProveedor({...formProveedor, email: e.target.value})} className="w-full p-3 bg-[#1a1a2e] rounded-xl text-white border border-[#2a2a3e] focus:border-[#b400ff] focus:outline-none" />
                  <input type="text" placeholder="Teléfono" value={formProveedor.telefono} onChange={(e) => setFormProveedor({...formProveedor, telefono: e.target.value})} className="w-full p-3 bg-[#1a1a2e] rounded-xl text-white border border-[#2a2a3e] focus:border-[#b400ff] focus:outline-none" />
                </div>
              )}
              
              <div className="flex gap-3 mt-6">
                <button type="submit" className="flex-1 py-3 bg-[#00f0ff] text-black rounded-xl font-bold hover:bg-[#00f0ff]/80 transition-all">
                  {modalAccion === 'crear' ? 'Crear' : 'Actualizar'}
                </button>
                <button type="button" onClick={cerrarModal} className="px-6 py-3 bg-[#1a1a2e] text-[#8a8aaa] rounded-xl hover:text-white transition-all">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
