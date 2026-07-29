import { LogOut } from "lucide-react";

// En Docker, Nginx redirige /api hacia el backend. Para desarrollo local se
// puede sobrescribir con VITE_API_URL.
const API_URL = import.meta.env.VITE_API_URL || "/api/v1/";

//Metodo helper para obtener las cabeceras con JWT
const getHeaders = () => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
    };
    if(token){
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

// Método principal para manejar respuestas
const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Error en la petición");
    }

    // Cuando el backend responde 204 No Content, no hay JSON que convertir
    if (response.status === 204) {
        return null;
    }

    return await response.json();
};

export const apiService = {

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    getUserRol: () => {
        return localStorage.getItem('rol');
    },

    getUserName: () => {
        return localStorage.getItem('nombre') || localStorage.getItem('username');
    },

    //Metodo de registro----------------------------------------

    registro: async (userData) => {
        const response = await fetch(API_URL+'auth/registro', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body : JSON.stringify(userData),
        });
        return await handleResponse(response);
    },

    //Metodo de login
    login: async(email, password) => {
        const response = await fetch(API_URL+'auth/login',{
        method: 'POST',
        headers:{'Content-Type': 'application/json'},
        // AuthRequest de daguedu1 recibe el campo email.
        body: JSON.stringify({email, password}),
        });

        const data = await handleResponse(response);
        if(data.token){
            localStorage.setItem('token', data.token),
            localStorage.setItem('username', data.username),
            localStorage.setItem('nombre', data.nombre),
            localStorage.setItem('rol', data.rol),
            localStorage.setItem('email', data.email || data.username),
            localStorage.setItem('direccion', data.direccion || ''),
            localStorage.setItem('telefono', data.telefono || '')
        }
        return data;
    },

    //Metodo de logout
    LogOut:() => {
        localStorage.removeItem('token'),
        localStorage.removeItem('username'),
        localStorage.removeItem('nombre'),
        localStorage.removeItem('rol'),
        localStorage.removeItem('email'),
        localStorage.removeItem('direccion'),
        localStorage.removeItem('telefono')
    },

    // ---------------------------------------------------------
    // PRODUCTOS
    // ---------------------------------------------------------
    getProductos: async () => {
        let response = await fetch(API_URL + "producto/", { headers: getHeaders() });
        if (response.status === 404) {
            response = await fetch(API_URL + "producto", { headers: getHeaders() });
        }
        return await handleResponse(response);
    },

    getProducto: async (id) => {
        const response = await fetch(
            API_URL + "producto/" + id
        );
        return await handleResponse(response);
    },

    crearProducto: async (producto) => {
        const response = await fetch(
            API_URL + "producto/",
            {
                method: "POST",
                body: JSON.stringify(producto),
                headers: getHeaders()
            }
        );
        return await handleResponse(response);
    },

    actualizarProducto: async (id, producto) => {
        const response = await fetch(
            API_URL + "producto/" + id,
            {
                method: "PUT",
                body: JSON.stringify(producto),
                headers: getHeaders()
            }
        );
        return await handleResponse(response);
    },

    eliminarProducto: async (id) => {
        if (!window.confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return null;
        const response = await fetch(
            API_URL + "producto/" + id,
            {
                method: "DELETE"
            }
        );
        return await handleResponse(response);
    },


    // ---------------------------------------------------------
    // CATEGORÍAS
    // ---------------------------------------------------------
    getCategorias: async () => {
        const response = await fetch(
            API_URL + "categoria/"
        );
        return await handleResponse(response);
    },

    getCategoria: async (id) => {
        const response = await fetch(
            API_URL + "categoria/" + id
        );
        return await handleResponse(response);
    },

    crearCategoria: async (categoria) => {
        const response = await fetch(
            API_URL + "categoria/",
            {
                method: "POST",
                body: JSON.stringify(categoria),
                headers: getHeaders()
            }
        );
        return await handleResponse(response);
    },

    actualizarCategoria: async (id, categoria) => {
        const response = await fetch(
            API_URL + "categoria/" + id,
            {
                method: "PUT",
                body: JSON.stringify(categoria),
                headers: getHeaders()
            }
        );
        return await handleResponse(response);
    },

    eliminarCategoria: async (id) => {
        if (!window.confirm('¿Eliminar esta categoría?')) return null;
        const response = await fetch(
            API_URL + "categoria/" + id,
            {
                method: "DELETE"
            }
        );
        return await handleResponse(response);
    },


    // ---------------------------------------------------------
    // CLIENTES
    // ---------------------------------------------------------
    getClientes: async () => {
        const response = await fetch(
            API_URL + "cliente/"
        );
        return await handleResponse(response);
    },

    getCliente: async (id) => {
        const response = await fetch(
            API_URL + "cliente/" + id
        );
        return await handleResponse(response);
    },

    crearCliente: async (cliente) => {
        const response = await fetch(
            API_URL + "clientes/",
            {
                method: "POST",
                body: JSON.stringify(cliente),
                headers: getHeaders()
            }
        );
        return await handleResponse(response);
    },

    actualizarCliente: async (id, cliente) => {
        const response = await fetch(
            API_URL + "clientes/" + id,
            {
                method: "PUT",
                body: JSON.stringify(cliente),
                headers: getHeaders()
            }
        );
        return await handleResponse(response);
    },

    eliminarCliente: async (id) => {
        const response = await fetch(
            API_URL + "clientes/" + id,
            {
                method: "DELETE"
            }
        );
        return await handleResponse(response);
    },


    // ---------------------------------------------------------
    // PROVEEDORES
    // ---------------------------------------------------------
    getProveedores: async () => {
        const response = await fetch(
            API_URL + "proveedor/"
        );
        return await handleResponse(response);
    },

    getProveedor: async (id) => {
        const response = await fetch(
            API_URL + "proveedor/" + id
        );
        return await handleResponse(response);
    },

    crearProveedor: async (proveedor) => {
        const response = await fetch(
            API_URL + "proveedores/",
            {
                method: "POST",
                body: JSON.stringify(proveedor),
                headers: getHeaders()
            }
        );
        return await handleResponse(response);
    },

    actualizarProveedor: async (id, proveedor) => {
        const response = await fetch(
            API_URL + "proveedores/" + id,
            {
                method: "PUT",
                body: JSON.stringify(proveedor),
                headers: getHeaders()
            }
        );
        return await handleResponse(response);
    },

    eliminarProveedor: async (id) => {
        const response = await fetch(
            API_URL + "proveedores/" + id,
            {
                method: "DELETE"
            }
        );
        return await handleResponse(response);
    },


    // ---------------------------------------------------------
    // VENTAS
    // ---------------------------------------------------------
    getVentas: async () => {
        const response = await fetch(
            API_URL + "venta/"
        );
        return await handleResponse(response);
    },

    getVenta: async (id) => {
        const response = await fetch(
            API_URL + "ventas/" + id
        );
        return await handleResponse(response);
    },

    crearVenta: async (venta) => {
        const response = await fetch(
            API_URL + "venta/",
            {
                method: "POST",
                body: JSON.stringify(venta),
                headers: getHeaders()
            }
        );
        return await handleResponse(response);
    },

    procesarVenta: async (venta, email) => {
        const response = await fetch(API_URL + `venta/procesar?email=${encodeURIComponent(email)}`, {
            method: 'POST', body: JSON.stringify(venta), headers: getHeaders()
        });
        return await handleResponse(response);
    },

    crearIntencionPago: async (idVenta) => {
        const response = await fetch(API_URL + 'pagos/crear-intencion', {
            method: 'POST', body: JSON.stringify({ idVenta, moneda: 'mxn' }), headers: getHeaders()
        });
        return await handleResponse(response);
    },

    confirmarPagoVenta: async (idVenta) => {
        const response = await fetch(API_URL + `pagos/confirmar-pago/${idVenta}`, {
            method: 'POST', headers: getHeaders()
        });
        return await handleResponse(response);
    },

    actualizarVenta: async (id, venta) => {
        const response = await fetch(
            API_URL + "ventas/" + id,
            {
                method: "PUT",
                body: JSON.stringify(venta),
                headers: getHeaders()
            }
        );
        return await handleResponse(response);
    },

    eliminarVenta: async (id) => {
        const response = await fetch(
            API_URL + "ventas/" + id,
            {
                method: "DELETE"
            }
        );
        return await handleResponse(response);
    },


    // ---------------------------------------------------------
    // DETALLE VENTAS
    // ---------------------------------------------------------
    getDetalleVentas: async () => {
        const response = await fetch(
            API_URL + "detalle-ventas/"
        );
        return await handleResponse(response);
    },

    getDetalleVenta: async (id) => {
        const response = await fetch(
            API_URL + "detalle-ventas/" + id
        );
        return await handleResponse(response);
    },

    crearDetalleVenta: async (detalleVenta) => {
        const response = await fetch(
            API_URL + "detalle-ventas/",
            {
                method: "POST",
                body: JSON.stringify(detalleVenta),
                headers: getHeaders()
            }
        );
        return await handleResponse(response);
    },

    actualizarDetalleVenta: async (id, detalleVenta) => {
        const response = await fetch(
            API_URL + "detalle-ventas/" + id,
            {
                method: "PUT",
                body: JSON.stringify(detalleVenta),
                headers: getHeaders()
            }
        );
        return await handleResponse(response);
    },

    eliminarDetalleVenta: async (id) => {
        const response = await fetch(
            API_URL + "detalle-ventas/" + id,
            {
                method: "DELETE"
            }
        );
        return await handleResponse(response);
    }

};
//clientes,provedores,ventas, pagar 
