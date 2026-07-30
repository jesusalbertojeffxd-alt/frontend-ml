import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { ShoppingBag, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

const Compras = ({ usuario, setVistaActual }) => {
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

    if (compras.length === 0) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="rounded-2xl p-12 text-center"
                    style={{
                        background: 'rgba(15, 18, 30, 0.95)',
                        border: '1px solid rgba(0, 240, 255, 0.3)',
                        boxShadow: '0 0 60px rgba(0, 240, 255, 0.08)'
                    }}
                >
                    <ShoppingBag className="w-24 h-24 mx-auto mb-4" style={{ color: '#00f0ff' }} />
                    <h2 className="text-2xl font-bold mb-2"
                        style={{
                            fontFamily: "'Orbitron', monospace",
                            color: '#00f0ff'
                        }}
                    >
                        SIN COMPRAS PAGADAS
                    </h2>
                    <p className="text-sm" style={{ color: '#8a8aaa' }}>
                        Aun no has realizado ninguna compra pagada.
                    </p>
                    <button
                        onClick={() => setVistaActual('catalogo')}
                        className="mt-4 px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300"
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
                        Volver al catalogo
                    </button>
                </div>
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
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"
                    style={{
                        fontFamily: "'Orbitron', monospace",
                        color: '#00f0ff',
                        textShadow: '0 0 30px rgba(0, 240, 255, 0.3)'
                    }}
                >
                    <CheckCircle className="w-6 h-6" />
                    MIS COMPRAS PAGADAS
                    <span className="text-sm font-normal ml-2"
                        style={{ color: '#8a8aaa' }}
                    >
                        ({compras.length} compras)
                    </span>
                </h2>

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

                <div className="space-y-4">
                    {compras.map((venta) => {
                        return (
                            <div
                                key={venta.id}
                                className="p-4 rounded-xl flex justify-between items-center"
                                style={{
                                    background: 'rgba(0, 255, 65, 0.05)',
                                    border: '1px solid rgba(0, 255, 65, 0.2)'
                                }}
                            >
                                <div>
                                    <p className="font-bold" style={{ color: '#c8c8e8' }}>
                                        Pedido #{venta.id}
                                    </p>
                                    <p className="text-sm" style={{ color: '#8a8aaa' }}>
                                        Total: ${venta.total?.toFixed(2) || '0.00'}
                                    </p>
                                    <p className="text-xs" style={{ color: '#8a8aaa' }}>
                                        Fecha: {venta.fechaCreacion ? new Date(venta.fechaCreacion).toLocaleDateString() : 'No disponible'}
                                    </p>
                                    <div className="mt-1">
                                        <span className="text-xs font-bold flex items-center gap-1"
                                            style={{ color: '#00ff41' }}
                                        >
                                            <CheckCircle className="w-3 h-3" />
                                            Pagado
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <button
                    onClick={() => setVistaActual('catalogo')}
                    className="mt-6 w-full py-3 rounded-xl text-sm font-bold transition-all duration-300"
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
                    Volver al catalogo
                </button>
            </div>
        </div>
    );
};

export default Compras;
