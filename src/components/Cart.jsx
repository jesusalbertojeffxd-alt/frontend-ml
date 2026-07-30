import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, AlertCircle, XCircle } from 'lucide-react';
import { apiService } from '../services/apiService';

export const Cart = ({ 
    carrito = [], 
    setCarrito, 
    usuario,
    setVistaActual,
    setMostrarCarrito
}) => {
    const [pedidosPendientes, setPedidosPendientes] = useState([]);
    const [cargandoPendientes, setCargandoPendientes] = useState(false);
    const [mostrarPendientes, setMostrarPendientes] = useState(false);
    const [eliminando, setEliminando] = useState(false);

    const carritoArray = Array.isArray(carrito) ? carrito : [];
    const total = carritoArray.reduce((sum, item) => sum + (item.precio * (item.cantidad || 1)), 0);

    useEffect(() => {
        if (usuario) {
            cargarPedidosPendientes();
        }
    }, [usuario]);

    const cargarPedidosPendientes = async () => {
        try {
            setCargandoPendientes(true);
            const ventas = await apiService.getMyPurchases();
            const ventasArray = Array.isArray(ventas) ? ventas : [];
            const pendientes = ventasArray.filter(v => v.estadoPago === 'PENDIENTE');
            setPedidosPendientes(pendientes);
        } catch (error) {
            console.error('Error al cargar pedidos pendientes:', error);
            setPedidosPendientes([]);
        } finally {
            setCargandoPendientes(false);
        }
    };

    const handleEliminarPedido = async (id) => {
        if (!window.confirm('¿Estas seguro de que quieres eliminar este pedido pendiente?')) {
            return;
        }

        try {
            setEliminando(true);
            await apiService.eliminarVenta(id);
            await cargarPedidosPendientes();
            alert('Pedido eliminado correctamente');
        } catch (error) {
            console.error('Error al eliminar pedido:', error);
            alert('Error al eliminar el pedido');
        } finally {
            setEliminando(false);
        }
    };

    const handlePagarPendiente = (venta) => {
        localStorage.setItem('ventaPendienteId', venta.id);
        if (setVistaActual) {
            setVistaActual('checkout');
        }
        if (setMostrarCarrito) {
            setMostrarCarrito(false);
        }
    };

    const removeFromCart = (id) => {
        if (setCarrito) {
            setCarrito(carritoArray.filter(item => item.id !== id));
        }
    };

    const updateQuantity = (id, cantidad) => {
        if (cantidad <= 0) {
            removeFromCart(id);
            return;
        }
        if (setCarrito) {
            setCarrito(carritoArray.map(item => 
                item.id === id ? { ...item, cantidad } : item
            ));
        }
    };

    const handleClose = () => {
        if (setMostrarCarrito) {
            setMostrarCarrito(false);
        }
        if (setVistaActual) {
            setVistaActual('catalogo');
        }
    };

    if (carritoArray.length === 0) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="rounded-2xl p-12 text-center relative"
                    style={{
                        background: 'rgba(15, 18, 30, 0.95)',
                        border: '1px solid rgba(0, 240, 255, 0.3)',
                        boxShadow: '0 0 60px rgba(0, 240, 255, 0.08)'
                    }}
                >
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 rounded-full transition-all duration-300"
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: '#8a8aaa'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                        }}
                    >
                        <XCircle className="w-6 h-6" />
                    </button>

                    <ShoppingCart className="w-24 h-24 mx-auto mb-4" style={{ color: '#00f0ff' }} />
                    <h2 className="text-2xl font-bold mb-2"
                        style={{
                            fontFamily: "'Orbitron', monospace",
                            color: '#00f0ff'
                        }}
                    >
                        CARRITO VACIO
                    </h2>
                    <p className="text-sm" style={{ color: '#8a8aaa' }}>
                        No hay productos en tu carrito.
                    </p>

                    {pedidosPendientes.length > 0 && (
                        <div className="mt-6">
                            <button
                                onClick={() => setMostrarPendientes(!mostrarPendientes)}
                                className="text-sm font-medium transition-colors duration-300"
                                style={{
                                    color: '#ff00c8',
                                    background: 'rgba(255, 0, 200, 0.1)',
                                    padding: '8px 20px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255, 0, 200, 0.2)'
                                }}
                            >
                                {mostrarPendientes ? 'Ocultar' : 'Mostrar'} Pedidos Pendientes ({pedidosPendientes.length})
                            </button>

                            {mostrarPendientes && (
                                <div className="mt-4 space-y-3">
                                    {pedidosPendientes.map((venta) => (
                                        <div
                                            key={venta.id}
                                            className="p-4 rounded-xl flex justify-between items-center"
                                            style={{
                                                background: 'rgba(255, 0, 200, 0.05)',
                                                border: '1px solid rgba(255, 0, 200, 0.2)'
                                            }}
                                        >
                                            <div className="text-left">
                                                <p className="text-sm font-medium" style={{ color: '#c8c8e8' }}>
                                                    Pedido #{venta.id}
                                                </p>
                                                <p className="text-xs" style={{ color: '#8a8aaa' }}>
                                                    Total: ${venta.total?.toFixed(2) || '0.00'}
                                                </p>
                                                <p className="text-xs" style={{ color: '#ff44b0' }}>
                                                    Pendiente de pago
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handlePagarPendiente(venta)}
                                                    className="px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300"
                                                    style={{
                                                        background: 'linear-gradient(135deg, #00f0ff, #00a8cc)',
                                                        border: '1px solid #00f0ff',
                                                        color: '#fff',
                                                        boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)'
                                                    }}
                                                >
                                                    <CreditCard className="w-4 h-4 inline mr-1" />
                                                    Pagar
                                                </button>
                                                <button
                                                    onClick={() => handleEliminarPedido(venta.id)}
                                                    disabled={eliminando}
                                                    className="px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300"
                                                    style={{
                                                        background: 'rgba(255, 0, 0, 0.1)',
                                                        border: '1px solid rgba(255, 0, 0, 0.3)',
                                                        color: '#ff4444',
                                                        opacity: eliminando ? 0.5 : 1,
                                                        cursor: eliminando ? 'not-allowed' : 'pointer'
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4 inline mr-1" />
                                                    {eliminando ? '...' : 'Eliminar'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
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
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2"
                        style={{
                            fontFamily: "'Orbitron', monospace",
                            color: '#00f0ff',
                            textShadow: '0 0 30px rgba(0, 240, 255, 0.3)'
                        }}
                    >
                        <ShoppingCart className="w-6 h-6" />
                        CARRITO DE COMPRAS
                        {carritoArray.length > 0 && (
                            <span className="text-sm font-normal ml-2" style={{ color: '#8a8aaa' }}>
                                ({carritoArray.length} productos)
                            </span>
                        )}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-full transition-all duration-300"
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: '#8a8aaa'
                        }}
                    >
                        <XCircle className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    {carritoArray.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-4 p-4 rounded-xl"
                            style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.05)'
                            }}
                        >
                            <img
                                src={item.imagenUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300'}
                                alt={item.nombre}
                                className="w-20 h-20 object-cover rounded-xl"
                            />
                            <div className="flex-1">
                                <h3 className="font-medium" style={{ color: '#e8e8ff' }}>
                                    {item.nombre}
                                </h3>
                                <p className="text-sm" style={{ color: '#00f0ff' }}>
                                    ${item.precio?.toFixed(2) || '0.00'}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => updateQuantity(item.id, (item.cantidad || 1) - 1)}
                                    className="p-1 rounded-xl transition-all duration-300"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        color: '#8a8aaa'
                                    }}
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span style={{ color: '#c8c8e8' }}>{item.cantidad || 1}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, (item.cantidad || 1) + 1)}
                                    className="p-1 rounded-xl transition-all duration-300"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        color: '#8a8aaa'
                                    }}
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="p-2 rounded-xl transition-all duration-300"
                                style={{
                                    color: '#ff00c8',
                                    background: 'rgba(255, 0, 200, 0.05)',
                                    border: '1px solid rgba(255, 0, 200, 0.1)'
                                }}
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t"
                    style={{ borderColor: 'rgba(0, 240, 255, 0.1)' }}
                >
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-bold" style={{ color: '#c8c8e8' }}>
                            Total:
                        </span>
                        <span className="text-2xl font-bold"
                            style={{
                                fontFamily: "'Orbitron', monospace",
                                color: '#00f0ff',
                                textShadow: '0 0 30px rgba(0, 240, 255, 0.3)'
                            }}
                        >
                            ${total.toFixed(2)}
                        </span>
                    </div>

                    <button
                        onClick={() => {
                            if (setVistaActual) {
                                setVistaActual('checkout');
                            }
                            if (setMostrarCarrito) {
                                setMostrarCarrito(false);
                            }
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300"
                        style={{
                            background: 'linear-gradient(135deg, #00f0ff, #00a8cc)',
                            border: '1px solid #00f0ff',
                            color: '#fff',
                            boxShadow: '0 0 30px rgba(0, 240, 255, 0.3)'
                        }}
                    >
                        <CreditCard className="w-4 h-4" />
                        Pagar Ahora
                    </button>
                </div>
            </div>
        </div>
    );
};
