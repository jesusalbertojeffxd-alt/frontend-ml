import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, XCircle } from 'lucide-react';
import { apiService } from '../services/apiService';

export const Cart = ({ 
    isOpen, 
    onClose, 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    setVistaActual,
    setVentaActiva,
    usuario
}) => {
    const [procesandoPago, setProcesandoPago] = useState(false);
    const [errorPago, setErrorPago] = useState('');

    const total = cart.reduce((sum, item) => sum + (item.precio * (item.cantidad || 1)), 0);

    if (!isOpen) return null;

    const handlePagar = async () => {
        if (!usuario) {
            alert('Debes iniciar sesión para comprar');
            setVistaActual('login');
            return;
        }

        if (cart.length === 0) {
            alert('No hay productos en el carrito');
            return;
        }

        setProcesandoPago(true);
        setErrorPago('');

        try {
            // Crear la venta
            const ventaData = {
                items: cart.map(item => ({
                    productoId: item.id,
                    cantidad: item.cantidad || 1,
                    precio: item.precio
                })),
                total: total,
                metodoPago: 'tarjeta'
            };

            console.log('Creando venta:', ventaData);
            const response = await apiService.crearVenta(ventaData);
            console.log('Venta creada:', response);

            if (response && response.id) {
                // Crear intención de pago
                const pagoResponse = await apiService.crearIntencionPago(response.id);
                console.log('Intención de pago:', pagoResponse);

                if (pagoResponse && pagoResponse.url) {
                    // Redirigir a Stripe
                    window.location.href = pagoResponse.url;
                } else if (pagoResponse && pagoResponse.clientSecret) {
                    // Si tienes Stripe Elements, usarlo
                    setVentaActiva(response);
                    setVistaActual('checkout');
                    onClose();
                } else {
                    setErrorPago('Error al procesar el pago');
                    setProcesandoPago(false);
                }
            } else {
                setErrorPago('Error al crear la venta');
                setProcesandoPago(false);
            }
        } catch (error) {
            console.error('Error en el pago:', error);
            setErrorPago(error.message || 'Error al procesar el pago');
            setProcesandoPago(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(4px)'
            }}
            onClick={onClose}
        >
            <div className="max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="rounded-2xl p-6"
                    style={{
                        background: 'rgba(15, 18, 30, 0.95)',
                        border: '1px solid rgba(0, 240, 255, 0.3)',
                        boxShadow: '0 0 60px rgba(0, 240, 255, 0.08)'
                    }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold"
                            style={{
                                fontFamily: "'Orbitron', monospace",
                                color: '#00f0ff',
                                textShadow: '0 0 30px rgba(0, 240, 255, 0.3)'
                            }}
                        >
                            🛒 CARRITO
                            {cart.length > 0 && (
                                <span className="text-sm font-normal ml-2" style={{ color: '#8a8aaa' }}>
                                    ({cart.length} productos)
                                </span>
                            )}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full transition-all duration-300"
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
                    </div>

                    {cart.length === 0 ? (
                        <div className="text-center py-12">
                            <ShoppingCart className="w-24 h-24 mx-auto mb-4" style={{ color: '#8a8aaa' }} />
                            <p className="text-lg" style={{ color: '#8a8aaa' }}>Tu carrito está vacío</p>
                            <button
                                onClick={onClose}
                                className="mt-4 px-6 py-2 rounded-xl text-sm font-bold"
                                style={{
                                    background: 'rgba(0, 240, 255, 0.1)',
                                    border: '1px solid rgba(0, 240, 255, 0.2)',
                                    color: '#00f0ff'
                                }}
                            >
                                Seguir comprando
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-3">
                                {cart.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 p-3 rounded-xl"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.03)',
                                            border: '1px solid rgba(255, 255, 255, 0.05)'
                                        }}
                                    >
                                        <img
                                            src={item.imagenUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300'}
                                            alt={item.nombre}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-medium text-sm" style={{ color: '#e8e8ff' }}>
                                                {item.nombre}
                                            </h3>
                                            <p className="text-sm font-bold" style={{ color: '#00f0ff' }}>
                                                ${item.precio?.toFixed(2) || '0.00'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, (item.cantidad || 1) - 1)}
                                                className="p-1 rounded-lg transition-all duration-300"
                                                style={{
                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    color: '#8a8aaa'
                                                }}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span style={{ color: '#c8c8e8', width: '20px', textAlign: 'center' }}>{item.cantidad || 1}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, (item.cantidad || 1) + 1)}
                                                className="p-1 rounded-lg transition-all duration-300"
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
                                            className="p-2 rounded-lg transition-all duration-300"
                                            style={{
                                                color: '#ff4444',
                                                background: 'rgba(255, 0, 0, 0.05)',
                                                border: '1px solid rgba(255, 0, 0, 0.1)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = 'rgba(255, 0, 0, 0.1)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = 'rgba(255, 0, 0, 0.05)';
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {errorPago && (
                                <div className="mt-4 p-3 rounded-xl text-sm"
                                    style={{
                                        background: 'rgba(255, 0, 0, 0.1)',
                                        border: '1px solid rgba(255, 0, 0, 0.2)',
                                        color: '#ff4444'
                                    }}
                                >
                                    ❌ {errorPago}
                                </div>
                            )}

                            <div className="mt-6 pt-4 border-t"
                                style={{ borderColor: 'rgba(0, 240, 255, 0.1)' }}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-lg font-bold" style={{ color: '#c8c8e8' }}>
                                        TOTAL:
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
                                    onClick={handlePagar}
                                    disabled={procesandoPago}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300"
                                    style={{
                                        background: procesandoPago ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #00f0ff, #00a8cc)',
                                        border: '1px solid #00f0ff',
                                        color: procesandoPago ? '#6a6a8a' : '#fff',
                                        boxShadow: procesandoPago ? 'none' : '0 0 30px rgba(0, 240, 255, 0.3)',
                                        cursor: procesandoPago ? 'not-allowed' : 'pointer',
                                        opacity: procesandoPago ? 0.5 : 1
                                    }}
                                >
                                    {procesandoPago ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-transparent" />
                                            Procesando...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-4 h-4" />
                                            PAGAR CON TARJETA
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={clearCart}
                                    className="w-full mt-2 py-2 rounded-xl text-sm font-bold transition-all duration-300"
                                    style={{
                                        background: 'rgba(255, 0, 0, 0.05)',
                                        border: '1px solid rgba(255, 0, 0, 0.1)',
                                        color: '#ff4444'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = 'rgba(255, 0, 0, 0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'rgba(255, 0, 0, 0.05)';
                                    }}
                                >
                                    Vaciar Carrito
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
