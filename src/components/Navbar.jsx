import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, LogIn, LogOut, Home, Clock, Menu, X } from 'lucide-react';
import { apiService } from '../services/apiService';

export const Navbar = ({ 
    usuario, 
    setUsuario, 
    setVistaActual, 
    vistaActual,
    carrito = [], 
    setCarrito,
    setMostrarCarrito
}) => {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [pedidosPendientesCount, setPedidosPendientesCount] = useState(0);

    useEffect(() => {
        if (usuario) {
            cargarPedidosPendientes();
        }
    }, [usuario]);

    const cargarPedidosPendientes = async () => {
        try {
            const ventas = await apiService.getMyPurchases();
            const ventasArray = Array.isArray(ventas) ? ventas : [];
            const pendientes = ventasArray.filter(v => v.estadoPago === 'PENDIENTE');
            setPedidosPendientesCount(pendientes.length);
        } catch (error) {
            console.log('No se pudieron cargar pedidos pendientes:', error.message);
            setPedidosPendientesCount(0);
        }
    };

    const handleLogout = () => {
        apiService.logout();
        setUsuario(null);
        setVistaActual('catalogo');
        setCarrito([]);
        setMenuAbierto(false);
    };

    const carritoArray = Array.isArray(carrito) ? carrito : [];
    const totalItems = carritoArray.reduce((sum, item) => sum + (item.cantidad || 1), 0);

    return (
        <nav className="sticky top-0 z-50"
            style={{
                background: 'rgba(8, 10, 20, 0.95)',
                borderBottom: '1px solid rgba(0, 240, 255, 0.15)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.8)'
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <button
                        onClick={() => {
                            setVistaActual('catalogo');
                            setMenuAbierto(false);
                        }}
                        className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
                    >
                        <div className="relative">
                            <span className="text-2xl font-extrabold"
                                style={{
                                    fontFamily: "'Orbitron', monospace",
                                    color: '#00f0ff',
                                    textShadow: '0 0 30px rgba(0, 240, 255, 0.3)'
                                }}
                            >
                                ALIXX
                            </span>
                            <span className="text-2xl font-extrabold"
                                style={{
                                    fontFamily: "'Orbitron', monospace",
                                    color: '#ff00c8',
                                    textShadow: '0 0 30px rgba(255, 0, 200, 0.3)'
                                }}
                            >
                                PRES
                            </span>
                        </div>
                        <div className="w-1 h-6"
                            style={{
                                background: 'linear-gradient(to bottom, #00f0ff, #ff00c8)',
                                boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)'
                            }}
                        />
                        <span className="text-xs font-light tracking-widest"
                            style={{
                                fontFamily: "'Rajdhani', sans-serif",
                                color: '#8a8aaa',
                                letterSpacing: '2px'
                            }}
                        >
                            GAMER
                        </span>
                    </button>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-2">
                        <button
                            onClick={() => {
                                setVistaActual('catalogo');
                                setMenuAbierto(false);
                            }}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                                vistaActual === 'catalogo' ? 'font-bold' : ''
                            }`}
                            style={{
                                background: vistaActual === 'catalogo' 
                                    ? 'rgba(0, 240, 255, 0.15)' 
                                    : 'transparent',
                                border: vistaActual === 'catalogo'
                                    ? '1px solid #00f0ff'
                                    : '1px solid transparent',
                                color: vistaActual === 'catalogo' 
                                    ? '#00f0ff' 
                                    : '#9a9aba',
                                boxShadow: vistaActual === 'catalogo'
                                    ? '0 0 30px rgba(0, 240, 255, 0.08)'
                                    : 'none'
                            }}
                        >
                            <Home className="w-4 h-4" />
                            Inicio
                        </button>

                        {/* BOTON CARRITO - ARREGLADO */}
                        <button
                            onClick={() => {
                                console.log('Abriendo carrito...');
                                if (setMostrarCarrito) {
                                    setMostrarCarrito(true);
                                }
                                if (setVistaActual) {
                                    setVistaActual('cart');
                                }
                                setMenuAbierto(false);
                            }}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 relative ${
                                vistaActual === 'cart' ? 'font-bold' : ''
                            }`}
                            style={{
                                background: vistaActual === 'cart' 
                                    ? 'rgba(0, 240, 255, 0.15)' 
                                    : 'transparent',
                                border: vistaActual === 'cart'
                                    ? '1px solid #00f0ff'
                                    : '1px solid transparent',
                                color: vistaActual === 'cart' 
                                    ? '#00f0ff' 
                                    : '#9a9aba',
                                boxShadow: vistaActual === 'cart'
                                    ? '0 0 30px rgba(0, 240, 255, 0.08)'
                                    : 'none'
                            }}
                            onMouseEnter={(e) => {
                                if (vistaActual !== 'cart') {
                                    e.target.style.color = '#00f0ff';
                                    e.target.style.borderColor = 'rgba(0, 240, 255, 0.3)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (vistaActual !== 'cart') {
                                    e.target.style.color = '#9a9aba';
                                    e.target.style.borderColor = 'transparent';
                                }
                            }}
                        >
                            <ShoppingCart className="w-4 h-4" />
                            Carrito
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full"
                                    style={{
                                        background: 'linear-gradient(135deg, #ff00c8, #b400ff)',
                                        color: '#fff',
                                        boxShadow: '0 0 20px rgba(255, 0, 200, 0.4)'
                                    }}
                                >
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        {usuario && (
                            <button
                                onClick={() => {
                                    setVistaActual('compras');
                                    setMenuAbierto(false);
                                }}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 relative ${
                                    vistaActual === 'compras' ? 'font-bold' : ''
                                }`}
                                style={{
                                    background: vistaActual === 'compras' 
                                        ? 'rgba(255, 0, 200, 0.15)' 
                                        : 'transparent',
                                    border: vistaActual === 'compras'
                                        ? '1px solid #ff00c8'
                                        : '1px solid transparent',
                                    color: vistaActual === 'compras' 
                                        ? '#ff00c8' 
                                        : '#9a9aba',
                                    boxShadow: vistaActual === 'compras'
                                        ? '0 0 30px rgba(255, 0, 200, 0.08)'
                                        : 'none'
                                }}
                            >
                                <Clock className="w-4 h-4" />
                                Mis Compras
                                {pedidosPendientesCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full"
                                        style={{
                                            background: 'linear-gradient(135deg, #ff4444, #cc0000)',
                                            color: '#fff',
                                            boxShadow: '0 0 20px rgba(255, 0, 0, 0.4)',
                                            animation: 'pulse 2s infinite'
                                        }}
                                    >
                                        {pedidosPendientesCount}
                                    </span>
                                )}
                            </button>
                        )}

                        {usuario ? (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        setVistaActual('perfil');
                                        setMenuAbierto(false);
                                    }}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                                        vistaActual === 'perfil' ? 'font-bold' : ''
                                    }`}
                                    style={{
                                        background: vistaActual === 'perfil' 
                                            ? 'rgba(0, 240, 255, 0.15)' 
                                            : 'transparent',
                                        border: vistaActual === 'perfil'
                                            ? '1px solid #00f0ff'
                                            : '1px solid transparent',
                                        color: vistaActual === 'perfil' 
                                            ? '#00f0ff' 
                                            : '#9a9aba',
                                        boxShadow: vistaActual === 'perfil'
                                            ? '0 0 30px rgba(0, 240, 255, 0.08)'
                                            : 'none'
                                    }}
                                >
                                    <User className="w-4 h-4" />
                                    {usuario.nombre || usuario.username}
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2"
                                    style={{
                                        background: 'rgba(255, 0, 0, 0.1)',
                                        border: '1px solid rgba(255, 0, 0, 0.2)',
                                        color: '#ff4444'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = 'rgba(255, 0, 0, 0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'rgba(255, 0, 0, 0.1)';
                                    }}
                                >
                                    <LogOut className="w-4 h-4" />
                                    Salir
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => {
                                    setVistaActual('login');
                                    setMenuAbierto(false);
                                }}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                                    vistaActual === 'login' || vistaActual === 'registro' ? 'font-bold' : ''
                                }`}
                                style={{
                                    background: vistaActual === 'login' || vistaActual === 'registro'
                                        ? 'rgba(0, 240, 255, 0.15)' 
                                        : 'transparent',
                                    border: vistaActual === 'login' || vistaActual === 'registro'
                                        ? '1px solid #00f0ff'
                                        : '1px solid transparent',
                                    color: vistaActual === 'login' || vistaActual === 'registro'
                                        ? '#00f0ff' 
                                        : '#9a9aba',
                                    boxShadow: vistaActual === 'login' || vistaActual === 'registro'
                                        ? '0 0 30px rgba(0, 240, 255, 0.08)'
                                        : 'none'
                                }}
                            >
                                <LogIn className="w-4 h-4" />
                                Iniciar Sesion
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => setMenuAbierto(!menuAbierto)}
                        className="md:hidden p-2 rounded-xl transition-all duration-300"
                        style={{
                            color: '#c8c8e8',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.05)'
                        }}
                    >
                        {menuAbierto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {menuAbierto && (
                <div className="md:hidden"
                    style={{
                        background: 'rgba(8, 10, 20, 0.98)',
                        borderTop: '1px solid rgba(0, 240, 255, 0.1)',
                        backdropFilter: 'blur(12px)'
                    }}
                >
                    <div className="px-4 py-4 space-y-2">
                        <button
                            onClick={() => {
                                setVistaActual('catalogo');
                                setMenuAbierto(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300"
                            style={{
                                background: vistaActual === 'catalogo' 
                                    ? 'rgba(0, 240, 255, 0.15)' 
                                    : 'transparent',
                                color: vistaActual === 'catalogo' 
                                    ? '#00f0ff' 
                                    : '#9a9aba'
                            }}
                        >
                            <Home className="w-5 h-5" />
                            Inicio
                        </button>

                        <button
                            onClick={() => {
                                if (setMostrarCarrito) {
                                    setMostrarCarrito(true);
                                }
                                if (setVistaActual) {
                                    setVistaActual('cart');
                                }
                                setMenuAbierto(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative"
                            style={{
                                background: vistaActual === 'cart' 
                                    ? 'rgba(0, 240, 255, 0.15)' 
                                    : 'transparent',
                                color: vistaActual === 'cart' 
                                    ? '#00f0ff' 
                                    : '#9a9aba'
                            }}
                        >
                            <ShoppingCart className="w-5 h-5" />
                            Carrito
                            {totalItems > 0 && (
                                <span className="ml-auto flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full"
                                    style={{
                                        background: 'linear-gradient(135deg, #ff00c8, #b400ff)',
                                        color: '#fff'
                                    }}
                                >
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        {usuario && (
                            <>
                                <button
                                    onClick={() => {
                                        setVistaActual('compras');
                                        setMenuAbierto(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative"
                                    style={{
                                        background: vistaActual === 'compras' 
                                            ? 'rgba(255, 0, 200, 0.15)' 
                                            : 'transparent',
                                        color: vistaActual === 'compras' 
                                            ? '#ff00c8' 
                                            : '#9a9aba'
                                    }}
                                >
                                    <Clock className="w-5 h-5" />
                                    Mis Compras
                                    {pedidosPendientesCount > 0 && (
                                        <span className="ml-auto flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full"
                                            style={{
                                                background: 'linear-gradient(135deg, #ff4444, #cc0000)',
                                                color: '#fff'
                                            }}
                                        >
                                            {pedidosPendientesCount}
                                        </span>
                                    )}
                                </button>

                                <button
                                    onClick={() => {
                                        setVistaActual('perfil');
                                        setMenuAbierto(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300"
                                    style={{
                                        background: vistaActual === 'perfil' 
                                            ? 'rgba(0, 240, 255, 0.15)' 
                                            : 'transparent',
                                        color: vistaActual === 'perfil' 
                                            ? '#00f0ff' 
                                            : '#9a9aba'
                                    }}
                                >
                                    <User className="w-5 h-5" />
                                    {usuario.nombre || usuario.username}
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300"
                                    style={{
                                        background: 'rgba(255, 0, 0, 0.1)',
                                        color: '#ff4444'
                                    }}
                                >
                                    <LogOut className="w-5 h-5" />
                                    Cerrar Sesion
                                </button>
                            </>
                        )}

                        {!usuario && (
                            <button
                                onClick={() => {
                                    setVistaActual('login');
                                    setMenuAbierto(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300"
                                style={{
                                    background: vistaActual === 'login' || vistaActual === 'registro'
                                        ? 'rgba(0, 240, 255, 0.15)' 
                                        : 'transparent',
                                    color: vistaActual === 'login' || vistaActual === 'registro'
                                        ? '#00f0ff' 
                                        : '#9a9aba'
                                }}
                            >
                                <LogIn className="w-5 h-5" />
                                Iniciar Sesion
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};
