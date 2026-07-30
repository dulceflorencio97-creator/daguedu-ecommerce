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
    try {
      const datos = await apiService.getProductos()
      setProductos(Array.isArray(datos) ? datos : [])
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los productos.')
    }
  }

  useEffect(() => {
    cargar()
    apiService.getCategorias().then((datos) => setCategorias(Array.isArray(datos) ? datos : [])).catch(() => setCategorias([]))
    apiService.getProveedores().then((datos) => setProveedores(Array.isArray(datos) ? datos : [])).catch(() => setProveedores([]))
  }, [])

  if (user?.role !== 'ROLE_ADMIN') return null

  const guardar = async (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    try {
      setError('')
      const producto = await apiService.actualizarProducto(seleccionado.id, {
        ...seleccionado,
        nombre: form.get('nombre'),
        descripcion: form.get('descripcion'),
        precio: Number(form.get('precio')),
        stock: Number(form.get('stock')),
        imagenUrl: form.get('imagenUrl'),
        categoria: { id: Number(form.get('categoriaId')) },
        proveedor: { id: Number(form.get('proveedorId')) }
      })
      setSeleccionado(producto)
      setEditando(false)
      cargar()
    } catch (err) {
      setError(err.message || 'No se pudo guardar el producto.')
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-rose-950">Productos</h1>
          <p className="text-rose-700">Consulta, edita y agrega productos.</p>
        </div>
        <button onClick={() => setVistaActual('nuevo-producto')} className="inline-flex self-start items-center gap-2 rounded-xl bg-amber-700 px-5 py-3 font-bold text-white shadow-sm hover:bg-amber-600 sm:self-auto">
          <PackagePlus className="w-5" />Agregar producto
        </button>
      </div>

      {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-red-700">{error}</p>}

      <div className="overflow-hidden rounded-2xl border border-rose-100 bg-white">
        {productos.map((producto) => (
          <div key={producto.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-rose-100 p-4 last:border-0">
            <img src={producto.imagenUrl || fallback} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = fallback }} className="h-14 w-14 rounded-xl bg-rose-50 object-cover" />
            <div>
              <b>{producto.nombre}</b>
              <p className="text-sm text-amber-800">${producto.precio} · Stock: {producto.stock}</p>
              <p className="text-xs text-rose-700">Proveedor: {producto.proveedor?.nombre || 'Sin proveedor'}</p>
              {producto.stock <= 3 && <p className="inline-flex items-center gap-1 text-xs font-bold text-red-600"><AlertTriangle className="w-4" />Stock bajo: quedan {producto.stock}</p>}
            </div>
            <button onClick={() => { setSeleccionado(producto); setEditando(false) }} className="rounded-lg p-2 text-amber-800 hover:bg-amber-100"><Eye /></button>
          </div>
        ))}
      </div>

      {seleccionado && (
        <div className="fixed inset-0 z-60">
          <button onClick={() => setSeleccionado(null)} aria-label="Cerrar" className="absolute inset-0 bg-black/30" />
          <aside className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white p-6">
            <button onClick={() => setSeleccionado(null)} aria-label="Cerrar" className="float-right"><X /></button>
            {editando ? (
              <form onSubmit={guardar} className="grid gap-3">
                <h2 className="text-2xl font-bold">Editar producto</h2>
                <input name="nombre" defaultValue={seleccionado.nombre} required placeholder="Nombre del producto" className="rounded-xl border p-3" />
                <textarea name="descripcion" defaultValue={seleccionado.descripcion} placeholder="Descripción" className="rounded-xl border p-3" />
                <label className="grid gap-1 text-sm font-bold text-slate-700">Precio (MXN)
                  <div className="flex overflow-hidden rounded-xl border bg-white focus-within:border-amber-600">
                    <span className="flex items-center border-r bg-amber-50 px-4 text-lg font-extrabold text-amber-800">$</span>
                    <input name="precio" type="number" min="0" step=".01" defaultValue={seleccionado.precio} required className="min-w-0 grow p-3 font-normal outline-none" />
                    <span className="flex items-center bg-amber-50 px-3 text-xs font-bold text-amber-800">MXN</span>
                  </div>
                </label>
                <label className="grid gap-1 text-sm font-bold text-slate-700">Stock disponible
                  <div className="flex overflow-hidden rounded-xl border bg-white focus-within:border-amber-600">
                    <input name="stock" type="number" min="0" defaultValue={seleccionado.stock} required className="min-w-0 grow p-3 font-normal outline-none" />
                    <span className="flex items-center border-l bg-amber-50 px-3 text-xs font-bold text-amber-800">UNIDADES</span>
                  </div>
                </label>
                <select name="categoriaId" defaultValue={seleccionado.categoria?.id} required className="rounded-xl border p-3">
                  {categorias.map((categoria) => <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>)}
                </select>
                <select name="proveedorId" defaultValue={seleccionado.proveedor?.id} required className="rounded-xl border p-3">
                  {proveedores.map((proveedor) => <option key={proveedor.id} value={proveedor.id}>{proveedor.nombre}</option>)}
                </select>
                <input name="imagenUrl" defaultValue={seleccionado.imagenUrl} placeholder="URL de imagen" className="rounded-xl border p-3" />
                <button className="rounded-xl bg-amber-700 p-3 font-bold text-white">Guardar cambios</button>
              </form>
            ) : (
              <>
                <h2 className="text-2xl font-bold">{seleccionado.nombre}</h2>
                <img src={seleccionado.imagenUrl || fallback} onError={(event) => { event.currentTarget.src = fallback }} className="mt-4 h-48 w-full rounded-xl object-cover" />
                <p className="mt-4">{seleccionado.descripcion}</p>
                <p className="mt-2">Categoría: {seleccionado.categoria?.nombre || 'Sin categoría'}</p>
                <p className="mt-2">Proveedor: <strong>{seleccionado.proveedor?.nombre || 'Sin proveedor'}</strong></p>
                <p className="mt-1 text-sm">Contacto: {seleccionado.proveedor?.contacto || 'No registrado'}</p>
                <button onClick={() => setEditando(true)} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-amber-700 px-4 py-3 font-bold text-white"><Pencil className="w-4" />Editar</button>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  )
}
