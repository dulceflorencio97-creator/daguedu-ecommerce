import { useEffect, useState } from 'react'
import { AlertTriangle, Eye, PackagePlus, Pencil, X } from 'lucide-react'
import { apiService } from '../services/apiService'

const fallback = 'https://images.unsplash.com/photo-1510557880182-3db7352a9c4b?auto=format&fit=crop&q=80&w=800'

export const AdminProductos = ({ user, setVistaActual }) => {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [seleccionado, setSeleccionado] = useState(null)
  const [editando, setEditando] = useState(false)
  const [error, setError] = useState('')

  const cargar = async () => {
    try { const datos = await apiService.getProductos(); setProductos(Array.isArray(datos) ? datos : []) } catch (err) { setError(err.message) }
  }
  useEffect(() => {
    cargar()
    apiService.getCategorias().then((datos) => setCategorias(Array.isArray(datos) ? datos : []))
    apiService.getProveedores().then((datos) => setProveedores(Array.isArray(datos) ? datos : []))
  }, [])
  if (user?.role !== 'ROLE_ADMIN') return null

  const guardar = async (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    try {
      const producto = await apiService.actualizarProducto(seleccionado.id, {
        ...seleccionado, nombre: form.get('nombre'), descripcion: form.get('descripcion'),
        precio: Number(form.get('precio')), stock: Number(form.get('stock')), imagenUrl: form.get('imagenUrl'),
        categoria: { id: Number(form.get('categoriaId')) }, proveedor: { id: Number(form.get('proveedorId')) }
      })
      setSeleccionado(producto); setEditando(false); cargar()
    } catch (err) { setError(err.message || 'No se pudo guardar el producto.') }
  }

  return <div className="max-w-6xl mx-auto px-4 py-10">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"><div><h1 className="text-3xl font-extrabold text-rose-950">Productos</h1><p className="text-rose-700">Consulta, edita y agrega productos.</p></div><button onClick={() => setVistaActual('nuevo-producto')} className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold shadow-sm"><PackagePlus className="w-5" />Agregar producto</button></div>
    {error && <p className="text-red-600">{error}</p>}
    <div className="bg-white rounded-2xl overflow-hidden border border-rose-100">{productos.map((producto) => <div key={producto.id} className="grid grid-cols-[auto_1fr_auto] gap-4 items-center p-4 border-b border-rose-100"><img src={producto.imagenUrl || fallback} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = fallback }} className="w-14 h-14 object-cover rounded-xl bg-rose-50" /><div><b>{producto.nombre}</b><p className="text-sm text-amber-800">${producto.precio} · Stock: {producto.stock}</p><p className="text-xs text-rose-700">Proveedor: {producto.proveedor?.nombre || 'Sin proveedor'}</p>{producto.stock <= 3 && <p className="text-xs text-red-600 font-bold inline-flex items-center gap-1"><AlertTriangle className="w-4" />Stock bajo: quedan {producto.stock}</p>}</div><button onClick={() => { setSeleccionado(producto); setEditando(false) }} className="p-2 rounded-lg text-amber-800 hover:bg-amber-100"><Eye /></button></div>)}</div>
    {seleccionado && <div className="fixed inset-0 z-60"><button onClick={() => setSeleccionado(null)} className="absolute inset-0 bg-black/30" /><aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white p-6 overflow-y-auto"><button onClick={() => setSeleccionado(null)} className="float-right"><X /></button>{editando ? <form onSubmit={guardar} className="grid gap-3"><h2 className="text-2xl font-bold">Editar producto</h2><input name="nombre" defaultValue={seleccionado.nombre} required className="p-3 border rounded-xl" /><textarea name="descripcion" defaultValue={seleccionado.descripcion} className="p-3 border rounded-xl" /><input name="precio" type="number" min="0" step=".01" defaultValue={seleccionado.precio} required className="p-3 border rounded-xl" /><input name="stock" type="number" min="0" defaultValue={seleccionado.stock} required className="p-3 border rounded-xl" /><select name="categoriaId" defaultValue={seleccionado.categoria?.id} required className="p-3 border rounded-xl">{categorias.map((categoria) => <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>)}</select><select name="proveedorId" defaultValue={seleccionado.proveedor?.id} required className="p-3 border rounded-xl">{proveedores.map((proveedor) => <option key={proveedor.id} value={proveedor.id}>{proveedor.nombre}</option>)}</select><input name="imagenUrl" defaultValue={seleccionado.imagenUrl} placeholder="URL imagen" className="p-3 border rounded-xl" /><button className="bg-amber-700 text-white p-3 rounded-xl font-bold">Guardar cambios</button></form> : <><h2 className="text-2xl font-bold">{seleccionado.nombre}</h2><img src={seleccionado.imagenUrl || fallback} onError={(event) => { event.currentTarget.src = fallback }} className="w-full h-48 object-cover rounded-xl mt-4" /><p className="mt-4">{seleccionado.descripcion}</p><p className="mt-2">Categoría: {seleccionado.categoria?.nombre || 'Sin categoría'}</p><p className="mt-2">Proveedor: <strong>{seleccionado.proveedor?.nombre || 'Sin proveedor'}</strong></p><p className="mt-1 text-sm">Contacto: {seleccionado.proveedor?.contacto || 'No registrado'}</p><button onClick={() => setEditando(true)} className="mt-5 bg-amber-700 text-white px-4 py-3 rounded-xl font-bold inline-flex items-center gap-2"><Pencil className="w-4" />Editar</button></>}</aside></div>}
  </div>
}
