import React, {useState} from "react";
import { apiService } from "../services/apiService";
import {UserPlus, User, Mail, Lock, Phone, MapPin, Shield, AlertCircle, CheckCircle, XCircle} from 'lucide-react';

export const Registro = ({onRegistroSuccess, onGoToLogin}) => {

    const [nombre, setNombre] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [rol, setRol] = useState('ROLE_CLIENTE');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (e) => {

        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            setLoading(false);
            return;
        }
        
        if (rol === 'ROLE_CLIENTE') {
            if (!telefono.trim()) {
                setError('El teléfono es obligatorio para clientes');
                setLoading(false);
                return;
            }
            if (!direccion.trim()) {
                setError('La dirección es obligatoria para clientes');
                setLoading(false);
                return;
            }
        }
        
        const payload = {
            username,
            password,
            nombre,
            rol,
            direccion: rol === 'ROLE_CLIENTE' ? direccion : null,
            telefono: rol === 'ROLE_CLIENTE' ? telefono : null,
        };
        
        try {
            await apiService.registro(payload);
            setSuccess('¡Registro Completado con éxito! Redirigiéndote al inicio de sesión....');
            setTimeout(() => {
                if (onRegistroSuccess) {
                    onRegistroSuccess();
                }
            }, 2000);
        } catch (err) {
            setError(err.message || 'Error al completar el registro. Intenta con otro correo..');
        } finally {
            setLoading(false);
        }
    };
        
    return(
        <div className="max-w-lg w-full mx-auto my-12 rounded-2xl overflow-hidden border"
            style={{
                background: 'rgba(0, 0, 0, 0.85)',
                borderColor: 'rgba(0, 240, 255, 0.2)',
                boxShadow: '0 0 60px rgba(0, 240, 255, 0.05), inset 0 0 60px rgba(0, 240, 255, 0.02)',
                backdropFilter: 'blur(20px)'
            }}
        >
            {/* Header */}
            <div className="px-6 py-6"
                style={{
                    background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.08), rgba(180, 0, 255, 0.08))',
                    borderBottom: '1px solid rgba(0, 240, 255, 0.15)'
                }}
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full"
                        style={{
                            background: 'rgba(0, 240, 255, 0.1)',
                            border: '1px solid rgba(0, 240, 255, 0.2)'
                        }}
                    >
                        <UserPlus size={24} style={{ color: '#00f0ff' }} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold"
                            style={{
                                fontFamily: "'Orbitron', monospace",
                                color: '#00f0ff',
                                textShadow: '0 0 30px rgba(0, 240, 255, 0.3)',
                                letterSpacing: '1px'
                            }}
                        >
                            Crear Cuenta
                        </h2>
                        <p className="text-sm mt-0.5" style={{ color: '#8a8aaa' }}>
                            Registrate para comenzar a comprar
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-6">
                {success && (
                    <div className="flex items-center gap-2 p-3 rounded-lg mb-4 border"
                        style={{
                            background: 'rgba(0, 255, 65, 0.05)',
                            borderColor: 'rgba(0, 255, 65, 0.2)',
                            color: '#00ff41'
                        }}
                    >
                        <CheckCircle size={18} className="flex-shrink-0" />
                        <span className="text-sm">{success}</span>
                    </div>
                )}

                {error && (
                    <div className="flex items-center gap-2 p-3 rounded-lg mb-4 border"
                        style={{
                            background: 'rgba(255, 0, 200, 0.05)',
                            borderColor: 'rgba(255, 0, 200, 0.2)',
                            color: '#ff00c8'
                        }}
                    >
                        <AlertCircle size={18} className="flex-shrink-0" />
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                {/* Nombre */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1"
                        style={{
                            fontFamily: "'Rajdhani', sans-serif",
                            color: '#c8c8e8',
                            letterSpacing: '0.5px'
                        }}
                    >
                        <User size={16} className="inline mr-1" />
                        Nombre completo
                        <span className="ml-1" style={{ color: '#ff00c8' }}>*</span>
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: '#6b6380' }} />
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej: Juan Perez"
                            className="w-full pl-10 pr-3 py-2 rounded-lg outline-none transition"
                            style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(0, 240, 255, 0.12)',
                                color: '#e0e0ff'
                            }}
                            onFocus={(e) => {
                                e.target.style.boxShadow = '0 0 30px rgba(0, 240, 255, 0.05)';
                                e.target.style.borderColor = '#00f0ff';
                            }}
                            onBlur={(e) => {
                                e.target.style.boxShadow = 'none';
                                e.target.style.borderColor = 'rgba(0, 240, 255, 0.12)';
                            }}
                            required
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1"
                        style={{
                            fontFamily: "'Rajdhani', sans-serif",
                            color: '#c8c8e8',
                            letterSpacing: '0.5px'
                        }}
                    >
                        <Mail size={16} className="inline mr-1" />
                        Correo electronico
                        <span className="ml-1" style={{ color: '#ff00c8' }}>*</span>
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: '#6b6380' }} />
                        <input
                            type="email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Ej: juan@email.com"
                            className="w-full pl-10 pr-3 py-2 rounded-lg outline-none transition"
                            style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(0, 240, 255, 0.12)',
                                color: '#e0e0ff'
                            }}
                            onFocus={(e) => {
                                e.target.style.boxShadow = '0 0 30px rgba(0, 240, 255, 0.05)';
                                e.target.style.borderColor = '#00f0ff';
                            }}
                            onBlur={(e) => {
                                e.target.style.boxShadow = 'none';
                                e.target.style.borderColor = 'rgba(0, 240, 255, 0.12)';
                            }}
                            required
                        />
                    </div>
                </div>

                {/* Contraseña */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1"
                        style={{
                            fontFamily: "'Rajdhani', sans-serif",
                            color: '#c8c8e8',
                            letterSpacing: '0.5px'
                        }}
                    >
                        <Lock size={16} className="inline mr-1" />
                        Contraseña
                        <span className="ml-1" style={{ color: '#ff00c8' }}>*</span>
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: '#6b6380' }} />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Minimo 6 caracteres"
                            className="w-full pl-10 pr-3 py-2 rounded-lg outline-none transition"
                            style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 0, 200, 0.12)',
                                color: '#e0e0ff'
                            }}
                            onFocus={(e) => {
                                e.target.style.boxShadow = '0 0 30px rgba(255, 0, 200, 0.05)';
                                e.target.style.borderColor = '#ff00c8';
                            }}
                            onBlur={(e) => {
                                e.target.style.boxShadow = 'none';
                                e.target.style.borderColor = 'rgba(255, 0, 200, 0.12)';
                            }}
                            required
                            minLength="6"
                        />
                    </div>
                </div>

                {/* Confirmar Contraseña */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1"
                        style={{
                            fontFamily: "'Rajdhani', sans-serif",
                            color: '#c8c8e8',
                            letterSpacing: '0.5px'
                        }}
                    >
                        <Lock size={16} className="inline mr-1" />
                        Confirmar contraseña
                        <span className="ml-1" style={{ color: '#ff00c8' }}>*</span>
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: '#6b6380' }} />
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repite tu contraseña"
                            className="w-full pl-10 pr-3 py-2 rounded-lg outline-none transition"
                            style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 0, 200, 0.12)',
                                color: '#e0e0ff'
                            }}
                            onFocus={(e) => {
                                e.target.style.boxShadow = '0 0 30px rgba(255, 0, 200, 0.05)';
                                e.target.style.borderColor = '#ff00c8';
                            }}
                            onBlur={(e) => {
                                e.target.style.boxShadow = 'none';
                                e.target.style.borderColor = 'rgba(255, 0, 200, 0.12)';
                            }}
                            required
                        />
                    </div>
                </div>

                {/* Datos del Cliente */}
                {rol === 'ROLE_CLIENTE' && (
                    <div className="mb-4 p-4 rounded-lg border"
                        style={{
                            background: 'rgba(0, 240, 255, 0.03)',
                            borderColor: 'rgba(0, 240, 255, 0.1)'
                        }}
                    >
                        <p className="text-sm font-medium mb-3 flex items-center gap-2"
                            style={{
                                fontFamily: "'Orbitron', monospace",
                                color: '#00f0ff',
                                letterSpacing: '1px',
                                textShadow: '0 0 20px rgba(0, 240, 255, 0.2)'
                            }}
                        >
                            <User size={16} />
                            Datos del cliente
                        </p>
                        
                        <div className="mb-3">
                            <label className="block text-sm font-medium mb-1"
                                style={{
                                    fontFamily: "'Rajdhani', sans-serif",
                                    color: '#c8c8e8',
                                    letterSpacing: '0.5px'
                                }}
                            >
                                <Phone size={16} className="inline mr-1" />
                                Telefono
                                <span className="ml-1" style={{ color: '#ff00c8' }}>*</span>
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: '#6b6380' }} />
                                <input
                                    type="tel"
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                    placeholder="Ej: 555-123-4567"
                                    className="w-full pl-10 pr-3 py-2 rounded-lg outline-none transition"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(0, 240, 255, 0.12)',
                                        color: '#e0e0ff'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.boxShadow = '0 0 30px rgba(0, 240, 255, 0.05)';
                                        e.target.style.borderColor = '#00f0ff';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.boxShadow = 'none';
                                        e.target.style.borderColor = 'rgba(0, 240, 255, 0.12)';
                                    }}
                                    required={rol === 'ROLE_CLIENTE'}
                                />
                            </div>
                        </div>

                        <div className="mb-1">
                            <label className="block text-sm font-medium mb-1"
                                style={{
                                    fontFamily: "'Rajdhani', sans-serif",
                                    color: '#c8c8e8',
                                    letterSpacing: '0.5px'
                                }}
                            >
                                <MapPin size={16} className="inline mr-1" />
                                Direccion
                                <span className="ml-1" style={{ color: '#ff00c8' }}>*</span>
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: '#6b6380' }} />
                                <input
                                    type="text"
                                    value={direccion}
                                    onChange={(e) => setDireccion(e.target.value)}
                                    placeholder="Ej: Calle Principal #123, Ciudad"
                                    className="w-full pl-10 pr-3 py-2 rounded-lg outline-none transition"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(0, 240, 255, 0.12)',
                                        color: '#e0e0ff'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.boxShadow = '0 0 30px rgba(0, 240, 255, 0.05)';
                                        e.target.style.borderColor = '#00f0ff';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.boxShadow = 'none';
                                        e.target.style.borderColor = 'rgba(0, 240, 255, 0.12)';
                                    }}
                                    required={rol === 'ROLE_CLIENTE'}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Rol */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1"
                        style={{
                            fontFamily: "'Rajdhani', sans-serif",
                            color: '#c8c8e8',
                            letterSpacing: '0.5px'
                        }}
                    >
                        <Shield size={16} className="inline mr-1" />
                        Rol
                    </label>
                    <div className="relative">
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: '#6b6380' }} />
                        <select
                            value={rol}
                            onChange={(e) => setRol(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 rounded-lg outline-none transition appearance-none"
                            style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(180, 0, 255, 0.12)',
                                color: '#e0e0ff'
                            }}
                            onFocus={(e) => {
                                e.target.style.boxShadow = '0 0 30px rgba(180, 0, 255, 0.05)';
                                e.target.style.borderColor = '#b400ff';
                            }}
                            onBlur={(e) => {
                                e.target.style.boxShadow = 'none';
                                e.target.style.borderColor = 'rgba(180, 0, 255, 0.12)';
                            }}
                        >
                            <option value="ROLE_CLIENTE" style={{ background: '#0a0a12', color: '#c8c8e8' }}>Cliente</option>
                            <option value="ROLE_ADMIN" style={{ background: '#0a0a12', color: '#c8c8e8' }}>Administrador</option>
                            <option value="ROLE_VENDEDOR" style={{ background: '#0a0a12', color: '#c8c8e8' }}>Vendedor</option>
                        </select>
                    </div>
                </div>

                {/* Botón Ir a Login */}
                <button
                    type="button"
                    onClick={onGoToLogin}
                    className="w-full mb-3 py-2.5 px-4 font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02]"
                    style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        color: '#8a8aaa',
                        fontFamily: "'Rajdhani', sans-serif",
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(0, 240, 255, 0.05)';
                        e.target.style.borderColor = '#00f0ff';
                        e.target.style.color = '#00f0ff';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                        e.target.style.color = '#8a8aaa';
                    }}
                >
                    <User size={18} />
                    Ir a Iniciar Sesion
                </button>

                {/* Botón Registrarse */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2.5 px-4 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                        loading 
                            ? 'opacity-70 cursor-not-allowed' 
                            : 'hover:scale-[1.02]'
                    }`}
                    style={{
                        background: loading 
                            ? 'rgba(255, 255, 255, 0.05)' 
                            : 'linear-gradient(135deg, #00f0ff, #b400ff)',
                        border: 'none',
                        boxShadow: loading ? 'none' : '0 0 40px rgba(0, 240, 255, 0.15)',
                        fontFamily: "'Orbitron', monospace",
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
                    }}
                    onMouseEnter={(e) => {
                        if (!loading) {
                            e.target.style.boxShadow = '0 0 60px rgba(255, 0, 200, 0.2)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!loading) {
                            e.target.style.boxShadow = '0 0 40px rgba(0, 240, 255, 0.15)';
                        }
                    }}
                >
                    {loading ? (
                        <>
                            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Registrando...
                        </>
                    ) : (
                        <>
                            <UserPlus size={18} />
                            Registrarse
                        </>
                    )}
                </button>

                <div className="text-center text-sm mt-4" style={{ color: '#6b6380' }}>
                    ¿Ya tienes cuenta?{' '}
                    <button
                        type="button"
                        onClick={onGoToLogin}
                        className="font-semibold transition-all duration-300"
                        style={{
                            color: '#00f0ff',
                            textShadow: '0 0 20px rgba(0, 240, 255, 0.2)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.color = '#ff00c8';
                            e.target.style.textShadow = '0 0 20px rgba(255, 0, 200, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.color = '#00f0ff';
                            e.target.style.textShadow = '0 0 20px rgba(0, 240, 255, 0.2)';
                        }}
                    >
                        Inicia sesion aqui
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Registro;