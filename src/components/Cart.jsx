import React from 'react';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, XCircle } from 'lucide-react';

export const Cart = ({ 
    isOpen, 
    onClose, 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    setVistaActual,
    usuario
}) => {
    const total = cart.reduce((sum, item) => sum + (item.precio * (item.cantidad || 1)), 0);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(4px)'
            }}
            onClick={onClose}
        >
            <div className="max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
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
                        <h2 className="text-2xl font-bold flex items-center gap-2"
                            style={{
                                fontFamily: "'Orbitron', monospace",
                                color: '#00f0ff',
                                textShadow: '0 0 30px rgba(0, 240, 255, 0.3)'
                            }}
                        >
                            <ShoppingCart className="w-6 h-6" />
                            CARRITO DE COMPRAS
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
                            <div className="space-y-4">
                                {cart.map((item) => (
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
                                            <p className="text-xs" style={{ color: '#8a8aaa' }}>
                                                Stock: {item.stock}
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
                                        setVistaActual('checkout');
                                        onClose();
                                    }}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300"
                                    style={{
                                        background: 'linear-gradient(135deg, #00f0ff, #00a8cc)',
                                        border: '1px solid #00f0ff',
                                        color: '#fff',
                                        boxShadow: '0 0 30px rgba(0, 240, 255, 0.3)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.boxShadow = '0 0 60px rgba(0, 240, 255, 0.5)';
                                        e.target.style.transform = 'scale(1.02)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.boxShadow = '0 0 30px rgba(0, 240, 255, 0.3)';
                                        e.target.style.transform = 'scale(1)';
                                    }}
                                >
                                    <CreditCard className="w-4 h-4" />
                                    Pagar Ahora
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
