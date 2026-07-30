import { useEffect, useState } from 'react';
import Footer from './components/Footer';
import { Catalogo } from './components/Catalogo';
import { Registro } from './components/Registro';
import { Login } from './components/Login';
import { apiService } from './services/apiService';
import { Navbar } from './components/Navbar';
import { AdminDashboard } from './components/AdminDashboard';
import { Cart } from './components/Cart';
import { Perfil } from './components/Perfil';
import { CheckoutForm } from './components/CheckoutForm';
import Compras from './components/Compras';

function App() {
    const [vistaActual, setVistaActual] = useState('catalogo');
    const [usuario, setUsuario] = useState(null);
    const [carrito, setCarrito] = useState([]);
    const [mostrarCarrito, setMostrarCarrito] = useState(false);
    const [ventaActiva, setVentaActiva] = useState(null);

    // ============ CARGAR DATOS GUARDADOS ============
    useEffect(() => {
        // Cargar usuario
        if (apiService.isAuthenticated()) {
            setUsuario({
                username: localStorage.getItem('username'),
                nombre: localStorage.getItem('nombre'),
                rol: localStorage.getItem('rol') 
            });
        }
        
        // Cargar carrito desde localStorage
        const carritoGuardado = localStorage.getItem('carrito');
        if (carritoGuardado) {
            try {
                const carrito = JSON.parse(carritoGuardado);
                setCarrito(carrito);
                console.log('Carrito cargado:', carrito.length, 'productos');
            } catch (e) {
                console.error('Error al cargar carrito:', e);
            }
        }
    }, []);

    // Guardar carrito en localStorage cuando cambie
    useEffect(() => {
        localStorage.setItem('carrito', JSON.stringify(carrito));
        console.log('Carrito guardado:', carrito.length, 'productos');
    }, [carrito]);

    const handleLoginSuccess = (userData) => {
        setUsuario({
            username: userData.username,
            nombre: userData.nombre,
            rol: userData.rol
        });
        if (userData.rol === 'ROLE_ADMIN') {
            setVistaActual('admin-panel');
        } else {
            setVistaActual('catalogo');
        }
    };

    const handleLogout = () => {
        apiService.logout();
        setUsuario(null);
        setCarrito([]);
        setVentaActiva(null);
        setVistaActual('catalogo');
        localStorage.removeItem('carrito');
    };

    // ============ CARRITO ============
    const addToCart = (producto) => {
        if (!usuario) {
            alert('Debes iniciar sesion para comprar');
            setVistaActual('login');
            return;
        }
        if (usuario.rol === 'ROLE_ADMIN') {
            alert('Los administradores no pueden comprar productos');
            return;
        }
        
        const existingItem = carrito.find(item => item.id === producto.id);
        if (existingItem) {
            if (existingItem.cantidad >= producto.stock) {
                alert("No se puede añadir mas stock de " + producto.nombre + 
                      ". Inventario disponible: " + producto.stock);
                return;
            }
            setCarrito(carrito.map(item => 
                item.id === producto.id ? 
                { ...item, cantidad: item.cantidad + 1 } : 
                item
            ));
        } else {
            setCarrito([...carrito, { ...producto, cantidad: 1 }]);
        }
        
        setMostrarCarrito(true);
    };

    const updateQuantity = (productoId, nuevaCantidad) => {
        if (nuevaCantidad <= 0) {
            removeFromCart(productoId);
            return;
        }
        setCarrito((prevCart) =>
            prevCart.map((item) => {
                if (item.id === productoId) {
                    if (nuevaCantidad > (item.stock || 999)) {
                        alert("No se puede exceder el stock disponible: " + (item.stock || 0));
                        return item;
                    }
                    return {...item, cantidad: nuevaCantidad};
                }
                return item;
            })
        );
    };

    const removeFromCart = (productoId) => {
        setCarrito(prevCart => prevCart.filter((item) => item.id !== productoId));
    };

    const clearCart = () => {
        setCarrito([]);
        localStorage.removeItem('carrito');
    };

    // ============ VISTAS ============
    const vistaContenido = () => {
        switch (vistaActual) {
            case 'catalogo':
                return <Catalogo 
                    setVistaActual={setVistaActual} 
                    usuario={usuario}
                    addToCart={addToCart}
                />;

            case 'admin-panel':
                return <AdminDashboard 
                    setVistaActual={setVistaActual} 
                    usuario={usuario}
                />;

            case 'register':
                return (
                    <Registro
                        onRegistroSuccess={() => setVistaActual('login')}
                        onGoToLogin={() => setVistaActual('login')}
                    />
                );
            case 'login':
                return (
                    <Login
                        onLoginSuccess={handleLoginSuccess}
                        onGoToRegister={() => setVistaActual('register')}
                    />
                );
            case 'perfil':
                return <Perfil 
                    usuario={usuario} 
                    setVistaActual={setVistaActual} 
                    setUsuario={setUsuario}
                />;

            case 'compras':
                return <Compras 
                    usuario={usuario}
                    setVistaActual={setVistaActual}
                />;

            case 'cart':
                return <Cart 
                    carrito={carrito}
                    setCarrito={setCarrito}
                    usuario={usuario}
                    setVistaActual={setVistaActual}
                    setMostrarCarrito={setMostrarCarrito}
                />;

            case 'checkout':
                return <CheckoutForm 
                    carrito={carrito}
                    total={carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)}
                    usuario={usuario}
                    cliente={null}
                    onConfirmar={(data) => {
                        console.log('Pago confirmado:', data);
                        setVistaActual('catalogo');
                        setCarrito([]);
                    }}
                    onCancelar={() => {
                        console.log('Pago cancelado');
                        setVistaActual('catalogo');
                    }}
                    setVistaActual={setVistaActual}
                />;

            default:
                return <Catalogo 
                    setVistaActual={setVistaActual}
                    usuario={usuario}
                    addToCart={addToCart}
                />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col"
            style={{
                background: 'linear-gradient(135deg, #0a0c1a, #141830)',
                color: '#e8e8ff'
            }}
        >
            <Navbar
                usuario={usuario}
                setUsuario={setUsuario}
                setVistaActual={setVistaActual}
                vistaActual={vistaActual}
                carrito={carrito}
                setCarrito={setCarrito}
                setMostrarCarrito={setMostrarCarrito}
            />

            <main className="flex-grow pb-12">
                {vistaContenido()}
            </main>
            
            {mostrarCarrito && (
                <div className="fixed inset-0 z-50 flex items-center justify-center"
                    style={{
                        background: 'rgba(0, 0, 0, 0.8)',
                        backdropFilter: 'blur(4px)'
                    }}
                    onClick={() => setMostrarCarrito(false)}
                >
                    <div className="max-w-4xl w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Cart 
                            carrito={carrito}
                            setCarrito={setCarrito}
                            usuario={usuario}
                            setVistaActual={setVistaActual}
                            setMostrarCarrito={setMostrarCarrito}
                        />
                    </div>
                </div>
            )}
            
            <Footer />
        </div>
    );
}

export default App;
