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

function App() {
    const [vistaActual, setVistaActual] = useState('catalogo');
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [ventaActiva, setVentaActiva] = useState(null);

    // ============ CARGAR DATOS GUARDADOS ============
    useEffect(() => {
        // Cargar usuario
        if (apiService.isAuthenticated()) {
            setUser({
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
                setCart(carrito);
                console.log('🛒 Carrito cargado:', carrito.length, 'productos');
            } catch (e) {
                console.error('Error al cargar carrito:', e);
            }
        }
    }, []);

    // Guardar carrito en localStorage cuando cambie
    useEffect(() => {
        localStorage.setItem('carrito', JSON.stringify(cart));
        console.log('💾 Carrito guardado:', cart.length, 'productos');
    }, [cart]);

    const handleLoginSuccess = (userData) => {
        setUser({
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
        setUser(null);
        setCart([]);
        setVentaActiva(null);
        setVistaActual('catalogo');
        localStorage.removeItem('carrito');
    };

    // ============ CARRITO ============
    const addToCart = (producto) => {
        if (!user) {
            alert('Debes iniciar sesión para comprar');
            setVistaActual('login');
            return;
        }
        if (user.rol === 'ROLE_ADMIN') {
            alert('Los administradores no pueden comprar productos');
            return;
        }
        setCart((prevCart) => {
            const existing = prevCart.find((item) => item.producto.id === producto.id);
            if (existing) {
                if (existing.cantidad >= producto.stock) {
                    alert("No se puede añadir más stock de " + producto.nombre + 
                          ". Inventario disponible: " + producto.stock);
                    return prevCart;
                }
                return prevCart.map((item) => 
                    item.producto.id === producto.id ? 
                    {...item, cantidad: item.cantidad + 1} : item
                );
            }
            return [...prevCart, {producto: producto, cantidad: 1}];
        });
        setIsCartOpen(true); 
    };

    const updateQuantity = (productoId, nuevaCantidad) => {
        if (nuevaCantidad <= 0) {
            removeFromCart(productoId);
            return;
        }
        setCart((prevCart) =>
            prevCart.map((item) => {
                if (item.producto.id === productoId) {
                    if (nuevaCantidad > item.producto.stock) {
                        alert("No se puede exceder el stock disponible: " + item.producto.stock);
                        return item;
                    }
                    return {...item, cantidad: nuevaCantidad};
                }
                return item;
            })
        );
    };

    const removeFromCart = (productoId) => {
        setCart(prevCart => prevCart.filter((item) => item.producto.id !== productoId));
    };

    const clearCart = () => setCart([]);

    const carCount = cart.reduce((total, item) => total + item.cantidad, 0);

    // ============ VISTAS ============
    const vistaContenido = () => {
        switch (vistaActual) {
            case 'catalogo':
                return <Catalogo 
                    setVistaActual={setVistaActual} 
                    usuario={user}
                    addToCart={addToCart}
                />;

            case 'admin-panel':
                return <AdminDashboard 
                    setVistaActual={setVistaActual} 
                    usuario={user}
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
                return <Perfil usuario={user} setVistaActual={setVistaActual} />;

            case 'checkout':
                return <CheckoutForm 
                    ventaActiva={ventaActiva}
                    setVistaActual={setVistaActual}
                />;

            default:
                return <Catalogo 
                    setVistaActual={setVistaActual}
                    usuario={user}
                    addToCart={addToCart}
                />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 antialiased">
            <Navbar
                vistaActual={vistaActual}
                setVistaActual={setVistaActual}
                user={user}
                onLogout={handleLogout}
                carCount={carCount}
                openCart={() => setIsCartOpen(true)}
            />

            <main className="flex-grow pb-12">
                {vistaContenido()}
            </main>
            
            <Cart 
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cart={cart}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
                clearCart={clearCart}
                setVistaActual={setVistaActual}
                setVentaActiva={setVentaActiva}
                usuario={user}
            />
            
            <Footer />
        </div>
    );
}

export default App;
