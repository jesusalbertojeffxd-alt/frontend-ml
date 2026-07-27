import { useEffect, useState } from 'react';
import Footer from './components/Footer';
import { Catalogo } from './components/Catalogo';
import { Registro } from './components/Registro';
import { Login } from './components/Login';
import { apiService } from './services/apiService';
import { Navbar } from './components/Navbar';
import { AdminDashboard } from './components/AdminDashboard';
import {Cart} from './components/Cart';

function App() {
    const [vistaActual, setVistaActual] = useState('catalogo');
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [ventaActiva, setVentaActiva] = useState(null);
    const [adminSubTab, setAdminSubTab] = useState('productos');

    useEffect(() => {
        if (apiService.isAuthenticated()) {
            setUser({
                username: localStorage.getItem('username'),
                nombre: localStorage.getItem('nombre'),
                rol: localStorage.getItem('rol') 
            });
        }
    }, []);

    const handleLoginSuccess = (userData) => {
        setUser({
            username: userData.username,
            nombre: userData.nombre,
            rol: userData.rol
        });
        if (userData.rol === 'ROLE_ADMIN') { // Cambiado de userData.role a userData.rol
            setVistaActual('admin-dashboard');
        } else {
            setVistaActual('catalogo');
        }
    };

    const handleLogout = () => {
        setUser(null);
        setCart([]);
        setVentaActiva(null);
        setVistaActual('catalogo');
    };

    // Función de carrito de compras - CORREGIDA
    const addToCart = (producto) => {
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

    // Actualizar cantidad - CORREGIDA
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

    // Remover del carrito - CORREGIDA
    const removeFromCart = (productoId) => {
        setCart(prevCart => prevCart.filter((item) => item.producto.id !== productoId));
    };

    // Limpiar carrito
    const clearCart = () => setCart([]);

    // Contar productos en carrito - CORREGIDA
    const cartCount = cart.reduce((sum, item) => sum + item.cantidad, 0);

    // Vista contenido principal
    const vistaContenido = () => {
        switch (vistaActual) {
            case 'catalogo':
                return <Catalogo 
                    setVistaActual={setVistaActual} 
                    usuario={user}
                    addToCart={addToCart}
                />;

            case 'admin-dashboard': // Cambiado de 'admin-panel' a 'admin-dashboard'
                return <AdminDashboard 
                    setVistaActual={setVistaActual} 
                    usuario={user}
                    addToCart={addToCart}
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
            default:
                return <Catalogo 
                    setVistaActual={setVistaActual}
                    usuario={user}
                    addToCart={addToCart}
                />;
        }
    };

    // Ya tienes cartCount arriba, este es redundante pero lo dejamos
    const carCount = cart.reduce((total, item) => total + item.cantidad, 0);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 antialiased">
            <Navbar
                vistaActual={vistaActual} // Cambiado de VistaActual a vistaActual
                setVistaActual={setVistaActual}
                user={user}
                onLogout={handleLogout}
                carCount={carCount}
                openCart={() => setIsCartOpen(true)}
            />

            <main className="flex-grow pb-12">
                {vistaContenido()}
            </main>
            <Cart isOpen={isCartOpen}
            onClose ={()=>setIsCartOpen(false)}
            cart={cart}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
            setVistaActual={setVistaActual}
            setVentaActiva={setVentaActiva}
            />
            <Footer />
        </div>
    );
}

export default App;