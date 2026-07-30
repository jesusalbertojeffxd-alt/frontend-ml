const API_URL = "http://epqy26ctakwdqnuavcsjlb33.168.231.67.126.sslip.io:8081/api/v1/";

const getHeaders = () => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = 'Bearer ' + token;
        console.log('Token incluido en la peticion');
    } else {
        console.warn('Sin token JWT');
    }
    return headers;
};

const handleResponse = async (response) => {
    console.log('Respuesta HTTP:', response.status, response.statusText);
    if (!response.ok) {
        const errorText = await response.text();
        console.error('Error en la respuesta:', errorText);
        throw new Error(errorText || 'Error en la red');
    }
    if (response.status === 204) return null;
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return await response.json();
    } else {
        const text = await response.text();
        return { message: text };
    }
};

const IMAGEN_POR_DEFECTO = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300';

const obtenerImagenPorNombre = (nombre) => {
    if (!nombre) return IMAGEN_POR_DEFECTO;
    const nombreLower = nombre.toLowerCase();
    
    if (nombreLower.includes('oppo')) {
        return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300';
    }
    if (nombreLower.includes('xiaomi')) {
        return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=300';
    }
    if (nombreLower.includes('samsung')) {
        return 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=300';
    }
    if (nombreLower.includes('casco')) {
        return 'https://images.unsplash.com/photo-1585061307064-3d903b803023?auto=format&fit=crop&q=80&w=300';
    }
    if (nombreLower.includes('leche')) {
        return 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=300';
    }
    if (nombreLower.includes('cargador')) {
        return 'https://images.unsplash.com/photo-1583864697784-a0efc8379f70?auto=format&fit=crop&q=80&w=300';
    }
    if (nombreLower.includes('audifonos') || nombreLower.includes('audífonos')) {
        return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=300';
    }
    if (nombreLower.includes('tablet')) {
        return 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=300';
    }
    
    return IMAGEN_POR_DEFECTO;
};

