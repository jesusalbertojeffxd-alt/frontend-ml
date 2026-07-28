import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Search, Filter, ShoppingCart, Info, AlertTriangle } from 'lucide-react';

export const Catalogo = ({ setVistaActual, usuario, addToCart }) => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [carga, setCarga] = useState(true);
    const [error, setError] = useState('');

    const [searchQuery, setSearchQuery] = useState('');
    const [selecionCategoria, setSelecionCategoria] = useState('Todos');

    useEffect(() => {
        const cargaDatosCatalogo = async () => {
            setCarga(true);
            try {
                const datosProductos = await apiService.getProductos();
                console.log('Productos recibidos:', datosProductos);
                setProductos(datosProductos);
                const datosCategorias = await apiService.getCategorias();
                console.log('Categorias recibidas:', datosCategorias);
                setCategorias(datosCategorias);
            } catch (err) {
                setError('Error en el servidor backend: ' + err);
            } finally {
                setCarga(false);
            }
        };
        cargaDatosCatalogo();
    }, []);
    
    const handleAddToCart = (producto) => {
        if (!usuario) {
            setVistaActual('login');
            return;
        }
        
        if (usuario.rol !== 'ROLE_CLIENTE') {
            alert('Solo los usuarios registrados con el rol de cliente pueden realizar compras');
            return;
        }
        
        if (producto.stock <= 0) {
            alert('Este producto no tiene stock disponible');
            return;
        }
        
        addToCart(producto);
    };

    const filtroProductos = productos.filter((producto) => {
        const busqueda =
            producto.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (producto.descripcion &&
                producto.descripcion.toLowerCase().includes(searchQuery.toLowerCase()));

        const busquedaCategorias =
            selecionCategoria === 'Todos' ||
            (producto.categoria && producto.categoria.nombre === selecionCategoria);

        return busqueda && busquedaCategorias;
    });

    if (carga) {
        return (
            <div className="flex flex-col items-center justify-center py-20"
                style={{
                    background: 'rgba(0, 0, 0, 0.9)',
                    borderRadius: '16px',
                    border: '1px solid rgba(0, 240, 255, 0.2)',
                    boxShadow: '0 0 40px rgba(0, 240, 255, 0.05)'
                }}
            >
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16"
                        style={{
                            border: '3px solid rgba(0, 240, 255, 0.1)',
                            borderTopColor: '#00f0ff',
                            boxShadow: '0 0 40px rgba(0, 240, 255, 0.2)'
                        }}
                    />
                </div>
                <p className="mt-6 font-medium"
                    style={{
                        fontFamily: "'Rajdhani', sans-serif",
                        color: '#c8c8e8',
                        letterSpacing: '2px',
                        textTransform: 'uppercase'
                    }}
                >
                    Cargando productos...
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Banner Gamer */}
            <div className="rounded-2xl p-8 mb-8 text-white relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.12), rgba(180, 0, 255, 0.12))',
                    border: '1px solid rgba(0, 240, 255, 0.3)',
                    boxShadow: '0 0 60px rgba(0, 240, 255, 0.08), inset 0 0 60px rgba(0, 240, 255, 0.03)',
                    backgroundColor: 'rgba(10, 12, 25, 0.8)'
                }}
            >
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full animate-pulse"
                            style={{
                                width: Math.random() * 3 + 1 + 'px',
                                height: Math.random() * 3 + 1 + 'px',
                                background: ['#00f0ff', '#ff00c8', '#b400ff', '#00ff41'][i % 4],
                                left: Math.random() * 100 + '%',
                                top: Math.random() * 100 + '%',
                                animationDuration: Math.random() * 8 + 4 + 's',
                                animationDelay: Math.random() * 4 + 's',
                                opacity: 0.25,
                                filter: 'blur(1px)'
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10 max-w-xl">
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight"
                        style={{
                            fontFamily: "'Orbitron', monospace",
                            color: '#00f0ff',
                            textShadow: '0 0 40px rgba(0, 240, 255, 0.5), 0 0 80px rgba(0, 240, 255, 0.2)',
                            letterSpacing: '2px'
                        }}
                    >
                        CATÁLOGO <span style={{
                            color: '#ff00c8',
                            textShadow: '0 0 40px rgba(255, 0, 200, 0.4)'
                        }}>GAMER</span>
                    </h1>
                    <p className="mt-2 text-sm sm:text-base"
                        style={{
                            fontFamily: "'Rajdhani', sans-serif",
                            color: '#d0d0f0',
                            letterSpacing: '1px'
                        }}
                    >
                        Explora las mejores ofertas, productos de calidad y envíos garantizados
                    </p>
                </div>
                <div className="absolute right-0 bottom-0 top-0 opacity-5 flex items-center justify-center p-8">
                    <ShoppingCart className="w-64 h-64" style={{ color: '#00f0ff' }} />
                </div>
            </div>

            {error && (
                <div className="p-4 rounded-xl flex items-start gap-2.5 text-sm mb-6"
                    style={{
                        background: 'rgba(255, 0, 200, 0.08)',
                        border: '1px solid rgba(255, 0, 200, 0.25)',
                        color: '#ff44b0'
                    }}
                >
                    <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#ff00c8' }} />
                    <div>
                        <span className="font-bold">Aviso:</span> {error}. Mostrando interfaz local.
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-8">
                {/* Filtros Lateral (Sidebar) */}
                <div className="w-full md:w-1/4 flex-shrink-0 space-y-6">
                    <div className="p-5 rounded-2xl space-y-3"
                        style={{
                            background: 'rgba(15, 18, 30, 0.85)',
                            border: '1px solid rgba(0, 240, 255, 0.2)',
                            boxShadow: '0 0 30px rgba(0, 240, 255, 0.05)',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider"
                            style={{
                                fontFamily: "'Orbitron', monospace",
                                color: '#00f0ff',
                                letterSpacing: '2px',
                                textShadow: '0 0 20px rgba(0, 240, 255, 0.3)'
                            }}
                        >
                            <Search className="w-4 h-4" /> Buscar Producto
                        </h3>
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar producto..."
                                className="w-full p-3 pl-4 rounded-xl text-sm"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(0, 240, 255, 0.2)',
                                    color: '#e8e8ff',
                                    outline: 'none',
                                    transition: 'all 0.3s ease'
                                }}
                                onFocus={(e) => {
                                    e.target.style.boxShadow = '0 0 40px rgba(0, 240, 255, 0.15)';
                                    e.target.style.borderColor = '#00f0ff';
                                }}
                                onBlur={(e) => {
                                    e.target.style.boxShadow = 'none';
                                    e.target.style.borderColor = 'rgba(0, 240, 255, 0.2)';
                                }}
                            />
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl space-y-4"
                        style={{
                            background: 'rgba(15, 18, 30, 0.85)',
                            border: '1px solid rgba(255, 0, 200, 0.2)',
                            boxShadow: '0 0 30px rgba(255, 0, 200, 0.05)',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider"
                            style={{
                                fontFamily: "'Orbitron', monospace",
                                color: '#ff00c8',
                                letterSpacing: '2px',
                                textShadow: '0 0 20px rgba(255, 0, 200, 0.3)'
                            }}
                        >
                            <Filter className="w-4 h-4" /> Categorías
                        </h3>
                        <div className="flex flex-col gap-1.5">
                            <button
                                onClick={() => setSelecionCategoria('Todos')}
                                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                                    selecionCategoria === 'Todos'
                                        ? 'font-bold'
                                        : ''
                                }`}
                                style={{
                                    background: selecionCategoria === 'Todos' 
                                        ? 'rgba(0, 240, 255, 0.15)' 
                                        : 'transparent',
                                    border: selecionCategoria === 'Todos'
                                        ? '1px solid #00f0ff'
                                        : '1px solid transparent',
                                    color: selecionCategoria === 'Todos' 
                                        ? '#00f0ff' 
                                        : '#9a9aba',
                                    boxShadow: selecionCategoria === 'Todos'
                                        ? '0 0 30px rgba(0, 240, 255, 0.08)'
                                        : 'none'
                                }}
                                onMouseEnter={(e) => {
                                    if (selecionCategoria !== 'Todos') {
                                        e.target.style.color = '#00f0ff';
                                        e.target.style.borderColor = 'rgba(0, 240, 255, 0.3)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (selecionCategoria !== 'Todos') {
                                        e.target.style.color = '#9a9aba';
                                        e.target.style.borderColor = 'transparent';
                                    }
                                }}
                            >
                                Todas las categorías
                            </button>
                            {categorias.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelecionCategoria(cat.nombre)}
                                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                                        selecionCategoria === cat.nombre
                                            ? 'font-bold'
                                            : ''
                                    }`}
                                    style={{
                                        background: selecionCategoria === cat.nombre 
                                            ? 'rgba(255, 0, 200, 0.15)' 
                                            : 'transparent',
                                        border: selecionCategoria === cat.nombre
                                            ? '1px solid #ff00c8'
                                            : '1px solid transparent',
                                        color: selecionCategoria === cat.nombre 
                                            ? '#ff00c8' 
                                            : '#9a9aba',
                                        boxShadow: selecionCategoria === cat.nombre
                                            ? '0 0 30px rgba(255, 0, 200, 0.08)'
                                            : 'none'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (selecionCategoria !== cat.nombre) {
                                            e.target.style.color = '#ff00c8';
                                            e.target.style.borderColor = 'rgba(255, 0, 200, 0.3)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (selecionCategoria !== cat.nombre) {
                                            e.target.style.color = '#9a9aba';
                                            e.target.style.borderColor = 'transparent';
                                        }
                                    }}
                                >
                                    {cat.nombre}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl text-center"
                        style={{
                            background: 'rgba(15, 18, 30, 0.8)',
                            border: '1px solid rgba(0, 255, 65, 0.2)',
                            boxShadow: '0 0 20px rgba(0, 255, 65, 0.03)'
                        }}
                    >
                        <p className="text-xs uppercase tracking-wider"
                            style={{
                                fontFamily: "'Orbitron', monospace",
                                color: '#7a7a9a',
                                letterSpacing: '1px'
                            }}
                        >
                            Productos encontrados
                        </p>
                        <p className="text-2xl font-bold mt-1"
                            style={{
                                fontFamily: "'Orbitron', monospace",
                                color: '#00ff41',
                                textShadow: '0 0 30px rgba(0, 255, 65, 0.4)'
                            }}
                        >
                            {filtroProductos.length}
                        </p>
                    </div>
                </div>

                {/* Cuadrícula de Productos */}
                <div className="w-full md:w-3/4">
                    {filtroProductos.length === 0 ? (
                        <div className="rounded-2xl p-12 text-center"
                            style={{
                                background: 'rgba(15, 18, 30, 0.85)',
                                border: '1px solid rgba(255, 0, 200, 0.2)'
                            }}
                        >
                            <AlertTriangle className="w-12 h-12 mx-auto mb-4" style={{ color: '#ff00c8' }} />
                            <h3 className="font-bold text-lg"
                                style={{
                                    fontFamily: "'Orbitron', monospace",
                                    color: '#d0d0f0',
                                    letterSpacing: '1px'
                                }}
                            >
                                No se encontraron productos
                            </h3>
                            <p className="text-sm mt-1" style={{ color: '#7a7a9a' }}>
                                Prueba a modificar los filtros o los términos de búsqueda.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtroProductos.map((producto) => {
                                const defaultImage = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300";
                                const isOutOfStock = producto.stock <= 0;
                                
                                const colors = ['#00f0ff', '#ff00c8', '#b400ff', '#00ff41', '#ffe600'];
                                const color = colors[producto.id % colors.length];

                                return (
                                    <div
                                        key={producto.id}
                                        className="rounded-2xl overflow-hidden flex flex-col transition-all duration-500 group hover:-translate-y-3 hover:scale-[1.02]"
                                        style={{
                                            background: 'rgba(20, 25, 45, 0.9)',
                                            border: `1px solid ${color}33`,
                                            boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)',
                                            backdropFilter: 'blur(10px)',
                                            position: 'relative'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.boxShadow = `0 0 60px ${color}44, 0 10px 40px rgba(0,0,0,0.6)`;
                                            e.currentTarget.style.borderColor = `${color}77`;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 0, 0, 0.5)';
                                            e.currentTarget.style.borderColor = `${color}33`;
                                        }}
                                    >
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                            style={{
                                                background: `conic-gradient(from 0deg, transparent, ${color}18, transparent, ${color}18, transparent)`,
                                                animation: 'rotateGlow 3s linear infinite'
                                            }}
                                        />

                                        {/* Imagen - CORREGIDO: imagen_url */}
                                        <div className="h-48 w-full relative overflow-hidden">
                                            <img
                                                src={producto.imagen_url || defaultImage}
                                                alt={producto.nombre}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                onError={(e) => {
                                                    e.target.src = defaultImage;
                                                }}
                                            />
                                            {producto.categoria && (
                                                <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm"
                                                    style={{
                                                        background: 'rgba(0, 0, 0, 0.8)',
                                                        border: `1px solid ${color}55`,
                                                        color: color,
                                                        fontFamily: "'Rajdhani', sans-serif",
                                                        letterSpacing: '1px'
                                                    }}
                                                >
                                                    {producto.categoria.nombre}
                                                </span>
                                            )}
                                            {isOutOfStock && (
                                                <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full"
                                                    style={{
                                                        background: 'rgba(255, 0, 0, 0.85)',
                                                        color: '#fff',
                                                        fontFamily: "'Orbitron', monospace",
                                                        letterSpacing: '1px',
                                                        boxShadow: '0 0 20px rgba(255, 0, 0, 0.3)'
                                                    }}
                                                >
                                                    AGOTADO
                                                </span>
                                            )}
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                style={{
                                                    background: `linear-gradient(to bottom, transparent 50%, ${color}20)`
                                                }}
                                            />
                                        </div>

                                        <div className="p-5 flex-grow flex flex-col justify-between space-y-4 relative z-10">
                                            <div className="space-y-2">
                                                {producto.proveedor && (
                                                    <div className="text-xs font-semibold flex items-center gap-1"
                                                        style={{
                                                            color: '#8a8aaa',
                                                            fontFamily: "'Rajdhani', sans-serif",
                                                            letterSpacing: '0.5px'
                                                        }}
                                                    >
                                                        {producto.proveedor.nombre}
                                                    </div>
                                                )}
                                                <h3 className="font-bold text-base line-clamp-1 transition-colors duration-300 group-hover:text-[#00f0ff]"
                                                    style={{
                                                        fontFamily: "'Rajdhani', sans-serif",
                                                        color: '#e8e8ff',
                                                        letterSpacing: '0.5px'
                                                    }}
                                                >
                                                    {producto.nombre}
                                                </h3>
                                                <p className="text-xs line-clamp-2 h-8"
                                                    style={{ color: '#8a8aaa' }}
                                                >
                                                    {producto.descripcion || 'Sin descripción disponible.'}
                                                </p>
                                            </div>

                                            <div className="pt-2 border-t"
                                                style={{ borderColor: `${color}22` }}
                                            >
                                                <div className="flex justify-between items-baseline">
                                                    <span className="font-extrabold text-xl"
                                                        style={{
                                                            fontFamily: "'Orbitron', monospace",
                                                            color: '#00f0ff',
                                                            textShadow: '0 0 30px rgba(0, 240, 255, 0.5), 0 0 60px rgba(0, 240, 255, 0.2)'
                                                        }}
                                                    >
                                                        ${producto.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                                    </span>
                                                    <span className={`text-xs font-bold ${isOutOfStock ? 'text-red-400' : 'text-[#00ff41]'}`}
                                                        style={{
                                                            fontFamily: "'Rajdhani', sans-serif",
                                                            letterSpacing: '0.5px',
                                                            textShadow: isOutOfStock ? '0 0 20px rgba(255,0,0,0.3)' : '0 0 20px rgba(0,255,65,0.3)'
                                                        }}
                                                    >
                                                        {isOutOfStock ? 'Sin stock' : `Disponibles: ${producto.stock}`}
                                                    </span>
                                                </div>

                                                <button
                                                    onClick={() => handleAddToCart(producto)}
                                                    disabled={isOutOfStock || !usuario}
                                                    className={`w-full mt-4 flex items-center justify-center gap-2 p-3 rounded-xl font-bold text-xs transition-all duration-300 cursor-pointer ${
                                                        isOutOfStock || !usuario
                                                            ? 'cursor-not-allowed opacity-50'
                                                            : 'hover:scale-105'
                                                    }`}
                                                    style={{
                                                        background: isOutOfStock || !usuario
                                                            ? 'rgba(255, 255, 255, 0.05)'
                                                            : `linear-gradient(135deg, #00f0ff, #00a8cc)`,
                                                        border: isOutOfStock || !usuario
                                                            ? '1px solid rgba(255, 255, 255, 0.05)'
                                                            : '1px solid #00f0ff',
                                                        color: isOutOfStock || !usuario
                                                            ? '#6a6a8a'
                                                            : '#fff',
                                                        boxShadow: isOutOfStock || !usuario
                                                            ? 'none'
                                                            : '0 0 30px rgba(0, 240, 255, 0.3)',
                                                        fontFamily: "'Rajdhani', sans-serif",
                                                        letterSpacing: '1px',
                                                        textTransform: 'uppercase',
                                                        animation: !isOutOfStock && usuario ? 'pulseButton 2s ease-in-out infinite' : 'none'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (!isOutOfStock && usuario) {
                                                            e.currentTarget.style.boxShadow = '0 0 60px rgba(0, 240, 255, 0.5)';
                                                            e.currentTarget.style.animation = 'none';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (!isOutOfStock && usuario) {
                                                            e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 240, 255, 0.3)';
                                                            e.currentTarget.style.animation = 'pulseButton 2s ease-in-out infinite';
                                                        }
                                                    }}
                                                >
                                                    <ShoppingCart className="w-4 h-4" />
                                                    {!usuario ? 'Inicia sesión para comprar' : isOutOfStock ? 'Agotado' : 'Añadir al Carrito'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
