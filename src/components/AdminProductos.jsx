import { useEffect, useState } from 'react'
import { Eye, PackagePlus, X } from 'lucide-react'
import { apiService } from '../services/apiService'

export const AdminProductos = ({ user, setVistaActual }) => {
  const [productos, setProductos] = useState([])
  const [seleccionado, setSeleccionado] = useState(null)
  const [error, setError] = useState('')

  const imagenProducto = (producto) => {
    if (producto.imagenUrl) return producto.imagenUrl
    const texto = `${producto.nombre || ''} ${producto.descripcion || ''}`.toLowerCase()
    if (/laptop|notebook|computadora/.test(texto)) return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800'
    if (/tablet|ipad|tab/.test(texto)) return 'https://images.unsplash.com/photo-1510557880182-3db7352a9c4b?auto=format&fit=crop&q=80&w=800'
    if (/celular|movil|móvil|smartphone|phone|galaxi|galaxy|iphone/.test(texto)) return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800'
    return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'
  }

  useEffect(() => { apiService.getProductos().then((datos) => setProductos(Array.isArray(datos) ? datos : datos?.content || [])).catch((err) => setError(err.message || 'No se pudieron cargar los productos.')) }, [])
  if (user?.role !== 'ROLE_ADMIN') return <div className="max-w-5xl mx-auto px-4 py-12 text-center text-rose-900">Esta vista es exclusiva para administradores.</div>

  return <div className="max-w-6xl mx-auto px-4 py-10"><div className="flex justify-between items-center mb-6"><div><h1 className="text-3xl font-extrabold text-rose-950">Productos</h1><p className="text-rose-700">Administra el catálogo disponible.</p></div><button onClick={() => setVistaActual('nuevo-producto')} className="inline-flex gap-2 items-center px-4 py-3 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold"><PackagePlus className="w-5 h-5" /> Agregar nuevo producto</button></div>{error && <p className="mb-4 text-rose-700">{error}</p>}<div className="bg-white rounded-2xl border border-rose-100 overflow-hidden shadow-sm"><div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-5 py-3 bg-rose-50 text-xs uppercase font-bold tracking-wide text-rose-800"><span></span><span>Producto</span><span>Stock</span><span></span></div>{productos.map((producto) => <div key={producto.id} className="grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center px-5 py-3 border-t border-rose-100"><img src={imagenProducto(producto)} alt={producto.nombre} className="w-12 h-12 rounded-xl object-cover bg-rose-50" /><div><p className="font-bold text-rose-950">{producto.nombre}</p><p className="text-sm text-amber-800">${Number(producto.precio || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</p></div><span className="text-sm text-rose-700">{producto.stock}</span><button onClick={() => setSeleccionado(producto)} className="p-2 rounded-lg text-amber-800 hover:bg-amber-100" title="Ver detalles"><Eye className="w-5 h-5" /></button></div>)}{!productos.length && !error && <p className="p-8 text-center text-rose-700">No hay productos registrados.</p>}</div>{seleccionado && <div className="fixed inset-0 z-60"><button aria-label="Cerrar detalle" onClick={() => setSeleccionado(null)} className="absolute inset-0 bg-rose-950/30" /><aside className="absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl p-6"><button onClick={() => setSeleccionado(null)} className="float-right text-rose-800"><X /></button><h2 className="text-2xl font-extrabold text-rose-950 pr-8">{seleccionado.nombre}</h2><img src={imagenProducto(seleccionado)} alt={seleccionado.nombre} className="w-full h-48 object-cover rounded-2xl mt-5" /><dl className="mt-6 space-y-4 text-sm"><div><dt className="text-rose-600">Descripción</dt><dd className="font-semibold text-rose-950">{seleccionado.descripcion || 'Sin descripción'}</dd></div><div><dt className="text-rose-600">Precio</dt><dd className="font-semibold text-rose-950">${Number(seleccionado.precio || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</dd></div><div><dt className="text-rose-600">Existencias</dt><dd className="font-semibold text-rose-950">{seleccionado.stock}</dd></div><div><dt className="text-rose-600">Categoría</dt><dd className="font-semibold text-rose-950">{seleccionado.categoria?.nombre || 'Sin categoría'}</dd></div></dl></aside></div>}</div>
}
