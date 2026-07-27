import React, { useState } from 'react';
import { apiService } from '../services/apiService';
import { LogIn, Mail, Lock, AlertCircle, CheckCircle, Shield } from 'lucide-react';

export const Login = ({ onLoginSuccess, onGoToRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const data = await apiService.login(username, password);
            setSuccess('Inicio de sesion exitoso!');
            onLoginSuccess(data);
        } catch (err) {
            setError(err.message || 'Credenciales incorrectas. Verifica tu correo o contraseña.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg w-full mx-auto my-12 rounded-2xl overflow-hidden border"
            style={{
                background: 'rgba(0, 0, 0, 0.85)',
                borderColor: 'rgba(0, 240, 255, 0.2)',
                boxShadow: '0 0 60px rgba(0, 240, 255, 0.05), inset 0 0 60px rgba(0, 240, 255, 0.02)',
                backdropFilter: 'blur(20px)'
            }}
        >
            {/* Header */}
            <div className="px-8 py-8 text-center relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.08), rgba(180, 0, 255, 0.08))',
                    borderBottom: '1px solid rgba(0, 240, 255, 0.15)'
                }}
            >
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full"
                    style={{ background: 'rgba(0, 240, 255, 0.03)' }}
                />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full"
                    style={{ background: 'rgba(255, 0, 200, 0.03)' }}
                />
                <div className="relative z-10 flex flex-col items-center">
                    <div className="p-4 rounded-full mb-4"
                        style={{
                            background: 'rgba(0, 240, 255, 0.05)',
                            border: '2px solid #00f0ff',
                            boxShadow: '0 0 40px rgba(0, 240, 255, 0.15)'
                        }}
                    >
                        <LogIn className="w-8 h-8" style={{ color: '#00f0ff' }} />
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight"
                        style={{
                            fontFamily: "'Orbitron', monospace",
                            color: '#00f0ff',
                            textShadow: '0 0 30px rgba(0, 240, 255, 0.3)',
                            letterSpacing: '1px'
                        }}
                    >
                        Bienvenido de nuevo
                    </h1>
                    <p className="mt-1 text-sm"
                        style={{
                            fontFamily: "'Rajdhani', sans-serif",
                            color: '#8a8aaa',
                            letterSpacing: '1px'
                        }}
                    >
                        Ingresa a tu cuenta de Alixxpres
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
                {error && (
                    <div className="p-4 rounded-xl flex items-start gap-2.5 border"
                        style={{
                            background: 'rgba(255, 0, 200, 0.05)',
                            borderColor: 'rgba(255, 0, 200, 0.2)',
                            color: '#ff00c8'
                        }}
                    >
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#ff00c8' }} />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="p-4 rounded-xl flex items-start gap-2.5 border"
                        style={{
                            background: 'rgba(0, 255, 65, 0.05)',
                            borderColor: 'rgba(0, 255, 65, 0.2)',
                            color: '#00ff41'
                        }}
                    >
                        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#00ff41' }} />
                        <span>{success}</span>
                    </div>
                )}

                <div>
                    <label htmlFor="username" className="block text-sm font-semibold mb-1.5"
                        style={{
                            fontFamily: "'Rajdhani', sans-serif",
                            color: '#c8c8e8',
                            letterSpacing: '0.5px'
                        }}
                    >
                        Correo electronico
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#6b6380' }} />
                        <input
                            id="username"
                            type="email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="ejemplo@correo.com"
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all"
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
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-semibold mb-1.5"
                        style={{
                            fontFamily: "'Rajdhani', sans-serif",
                            color: '#c8c8e8',
                            letterSpacing: '0.5px'
                        }}
                    >
                        Contraseña
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#6b6380' }} />
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="********"
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all"
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
                        />
                    </div>
                </div>

                <div className="flex items-start gap-2 text-xs rounded-lg px-4 py-3"
                    style={{
                        background: 'rgba(0, 240, 255, 0.03)',
                        border: '1px solid rgba(0, 240, 255, 0.08)',
                        color: '#6b6380'
                    }}
                >
                    <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#00f0ff' }} />
                    <span>Tus datos de acceso estan encriptados de extremo a extremo.</span>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-300 ${
                        loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'
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
                    <LogIn className="w-5 h-5" />
                    {loading ? 'Iniciando sesion...' : 'Iniciar sesion'}
                </button>

                <p className="text-center text-sm pt-1" style={{ color: '#6b6380' }}>
                    ¿No tienes una cuenta?{' '}
                    <button
                        type="button"
                        onClick={onGoToRegister}
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
                        Registrate aqui
                    </button>
                </p>
            </form>
        </div>
    );
};

export default Login;