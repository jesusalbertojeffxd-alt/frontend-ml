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
    return await response.json();
};

export const apiService = {

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
        if (data.token) {
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

    getProductos: async () => {
        const response = await fetch(API_URL + 'productos', { headers: getHeaders() });
        return await handleResponse(response);
    },

    getProducto: async (id) => {
        const response = await fetch(API_URL + 'productos/' + id, { headers: getHeaders() });
        return await handleResponse(response);
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
        const response = await fetch(API_URL + 'ventas/' + id, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return await handleResponse(response);
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
        const response = await fetch(API_URL + 'ventas/mis-compras', {
            headers: getHeaders(),
        });
        return await handleResponse(response);
    },

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
};
