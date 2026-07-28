import { useState, useEffect } from 'react'
import { apiService } from '../services/apiService'
import { Search, Filter, ShoppingCart, Info, AlertTriangle, Settings } from 'lucide-react'

const Catalogo = ({ agregarACarrito, setVistaActual, user, cart = [] }) => {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [carga, setCarga] = useState(true)
  const [error, setError] = useState('')

  const handleAgregarCarrito = (producto) => {
    if (typeof agregarACarrito === 'function') {
      agregarACarrito(producto)
    }
  }

  const isCliente = user?.role === 'ROLE_CLIENTE'
  const isAdmin = user?.role === 'ROLE_ADMIN'

  const obtenerCategoriaProducto = (producto) => {
    if (producto.categoria?.nombre) return producto.categoria

    const texto = `${producto.nombre || ''} ${producto.descripcion || ''}`.toLowerCase()
    if (/tablet|ipad|tab/.test(texto)) return { id: 'tablets', nombre: 'Tablets' }
    if (/laptop|notebook/.test(texto)) return { id: 'laptops', nombre: 'Laptops' }
    if (/celular|smartphone|phone|galaxi|galaxy/.test(texto)) return { id: 'smartphones', nombre: 'Smartphones' }
    return { id: 'otros', nombre: 'Otros' }
  }

  const getProductImage = (producto) => {
    const text = `${producto.nombre || ''} ${producto.descripcion || ''} ${producto.categoria?.nombre || ''}`.toLowerCase()
    if (/lap|laptop|notebook/.test(text)) {
      return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800'
    }
    if (/celular|móvil|smartphone|phone/.test(text)) {
      return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800'
    }
    if (/tablet|ipad|tab/.test(text)) {
      return 'https://images.unsplash.com/photo-1510557880182-3db7352a9c4b?auto=format&fit=crop&q=80&w=800'
    }
    if (/aud[ií]fono|headphone|earbud/.test(text)) {
      return 'https://images.unsplash.com/photo-1512499617640-c2f999078c59?auto=format&fit=crop&q=80&w=800'
    }
    if (/monitor|pantalla|screen/.test(text)) {
      return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800'
    }
    return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'
  }

  // filtros
  const [searchQuery, setSearchQuery] = useState('')
  const [selecionCategoria, setSelecionCategoria] = useState('Todos')

    useEffect(() => {
        const cargaDatosCatalogo = async () => {
            setCarga(true);
            try {
                const respuestaProductos = await apiService.getProductos();
                // Spring puede responder un arreglo o una página (content/data).
                const datosProductos = Array.isArray(respuestaProductos)
                  ? respuestaProductos
                  : respuestaProductos?.content || respuestaProductos?.data || [];
                const productosConCategoria = datosProductos.map((producto) => ({
                  ...producto,
                  categoria: obtenerCategoriaProducto(producto)
                }));
                setProductos(productosConCategoria);
          // intenta obtener categorías desde el servicio; si no existe, deriva desde los productos
          let datosCategorias = [];
          if (typeof apiService.getCategorias === 'function') {
            try {
              datosCategorias = await apiService.getCategorias();
            } catch (e) {
              // falla al obtener categorias del backend, se hará fallback abajo
              datosCategorias = [];
            }
          }

          // Combinar las categorías del backend con las detectadas en productos.
          const setCats = new Map();
          (datosCategorias || []).forEach((categoria) => {
            const id = categoria?.id ?? categoria?.nombre;
            if (id) setCats.set(id, categoria);
          });
          (productosConCategoria || []).forEach((p) => {
            const nombre = p?.categoria?.nombre;
            const id = p?.categoria?.id ?? nombre;
            if (nombre && !setCats.has(id)) setCats.set(id, { id, nombre });
          });
          datosCategorias = Array.from(setCats.values());

          setCategorias(datosCategorias);
            } catch (err) {
                setError('Error en el servidor backend: ' + err);
            } finally {
                setCarga(false);
            }
        }

        cargaDatosCatalogo()
    }, [])

    /*const agregarCarrito = (producto) => {
        if (!usuario) {
        setVistaActual('login');
        return;
        }
        if (usuario.rol !== 'CLIENTE') {
        alert('Solo los usuarios registrados con el rol de Cliente pueden realizar compras.');
        return;
        }
        agregarACarrito(producto);
    };*/

    const filtroProductos = productos.filter((producto)=>{
        const busqueda = 
        producto.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (producto.descripcion 
        && producto.descripcion.toLowerCase().includes(searchQuery.toLowerCase()));

        const busquedaCategorias =
        selecionCategoria === 'Todos' || 
        (producto.categoria && producto.categoria.nombre === selecionCategoria);    

        return busqueda && busquedaCategorias;
    
    });
    
    if(carga){
        return(
            <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-900"></div>
                    <p className="text-rose-900 mt-4 font-medium">Cargando productos...</p>
            </div>
        );
    }

    return(
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
           
            
            {/* Banner Principal */}
            <div className="bg-gradient-to-r from-rose-950 via-amber-900 to-amber-500 rounded-2xl p-8 mb-8 text-white shadow-[0_20px_60px_-30px_rgba(112,33,18,0.8)] relative overflow-hidden">
                <div className="relative z-10 max-w-xl">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Catálogo de Productos</h1>
                <p className="mt-2 text-amber-100 text-sm sm:text-base">
                    Explora las mejores ofertas, productos de calidad y envíos garantizados directamente por nuestros proveedores.
                </p>
                {user && (
                  <p className="mt-4 inline-flex rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold">
                    Sesión iniciada: {user.nombre || user.username} ({isAdmin ? 'Administrador' : 'Cliente'})
                  </p>
                )}
                </div>
                <div className="absolute right-0 bottom-0 top-0 opacity-10 flex items-center justify-center p-8">
                <ShoppingCart className="w-64 h-64 text-amber-200" />
                </div>
            </div>

            {error && (
                <div className="bg-rose-50 text-rose-900 p-4 rounded-xl flex items-start gap-2.5 border border-rose-200 text-sm mb-6">
                <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                    <span className="font-bold">Aviso del Servidor:</span> {error}. Mostrando interfaz local. Asegúrate de iniciar la API en Spring Boot.
                </div>
                </div>
            )}

            {/* Buscador y Contenido */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filtros Lateral (Sidebar) */}
        <div className="w-full md:w-1/4 flex-shrink-0 space-y-6">
          {/* Tarjeta de Búsqueda */}
          <div className="bg-rose-50 p-5 rounded-2xl border border-rose-200 shadow-sm space-y-3">
            <h3 className="font-bold text-rose-900 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Search className="w-4 h-4 text-amber-500" /> Buscar Producto
            </h3>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Escribe nombre o descripción..."
                className="w-full p-3 pl-4 rounded-xl border border-rose-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-rose-900"
              />
            </div>
          </div>

          {/* Tarjeta de Categorías */}
          <div className="bg-rose-50 p-5 rounded-2xl border border-rose-200 shadow-sm space-y-4">
            <h3 className="font-bold text-rose-900 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Filter className="w-4 h-4 text-amber-500" /> Categorías
            </h3>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setSelecionCategoria('Todos')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  selecionCategoria === 'Todos'
                    ? 'bg-amber-100 text-rose-900 font-bold shadow-sm'
                    : 'text-rose-700 hover:bg-rose-100'
                }`}
              >
                Todas las categorías
              </button>
              {categorias.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelecionCategoria(cat.nombre)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    selecionCategoria === cat.nombre
                      ? 'bg-amber-100 text-rose-900 font-bold shadow-sm'
                      : 'text-rose-700 hover:bg-rose-100'
                  }`}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cuadrícula de Productos */}
        <div className="w-full md:w-3/4">
          {filtroProductos.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
              <AlertTriangle className="w-12 h-12 text-indigo-300 mx-auto mb-4" />
              <h3 className="font-bold text-lg text-gray-800">No se encontraron productos</h3>
              <p className="text-gray-500 text-sm mt-1">Prueba a modificar los filtros o los términos de búsqueda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtroProductos.map((producto) => {
                const defaultImage = getProductImage(producto)
                const cantidadEnCarrito = cart.find((item) => item.id === producto.id)?.cantidad || 0;
                const stockDisponible = Math.max(0, producto.stock - cantidadEnCarrito);
                const isOutOfStock = stockDisponible <= 0;

                return (
                  <div
                    key={producto.id}
                    className="bg-white/90 rounded-3xl border border-rose-100 shadow-[0_18px_60px_-30px_rgba(112,33,18,0.8)] overflow-hidden flex flex-col group hover:shadow-[0_24px_80px_-30px_rgba(131,24,35,0.75)] transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Imagen con zoom effect */}
                    <div className="h-48 w-full bg-rose-50 relative overflow-hidden">
                      <img
                        src={producto.imagenUrl || defaultImage}
                        alt={producto.nombre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = getProductImage(producto);
                        }}
                      />
                      {/* Categoría Badge */}
                      {producto.categoria && (
                        <span className="absolute top-3 left-3 bg-amber-900/90 text-amber-100 text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                          {producto.categoria.nombre}
                        </span>
                      )}
                    </div>

                    {/* Cuerpo */}
                    <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        {/* Proveedor */}
                        {producto.proveedor && (
                          <div className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                            <i className="fa-solid fa-truck text-amber-500"></i> {producto.proveedor.nombreEmpresa}
                          </div>
                        )}
                        <h3 className="font-bold text-rose-950 text-base line-clamp-1 group-hover:text-rose-700 transition-colors">
                          {producto.nombre}
                        </h3>
                        <p className="text-rose-600 text-xs line-clamp-2 h-8">
                          {producto.descripcion || 'Sin descripción disponible.'}
                        </p>
                      </div>

                      {/* Precio y Stock */}
                      <div className="pt-2">
                        <div className="flex justify-between items-baseline">
                          <span className="font-extrabold text-xl text-amber-800">
                            ${producto.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                          </span>
                          <span className={`text-xs font-bold ${isOutOfStock ? 'text-red-500' : 'text-amber-900'}`}>
                            {isOutOfStock ? 'Sin stock' : `Disponibles: ${stockDisponible}`}
                          </span>
                        </div>

                        {isCliente && (
                          <button
                            onClick={() => handleAgregarCarrito(producto)}
                            disabled={isOutOfStock}
                            className={`w-full mt-4 flex items-center justify-center gap-2 p-3 rounded-xl font-bold text-xs shadow-sm transition-all duration-200 cursor-pointer ${
                              isOutOfStock
                                ? 'bg-rose-100 text-rose-400 shadow-none cursor-not-allowed'
                                : 'bg-amber-700 hover:bg-amber-600 text-white shadow-lg'
                            }`}
                          >
                            <ShoppingCart className="w-4 h-4 text-white" />
                            Añadir al Carrito
                          </button>
                        )}
                        {isAdmin && (
                          <button
                            onClick={() => setVistaActual('admin-panel')}
                            className="w-full mt-4 flex items-center justify-center gap-2 p-3 rounded-xl font-bold text-xs shadow-sm transition-all duration-200 cursor-pointer bg-rose-900 hover:bg-rose-800 text-white shadow-lg"
                          >
                            <Settings className="w-4 h-4" />
                            Administrar producto
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>



        </div>
    );
}

export default Catalogo
