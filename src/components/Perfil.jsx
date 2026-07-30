import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { User, Mail, ShoppingBag, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export const Perfil = ({ usuario, setVistaActual, setUsuario }) => {
    const [compras, setCompras] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        cargarCompras();
    }, []);

    const cargarCompras = async () => {
        try {
            setCargando(true);
            const ventas = await apiService.getMyPurchases();
            console.log('Todas las ventas:', ventas);
            
            // FILTRAR SOLO LAS PAGADAS
            const ventasArray = Array.isArray(ventas) ? ventas : [];
            const comprasPagadas = ventasArray.filter(v => v.estadoPago === 'PAGADO');
            
            console.log('Compras pagadas:', comprasPagadas);
            setCompras(comprasPagadas);
        } catch (err) {
            console.error('Error al cargar compras:', err);
            setError('Error al cargar tus compras');
            setCompras([]);
        } finally {
            setCargando(false);
        }
    };

    if (cargando) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12"
                    style={{
                        border: '3px solid rgba(0, 240, 255, 0.1)',
                        borderTopColor: '#00f0ff'
                    }}
                />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="rounded-2xl p-6"
                style={{
                    background: 'rgba(15, 18, 30, 0.95)',
                    border: '1px solid rgba(0, 240, 255, 0.3)',
                    boxShadow: '0 0 60px rgba(0, 240, 255, 0.08)'
                }}
            >
                {/* Información del usuario */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b"
                    style={{ borderColor: 'rgba(0, 240, 255, 0.1)' }}
                >
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
                        style={{
                            background: 'linear-gradient(135deg, #00f0ff, #ff00c8)',
                            color: '#fff',
                            boxShadow: '0 0 40px rgba(0, 240, 255, 0.3)'
                        }}
                    >
                        {usuario?.nombre?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold" style={{ color: '#e8e8ff' }}>
                            {usuario?.nombre || 'Usuario'}
                        </h2>
                        <p className="text-sm" style={{ color: '#8a8aaa' }}>
                            <Mail className="w-4 h-4 inline mr-1" />
                            {usuario?.username || 'Sin email'}
                        </p>
                        <p className="text-xs mt-1" style={{ color: '#8a8aaa' }}>
                            Rol: {usuario?.rol === 'ROLE_ADMIN' ? 'Administrador' : 'Cliente'}
                        </p>
                    </div>
                </div>

                {/* Botones */}
                <div className="flex gap-3 mb-6">
                    <button
                        onClick={() => setVistaActual('catalogo')}
                        className="px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300"
                        style={{
                            background: 'rgba(0, 240, 255, 0.1)',
                            border: '1px solid rgba(0, 240, 255, 0.2)',
                            color: '#00f0ff'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(0, 240, 255, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(0, 240, 255, 0.1)';
                        }}
                    >
                        Volver al Catalogo
                    </button>
                    <button
                        onClick={() => {
                            apiService.logout();
                            setUsuario(null);
                            setVistaActual('catalogo');
                        }}
                        className="px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300"
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
                        Cerrar Sesion
                    </button>
                </div>

                {/* Historial de compras - SOLO PAGADAS */}
                <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2"
                        style={{
                            fontFamily: "'Orbitron', monospace",
                            color: '#00f0ff',
                            textShadow: '0 0 30px rgba(0, 240, 255, 0.3)'
                        }}
                    >
                        <CheckCircle className="w-5 h-5" />
                        Mi Historial de Compras
                        <span className="text-sm font-normal ml-2" style={{ color: '#8a8aaa' }}>
                            ({compras.length} compras pagadas)
                        </span>
                    </h3>

                    {error && (
                        <div className="p-3 rounded-xl flex items-center gap-2 text-sm mb-4"
                            style={{
                                background: 'rgba(255, 0, 200, 0.08)',
                                border: '1px solid rgba(255, 0, 200, 0.2)',
                                color: '#ff44b0'
                            }}
                        >
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    {compras.length === 0 ? (
                        <div className="p-8 text-center rounded-xl"
                            style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.05)'
                            }}
                        >
                            <ShoppingBag className="w-12 h-12 mx-auto mb-2" style={{ color: '#8a8aaa' }} />
                            <p className="text-sm" style={{ color: '#8a8aaa' }}>
                                No tienes compras pagadas.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {compras.map((venta) => (
                                <div
                                    key={venta.id}
                                    className="p-4 rounded-xl"
                                    style={{
                                        background: 'rgba(0, 255, 65, 0.05)',
                                        border: '1px solid rgba(0, 255, 65, 0.15)'
                                    }}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold" style={{ color: '#c8c8e8' }}>
                                                Venta #{venta.id}
                                            </p>
                                            <p className="text-xs" style={{ color: '#8a8aaa' }}>
                                                {venta.fechaCreacion ? new Date(venta.fechaCreacion).toLocaleDateString() : 'Fecha no disponible'}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs" style={{ color: '#8a8aaa' }}>
                                                    {venta.detalles?.length || 0} productos
                                                </span>
                                                <span className="text-xs font-bold" style={{ color: '#00ff41' }}>
                                                    <CheckCircle className="w-3 h-3 inline mr-1" />
                                                    PAGADO
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-lg" style={{ color: '#00f0ff' }}>
                                                ${venta.total?.toFixed(2) || '0.00'}
                                            </p>
                                            {venta.detalles && venta.detalles.length > 0 && (
                                                <div className="text-xs mt-1" style={{ color: '#8a8aaa' }}>
                                                    {venta.detalles.map((d, i) => (
                                                        <span key={i}>
                                                            {d.producto?.nombre || 'Producto'} x{d.cantidad || 1}
                                                            {i < venta.detalles.length - 1 && ', '}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