export const apiService = {

    // ============ AUTENTICACION ============
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    getUserRole: () => {
        return localStorage.getItem('rol');
    },

    getUserName: () => {
        return localStorage.getItem('nombre') || localStorage.getItem('username');
    },

    registro: async (userData) => {
        const response = await fetch(API_URL + 'auth/registro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return await handleResponse(response);
    },

    login: async (username, password) => {
        console.log('Intentando login para:', username);
        const response = await fetch(API_URL + 'auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await handleResponse(response);
        if (data && data.token) {
            console.log('Login exitoso, token recibido');
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            localStorage.setItem('nombre', data.nombre);
            localStorage.setItem('rol', data.rol);
        } else {
            console.error('Login fallido:', data);
        }
        return data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('nombre');
        localStorage.removeItem('rol');
        console.log('Sesion cerrada');
    },

    // ============ PRODUCTOS ============
    getProductos: async () => {
        try {
            const response = await fetch(API_URL + 'productos', { headers: getHeaders() });
            const productos = await handleResponse(response);
            
            if (productos && Array.isArray(productos) && productos.length > 0) {
                return productos.map(producto => {
                    if (!producto.imagenUrl) {
                        producto.imagenUrl = obtenerImagenPorNombre(producto.nombre);
                    }
                    return producto;
                });
            }
            return productos || [];
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return [
                {
                    id: 1,
                    nombre: 'OPPO Telefono Celular',
                    descripcion: 'Smartphone OPPO con camara de alta resolucion',
                    precio: 7000.00,
                    stock: 92,
                    imagenUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300',
                    categoria: { id: 1, nombre: 'Telefonos' },
                    proveedor: { id: 1, nombre: 'OPPO' }
                },
                {
                    id: 2,
                    nombre: 'Xiaomi Redmi Note 13',
                    descripcion: 'Smartphone Xiaomi con bateria de 5000mAh',
                    precio: 8000.00,
                    stock: 78,
                    imagenUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=300',
                    categoria: { id: 1, nombre: 'Telefonos' },
                    proveedor: { id: 2, nombre: 'Xiaomi' }
                },
                {
                    id: 3,
                    nombre: 'Samsung Galaxy S24',
                    descripcion: 'Smartphone Samsung con inteligencia artificial',
                    precio: 18000.00,
                    stock: 15,
                    imagenUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=300',
                    categoria: { id: 1, nombre: 'Telefonos' },
                    proveedor: { id: 3, nombre: 'Samsung' }
                }
            ];
        }
    },

    getProducto: async (id) => {
        const response = await fetch(API_URL + 'productos/' + id, { headers: getHeaders() });
        const producto = await handleResponse(response);
        if (producto && !producto.imagenUrl) {
            producto.imagenUrl = obtenerImagenPorNombre(producto.nombre);
        }
        return producto;
    },

    crearProducto: async (producto) => {
        const response = await fetch(API_URL + 'productos', {
            method: 'POST',
            body: JSON.stringify(producto),
            headers: getHeaders()
        });
        return await handleResponse(response);
    },

    actualizarProducto: async (id, producto) => {
        const response = await fetch(API_URL + 'productos/' + id, {
            method: 'PUT',
            body: JSON.stringify(producto),
            headers: getHeaders()
        });
        return await handleResponse(response);
    },

    eliminarProducto: async (id) => {
        const response = await fetch(API_URL + 'productos/' + id, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return await handleResponse(response);
    },

    // ============ CATEGORIAS ============
    getCategorias: async () => {
        const response = await fetch(API_URL + 'categorias', { headers: getHeaders() });
        return await handleResponse(response);
    },

    crearCategoria: async (categoria) => {
        const response = await fetch(API_URL + 'categorias', {
            method: 'POST',
            body: JSON.stringify(categoria),
            headers: getHeaders()
        });
        return await handleResponse(response);
    },

    actualizarCategoria: async (id, categoria) => {
        const response = await fetch(API_URL + 'categorias/' + id, {
            method: 'PUT',
            body: JSON.stringify(categoria),
            headers: getHeaders()
        });
        return await handleResponse(response);
    },

    eliminarCategoria: async (id) => {
        const response = await fetch(API_URL + 'categorias/' + id, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return await handleResponse(response);
    },

    // ============ PROVEEDORES ============
    getProveedores: async () => {
        const response = await fetch(API_URL + 'proveedores', { headers: getHeaders() });
        return await handleResponse(response);
    },

    getProveedor: async (id) => {
        const response = await fetch(API_URL + 'proveedores/' + id, { headers: getHeaders() });
        return await handleResponse(response);
    },

    crearProveedor: async (proveedor) => {
        const response = await fetch(API_URL + 'proveedores', {
            method: 'POST',
            body: JSON.stringify(proveedor),
            headers: getHeaders()
        });
        return await handleResponse(response);
    },

    actualizarProveedor: async (id, proveedor) => {
        const response = await fetch(API_URL + 'proveedores/' + id, {
            method: 'PUT',
            body: JSON.stringify(proveedor),
            headers: getHeaders()
        });
        return await handleResponse(response);
    },

    eliminarProveedor: async (id) => {
        const response = await fetch(API_URL + 'proveedores/' + id, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return await handleResponse(response);
    },

    // ============ CLIENTES ============
    getClientes: async () => {
        const response = await fetch(API_URL + 'clientes', { headers: getHeaders() });
        return await handleResponse(response);
    },

    getCliente: async (id) => {
        const response = await fetch(API_URL + 'clientes/' + id, { headers: getHeaders() });
        return await handleResponse(response);
    },

    crearCliente: async (cliente) => {
        const response = await fetch(API_URL + 'clientes', {
            method: 'POST',
            body: JSON.stringify(cliente),
            headers: getHeaders()
        });
        return await handleResponse(response);
    },

    actualizarCliente: async (id, cliente) => {
        const response = await fetch(API_URL + 'clientes/' + id, {
            method: 'PUT',
            body: JSON.stringify(cliente),
            headers: getHeaders()
        });
        return await handleResponse(response);
    },

    eliminarCliente: async (id) => {
        const response = await fetch(API_URL + 'clientes/' + id, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return await handleResponse(response);
    },

    // ============ PERFIL CLIENTE ============
    getPerfilCliente: async () => {
        const response = await fetch(API_URL + 'clientes/perfil', { 
            headers: getHeaders() 
        });
        return await handleResponse(response);
    },

    actualizarDireccionCliente: async (direccion) => {
        const response = await fetch(API_URL + 'clientes/direccion', {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(direccion)
        });
        return await handleResponse(response);
    },

    actualizarPerfilCliente: async (datos) => {
        const response = await fetch(API_URL + 'clientes/perfil', {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(datos)
        });
        return await handleResponse(response);
    },

    // ============ VENTAS ============
    crearVenta: async (venta) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No hay token JWT');
            throw new Error('No estas autenticado. Inicia sesion.');
        }
        console.log('Enviando venta a:', API_URL + 'ventas');
        console.log('Headers:', getHeaders());
        console.log('Body:', venta);
        
        const response = await fetch(API_URL + 'ventas', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(venta)
        });
        return await handleResponse(response);
    },

    procesarVenta: async (venta) => {
        console.log('Procesando venta:', venta);
        return await apiService.crearVenta(venta);
    },

    getVentas: async () => {
        const response = await fetch(API_URL + 'ventas', { headers: getHeaders() });
        return await handleResponse(response);
    },

    getVenta: async (id) => {
        const response = await fetch(API_URL + 'ventas/' + id, { headers: getHeaders() });
        return await handleResponse(response);
    },

    actualizarVenta: async (id, venta) => {
        const response = await fetch(API_URL + 'ventas/' + id, {
            method: 'PUT',
            body: JSON.stringify(venta),
            headers: getHeaders()
        });
        return await handleResponse(response);
    },

    eliminarVenta: async (id) => {
        try {
            const response = await fetch(API_URL + 'ventas/cliente/' + id, {
                method: 'DELETE',
                headers: getHeaders()
            });
            
            if (response.status === 403) {
                console.log('No tienes permiso como cliente, intentando como admin...');
                const adminResponse = await fetch(API_URL + 'ventas/' + id, {
                    method: 'DELETE',
                    headers: getHeaders()
                });
                return await handleResponse(adminResponse);
            }
            
            if (response.status === 400) {
                console.log('Error de cliente, intentando como admin...');
                const adminResponse = await fetch(API_URL + 'ventas/' + id, {
                    method: 'DELETE',
                    headers: getHeaders()
                });
                return await handleResponse(adminResponse);
            }
            
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al eliminar venta:', error);
            throw error;
        }
    },

    actualizarEstadoPago: async (idVenta, estadoPago) => {
        const response = await fetch(API_URL + 'ventas/' + idVenta, {
            method: 'PUT',
            body: JSON.stringify({ estadoPago }),
            headers: getHeaders()
        });
        return await handleResponse(response);
    },

    getSales: async () => {
        const response = await fetch(API_URL + 'ventas', {
            headers: getHeaders(),
        });
        return await handleResponse(response);
    },

    getMyPurchases: async () => {
        try {
            const response = await fetch(API_URL + 'ventas/mis-compras', {
                headers: getHeaders(),
            });
            
            if (response.status === 400) {
                console.log('No hay compras o el usuario no tiene cliente asociado');
                return [];
            }
            
            if (!response.ok) {
                const errorText = await response.text();
                console.warn('Error al cargar compras:', errorText);
                return [];
            }
            
            return await handleResponse(response);
        } catch (error) {
            console.warn('Error al cargar compras:', error.message);
            return [];
        }
    },

    // ============ PAGOS (STRIPE) ============
    crearIntencionPago: async (idVenta) => {
        const response = await fetch(API_URL + 'pagos/crear-intencion', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ idVenta, moneda: 'mxn' }),
        });
        return await handleResponse(response);
    },

    confirmarPagoVenta: async (idVenta) => {
        const response = await fetch(API_URL + 'pagos/confirmar-pago/' + idVenta, {
            method: 'POST',
            headers: getHeaders(),
        });
        return await handleResponse(response);
    },

    // ============ CARRITO PERSISTENTE ============
    getCarrito: async () => {
        const response = await fetch(API_URL + 'carrito', {
            headers: getHeaders()
        });
        return await handleResponse(response);
    },

    getOrCreateCarrito: async () => {
        const response = await fetch(API_URL + 'carrito/mi-carrito', {
            headers: getHeaders()
        });
        return await handleResponse(response);
    },

    agregarAlCarrito: async (productoId, cantidad = 1) => {
        const response = await fetch(API_URL + 'carrito/agregar', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ productoId, cantidad })
        });
        return await handleResponse(response);
    },

    actualizarCarrito: async (productoId, cantidad) => {
        const response = await fetch(API_URL + 'carrito/actualizar', {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ productoId, cantidad })
        });
        return await handleResponse(response);
    },

    eliminarDelCarrito: async (productoId) => {
        const response = await fetch(API_URL + 'carrito/' + productoId, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return await handleResponse(response);
    },

    vaciarCarrito: async () => {
        const response = await fetch(API_URL + 'carrito/vaciar', {
            method: 'DELETE',
            headers: getHeaders()
        });
        return await handleResponse(response);
    },
};
