import React from 'react';
import { apiService } from '../services/apiService';
import { ShoppingCart, LogOut, User, LayoutDashboard, Database, ListOrdered, ShoppingBag } from 'lucide-react';

export const Navbar = ({ VistaActual, setVistaActual, user, onLogout, carCount, openCart }) => {
    const handleLogout = () => {
        apiService.Logout();  // ✅ CORREGIDO: L mayúscula
        onLogout();
        setVistaActual('catalogo');
    }

    const isClient = user && user.rol === 'ROLE_CLIENTE';
    const isAdmin = user && user.rol === 'ROLE_ADMIN';

    return (
        <nav className="sticky top-0 z-50 shadow-md"
            style={{
                background: 'rgba(0, 0, 0, 0.92)',
                backdropFilter: 'blur(20px)',
                borderBottom: '2px solid #00f0ff',
                boxShadow: '0 0 60px rgba(0, 240, 255, 0.08), inset 0 0 60px rgba(0, 240, 255, 0.02)',
                transition: 'all 0.3s ease'
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    
                    {/* Logo */}
                    <div 
                        className="flex items-center cursor-pointer group" 
                        onClick={() => setVistaActual('catalogo')}
                    >
                        <ShoppingBag className="h-8 w-8 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                            style={{
                                color: '#00f0ff',
                                filter: 'drop-shadow(0 0 20px rgba(0, 240, 255, 0.5))'
                            }}
                        />
                        <span className="ml-2 font-bold text-lg transition-all duration-300 group-hover:scale-105"
                            style={{
                                fontFamily: "'Orbitron', monospace",
                                color: '#00f0ff',
                                textShadow: '0 0 30px rgba(0, 240, 255, 0.3)',
                                letterSpacing: '2px'
                            }}
                        >
                            Alixx<span style={{
                                color: '#ff00c8',
                                textShadow: '0 0 30px rgba(255, 0, 200, 0.3)'
                            }}>pres</span>
                        </span>
                    </div>

                    <div className="flex items-center space-x-4">
                        
                        {/* Catálogo */}
                        <button 
                            onClick={() => setVistaActual('catalogo')}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105
                            ${VistaActual === 'catalogo' ? 'font-bold border-b-2' : ''}`}
                            style={{
                                fontFamily: "'Rajdhani', sans-serif",
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                                color: VistaActual === 'catalogo' ? '#00f0ff' : '#c8c8e8',
                                borderColor: '#00f0ff',
                                background: VistaActual === 'catalogo' ? 'rgba(0, 240, 255, 0.08)' : 'transparent',
                                boxShadow: VistaActual === 'catalogo' ? '0 0 30px rgba(0, 240, 255, 0.05)' : 'none'
                            }}
                            onMouseEnter={(e) => {
                                if (VistaActual !== 'catalogo') {
                                    e.target.style.color = '#00f0ff';
                                    e.target.style.textShadow = '0 0 20px rgba(0, 240, 255, 0.2)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (VistaActual !== 'catalogo') {
                                    e.target.style.color = '#c8c8e8';
                                    e.target.style.textShadow = 'none';
                                }
                            }}
                        >
                            Catalogo
                        </button>

                        {/* Mis Compras (Cliente) */}
                        {isClient && (
                            <button 
                                onClick={() => setVistaActual('misCompras')}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105
                                ${VistaActual === 'misCompras' ? 'font-bold border-b-2' : ''}`}
                                style={{
                                    fontFamily: "'Rajdhani', sans-serif",
                                    letterSpacing: '1px',
                                    textTransform: 'uppercase',
                                    color: VistaActual === 'misCompras' ? '#ff00c8' : '#c8c8e8',
                                    borderColor: '#ff00c8',
                                    background: VistaActual === 'misCompras' ? 'rgba(255, 0, 200, 0.08)' : 'transparent',
                                    boxShadow: VistaActual === 'misCompras' ? '0 0 30px rgba(255, 0, 200, 0.05)' : 'none'
                                }}
                                onMouseEnter={(e) => {
                                    if (VistaActual !== 'misCompras') {
                                        e.target.style.color = '#ff00c8';
                                        e.target.style.textShadow = '0 0 20px rgba(255, 0, 200, 0.2)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (VistaActual !== 'misCompras') {
                                        e.target.style.color = '#c8c8e8';
                                        e.target.style.textShadow = 'none';
                                    }
                                }}
                            >
                                <ListOrdered className="w-4 h-4 inline mr-1" />
                                Mis Compras
                            </button>
                        )}

                        {/* Admin Panel */}
                        {isAdmin && (
                            <button 
                                onClick={() => setVistaActual('admin-panel')}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105
                                ${VistaActual === 'admin-panel' ? 'font-bold border-b-2' : ''}`}
                                style={{
                                    fontFamily: "'Rajdhani', sans-serif",
                                    letterSpacing: '1px',
                                    textTransform: 'uppercase',
                                    color: VistaActual === 'admin-panel' ? '#b400ff' : '#c8c8e8',
                                    borderColor: '#b400ff',
                                    background: VistaActual === 'admin-panel' ? 'rgba(180, 0, 255, 0.08)' : 'transparent',
                                    boxShadow: VistaActual === 'admin-panel' ? '0 0 30px rgba(180, 0, 255, 0.05)' : 'none'
                                }}
                                onMouseEnter={(e) => {
                                    if (VistaActual !== 'admin-panel') {
                                        e.target.style.color = '#b400ff';
                                        e.target.style.textShadow = '0 0 20px rgba(180, 0, 255, 0.2)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (VistaActual !== 'admin-panel') {
                                        e.target.style.color = '#c8c8e8';
                                        e.target.style.textShadow = 'none';
                                    }
                                }}
                            >
                                <LayoutDashboard className="w-4 h-4 inline mr-1" />
                                Admin Panel
                            </button>
                        )}

                        {/* Usuario Logueado */}
                        {user ? (
                            <>
                                <div className="flex items-center text-sm font-medium px-3 py-1.5 rounded-full gap-1.5 max-w-[150px] truncate"
                                    style={{
                                        background: 'rgba(0, 240, 255, 0.06)',
                                        border: '1px solid rgba(0, 240, 255, 0.15)',
                                        boxShadow: '0 0 20px rgba(0, 240, 255, 0.02)'
                                    }}
                                >
                                    <User className="w-4 h-4 flex-shrink-0"
                                        style={{
                                            color: '#00f0ff',
                                            filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.3))'
                                        }}
                                    />
                                    <span className="truncate" style={{ color: '#c8c8e8' }}>
                                        {user.nombre}
                                    </span>
                                </div>

                                {/* Carrito (Cliente) */}
                                {isClient && (
                                    <button 
                                        onClick={openCart}
                                        className="relative p-2 rounded-full transition-all duration-300 group"
                                        style={{
                                            background: 'rgba(0, 240, 255, 0.03)',
                                            border: '1px solid rgba(0, 240, 255, 0.08)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.boxShadow = '0 0 40px rgba(0, 240, 255, 0.1)';
                                            e.target.style.borderColor = '#00f0ff';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.boxShadow = 'none';
                                            e.target.style.borderColor = 'rgba(0, 240, 255, 0.08)';
                                        }}
                                    >
                                        <ShoppingCart className="w-6 h-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                                            style={{
                                                color: '#00f0ff',
                                                filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.2))'
                                            }}
                                        />
                                        {carCount > 0 && (
                                            <span className="absolute -top-1 -right-1 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold border-2 border-black animate-bounce"
                                                style={{
                                                    background: '#ff00c8',
                                                    boxShadow: '0 0 20px rgba(255, 0, 200, 0.5)',
                                                    fontFamily: "'Orbitron', monospace",
                                                    fontSize: '10px'
                                                }}
                                            >
                                                {carCount}
                                            </span>
                                        )}
                                    </button>
                                )}

                                {/* Logout */}
                                <button 
                                    onClick={handleLogout}
                                    className="p-2 rounded-full transition-all duration-300"
                                    style={{
                                        background: 'rgba(255, 0, 0, 0.03)',
                                        border: '1px solid rgba(255, 0, 0, 0.08)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.boxShadow = '0 0 40px rgba(255, 0, 0, 0.15)';
                                        e.target.style.borderColor = '#ff0044';
                                        e.target.style.background = 'rgba(255, 0, 0, 0.06)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.boxShadow = 'none';
                                        e.target.style.borderColor = 'rgba(255, 0, 0, 0.08)';
                                        e.target.style.background = 'rgba(255, 0, 0, 0.03)';
                                    }}
                                    title="Cerrar Sesion"
                                >
                                    <LogOut className="w-5 h-5 transition-all duration-300 hover:scale-110 hover:rotate-12"
                                        style={{
                                            color: '#ff4444',
                                            filter: 'drop-shadow(0 0 10px rgba(255, 0, 0, 0.1))'
                                        }}
                                    />
                                </button>
                            </>
                        ) : (
                            /* Usuario No Logueado */
                            <>
                                <button 
                                    onClick={() => setVistaActual('login')}
                                    className="px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105"
                                    style={{
                                        fontFamily: "'Rajdhani', sans-serif",
                                        letterSpacing: '1px',
                                        textTransform: 'uppercase',
                                        color: '#c8c8e8',
                                        border: '1px solid rgba(0, 240, 255, 0.15)',
                                        background: 'rgba(0, 240, 255, 0.03)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.boxShadow = '0 0 40px rgba(0, 240, 255, 0.08)';
                                        e.target.style.borderColor = '#00f0ff';
                                        e.target.style.color = '#00f0ff';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.boxShadow = 'none';
                                        e.target.style.borderColor = 'rgba(0, 240, 255, 0.15)';
                                        e.target.style.color = '#c8c8e8';
                                    }}
                                >
                                    Iniciar Sesion
                                </button>
                                <button 
                                    onClick={() => setVistaActual('register')}
                                    className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105 shadow-md"
                                    style={{
                                        fontFamily: "'Orbitron', monospace",
                                        letterSpacing: '1px',
                                        textTransform: 'uppercase',
                                        background: 'linear-gradient(135deg, #00f0ff, #b400ff)',
                                        color: '#fff',
                                        border: 'none',
                                        boxShadow: '0 0 40px rgba(0, 240, 255, 0.15)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.boxShadow = '0 0 60px rgba(255, 0, 200, 0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.boxShadow = '0 0 40px rgba(0, 240, 255, 0.15)';
                                    }}
                                >
                                    Registrarse
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Línea neon animada */}
            <div style={{
                height: '2px',
                width: '100%',
                background: 'linear-gradient(90deg, transparent, #00f0ff, #ff00c8, #b400ff, transparent)',
                backgroundSize: '200% 100%',
                animation: 'neonLine 3s linear infinite',
                boxShadow: '0 0 40px rgba(0, 240, 255, 0.2)'
            }} />
            
            <style>
                {`
                    @keyframes neonLine {
                        0% { background-position: -200% 0; }
                        100% { background-position: 200% 0; }
                    }
                    @keyframes rotateGlow {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    @keyframes pulseButton {
                        0%, 100% { box-shadow: 0 0 30px rgba(0, 240, 255, 0.2); }
                        50% { box-shadow: 0 0 60px rgba(0, 240, 255, 0.4), 0 0 120px rgba(255, 0, 200, 0.2); }
                    }
                `}
            </style>
        </nav>
    );
};
