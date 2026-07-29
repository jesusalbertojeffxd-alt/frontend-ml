import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { User, ShoppingBag, Calendar, LogOut, UserCircle } from 'lucide-react';

export const Perfil = ({ usuario, setVistaActual }) => {
    const [compras, setCompras] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarCompras = async () => {
            try {
                const data = await apiService.getMyPurchases();
                setCompras(data || []);
            } catch (err) {
                console.error('Error al cargar compras:', err);
            } finally {
                setLoading(false);
            }
        };
        if (usuario) cargarCompras();
    }, [usuario]);

    const handleLogout = () => {
        apiService.logout();
        setVistaActual('catalogo');
        window.location.reload();
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header del Perfil */}
            <div className="bg-[#0a0c1a]/80 rounded-2xl p-8 mb-8 border border-[#00f0ff]/20">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-[#00f0ff]/10 border-2 border-[#00f0ff] flex items-center justify-center">
                        <User className="w-12 h-12 text-[#00f0ff]" />
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-2xl font-bold text-white font-['Orbitron']">{usuario?.nombre}</h1>
                        <p className="text-[#8a8aaa]">@{usuario?.username}</p>
                        <span className={`text-xs px-3 py-1 rounded-full ${
                            usuario?.rol === 'ROLE_ADMIN' ? 'bg-[#ff00c8]/20 text-[#ff00c8]' : 'bg-[#00f0ff]/20 text-[#00f0ff]'
                        }`}>
                            {usuario?.rol === 'ROLE_ADMIN' ? 'Administrador' : 'Cliente'}
                        </span>
                    </div>
                    <div className="md:ml-auto flex gap-3">
                        <button
                            onClick={() => setVistaActual('catalogo')}
                            className="px-4 py-2 bg-[#1a1a2e] text-[#8a8aaa] rounded-xl hover:text-white transition-all"
                        >
                            Volver al Catálogo
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-all flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>

            {/* Historial de Compras */}
            <div className="bg-[#0a0c1a]/80 rounded-2xl p-6 border border-[#1a1a2e]">
                <h2 className="text-lg font-bold text-white font-['Orbitron'] flex items-center gap-2 mb-6">
                    <ShoppingBag className="w-5 h-5 text-[#00f0ff]" />
                    Mi Historial de Compras
                </h2>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00f0ff]"></div>
                    </div>
                ) : compras.length === 0 ? (
                    <div className="text-center py-12 text-[#8a8aaa]">
                        <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p>No has realizado compras aún.</p>
                        <button
                            onClick={() => setVistaActual('catalogo')}
                            className="mt-4 px-6 py-2 bg-[#00f0ff] text-black rounded-xl font-bold hover:bg-[#00f0ff]/80 transition-all"
                        >
                            Ir al Catálogo
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {compras.map((compra) => (
                            <div key={compra.id} className="bg-[#1a1a2e] p-4 rounded-xl border border-[#2a2a3e] hover:border-[#00f0ff]/30 transition-all">
                                <div className="flex flex-wrap justify-between items-start gap-4">
                                    <div>
                                        <p className="text-sm text-[#8a8aaa] flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(compra.fecha).toLocaleDateString()}
                                        </p>
                                        <p className="text-white font-bold">Venta #{compra.id}</p>
                                        <p className="text-sm text-[#8a8aaa]">{compra.detalles?.length || 0} productos</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-[#00f0ff] font-['Orbitron']">
                                            ${compra.total?.toFixed(2)}
                                        </p>
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                            compra.estadoPago === 'Pagado' ? 'bg-[#00ff41]/20 text-[#00ff41]' : 'bg-[#ffe600]/20 text-[#ffe600]'
                                        }`}>
                                            {compra.estadoPago || 'Pendiente'}
                                        </span>
                                    </div>
                                </div>
                                {compra.detalles && compra.detalles.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-[#2a2a3e]">
                                        {compra.detalles.map((detalle, idx) => (
                                            <div key={idx} className="flex justify-between text-sm text-[#8a8aaa]">
                                                <span>{detalle.producto?.nombre || 'Producto'}</span>
                                                <span>x{detalle.cantidad}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
