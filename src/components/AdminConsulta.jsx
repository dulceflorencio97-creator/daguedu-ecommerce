import { useEffect, useMemo, useState } from 'react'
import { ClipboardList, Eye, Package, Plus, Tags, X } from 'lucide-react'
import { apiService } from '../services/apiService'

const DetalleVenta = ({ venta, cerrar }) => (
  <div className="fixed inset-0 z-60">
    <button onClick={cerrar} aria-label="Cerrar detalle" className="absolute inset-0 bg-rose-950/30" />
    <aside className="absolute right-0 top-0 h-full w-full max-w-sm overflow-y-auto bg-white p-6 shadow-2xl">
      <button onClick={cerrar} aria-label="Cerrar" className="float-right text-rose-950"><X /></button>
      <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Detalle de venta</p>
      <h2 className="mt-1 text-2xl font-bold text-rose-950">Venta #{venta.id}</h2>
      <p className="mt-1 text-sm text-rose-700">{venta.fecha || venta.fechaVenta || 'Fecha no disponible'} · {venta.estadoPago || venta.estado || 'PENDIENTE'}</p>
      <p className="mt-4 text-slate-700">Cliente: <b>{venta.cliente?.nombre || venta.cliente?.email || 'No disponible'}</b></p>
      <div className="mt-5">
        {(venta.detalles || []).map((detalle) => (
          <div key={detalle.id || detalle.producto?.id} className="border-b border-rose-100 py-3">
            <p className="font-medium text-slate-800">{detalle.producto?.nombre || 'Producto'}</p>
            <p className="text-sm text-slate-600">Cantidad: {detalle.cantidad}</p>
          </div>
        ))}
      </div>
      <b className="mt-5 block text-lg text-rose-950">Total: ${venta.total}</b>
    </aside>
  </div>
)

const DetalleCategoria = ({ categoria, productos, cerrar }) => (
  <div className="fixed inset-0 z-60">
    <button onClick={cerrar} aria-label="Cerrar detalle" className="absolute inset-0 bg-rose-950/30" />
    <aside className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl">
      <button onClick={cerrar} aria-label="Cerrar" className="float-right text-rose-950"><X /></button>
      <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Productos de la categoría</p>
      <h2 className="mt-1 text-2xl font-bold text-rose-950">{categoria.nombre}</h2>
      <p className="mt-1 text-sm text-slate-600">{productos.length} producto{productos.length === 1 ? '' : 's'} asignado{productos.length === 1 ? '' : 's'}</p>

      {productos.length === 0 ? (
        <div className="mt-7 rounded-2xl border border-dashed border-amber-300 bg-amber-50 p-5 text-center text-slate-600">
          Aún no hay productos asignados a esta categoría.
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {productos.map((producto) => (
            <article key={producto.id} className="flex gap-3 rounded-2xl border border-rose-100 p-3">
              <img
                src={producto.imagenUrl}
                alt={producto.nombre}
                className="h-16 w-16 rounded-xl object-cover bg-amber-50"
                onError={(event) => { event.currentTarget.style.display = 'none' }}
              />
              <div className="min-w-0">
                <p className="font-bold text-slate-800">{producto.nombre}</p>
                <p className="text-sm text-amber-800">${Number(producto.precio || 0).toLocaleString('es-MX')} · Stock: {producto.stock ?? 0}</p>
                <p className="mt-1 text-xs text-slate-500">Proveedor: {producto.proveedor?.nombre || producto.proveedor?.nombreEmpresa || 'Sin proveedor'}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </aside>
  </div>
)

export const AdminConsulta = ({ user, tipo, setVistaActual }) => {
  const [datos, setDatos] = useState([])
  const [productos, setProductos] = useState([])
  const [nombre, setNombre] = useState('')
  const [seleccionada, setSeleccionada] = useState(null)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [guardando, setGuardando] = useState(false)
  const esCategorias = tipo === 'categorias'

  const cargar = async () => {
    try {
      setError('')
      if (esCategorias) {
        const [categorias, productosRegistrados] = await Promise.all([
          apiService.getCategorias(),
          apiService.getProductos()
        ])
        setDatos(Array.isArray(categorias) ? categorias : [])
        setProductos(Array.isArray(productosRegistrados) ? productosRegistrados : [])
      } else {
        const ventas = await apiService.getVentas()
        setDatos(Array.isArray(ventas) ? ventas : [])
      }
    } catch (err) {
      setError(err.message || 'No se pudo cargar la información.')
    }
  }

  useEffect(() => { cargar() }, [esCategorias])

  const productosSeleccionados = useMemo(() => {
    if (!seleccionada || !esCategorias) return []
    return productos.filter((producto) => String(producto.categoria?.id) === String(seleccionada.id))
  }, [seleccionada, productos, esCategorias])

  const cantidadPorCategoria = (categoriaId) => productos.filter(
    (producto) => String(producto.categoria?.id) === String(categoriaId)
  ).length

  const guardarCategoria = async (event) => {
    event.preventDefault()
    const categoria = nombre.trim()
    if (!categoria) return

    try {
      setGuardando(true)
      setError('')
      setMensaje('')
      await apiService.crearCategoria({ nombre: categoria })
      setNombre('')
      setMensaje('Categoría agregada correctamente.')
      await cargar()
    } catch (err) {
      setError(err.message || 'No se pudo agregar la categoría.')
    } finally {
      setGuardando(false)
    }
  }

  if (user?.role !== 'ROLE_ADMIN') return null

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-sm">
        <header className="flex gap-3 bg-rose-950 p-6 text-amber-100">
          {esCategorias ? <Tags /> : <ClipboardList />}
          <div>
            <h1 className="text-xl font-bold">{esCategorias ? 'Categorías' : 'Ventas realizadas'}</h1>
            <p className="mt-1 text-sm text-amber-100/80">
              {esCategorias ? 'Agrega categorías y consulta los productos asignados.' : 'Consulta el detalle de las compras realizadas.'}
            </p>
          </div>
        </header>

        <div className="p-6">
          {esCategorias && (
            <form onSubmit={guardarCategoria} className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex sm:items-end sm:gap-3">
              <label className="block grow text-sm font-bold text-slate-700">
                Nueva categoría
                <input
                  value={nombre}
                  onChange={(event) => setNombre(event.target.value)}
                  placeholder="Ej. Jardín y herramientas"
                  className="mt-2 w-full rounded-xl border border-amber-200 bg-white p-3 font-normal outline-none focus:border-amber-600"
                  required
                />
              </label>
              <button disabled={guardando} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-700 px-4 py-3 font-bold text-white transition hover:bg-amber-800 disabled:opacity-60 sm:mt-0 sm:w-auto">
                <Plus className="h-5 w-5" /> {guardando ? 'Guardando...' : 'Agregar categoría'}
              </button>
            </form>
          )}

          {error && <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">{error}</p>}
          {mensaje && <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-700">{mensaje}</p>}

          {datos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-rose-200 p-8 text-center text-slate-500">
              {esCategorias ? 'Aún no hay categorías registradas.' : 'Aún no hay ventas registradas.'}
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-rose-100">
              {datos.map((dato) => {
                const cantidad = esCategorias ? cantidadPorCategoria(dato.id) : 0
                return (
                  <div key={dato.id} className="flex items-center justify-between gap-4 border-b border-rose-100 p-4 last:border-0">
                    <div className="min-w-0">
                      <b className="text-slate-800">{esCategorias ? dato.nombre : `Venta #${dato.id}`}</b>
                      {esCategorias ? (
                        <p className="mt-1 text-sm text-slate-600">{cantidad} producto{cantidad === 1 ? '' : 's'} registrado{cantidad === 1 ? '' : 's'}</p>
                      ) : (
                        <p className="mt-1 text-sm text-rose-700">{dato.cliente?.nombre || dato.cliente?.email} · {dato.fecha || dato.fechaVenta || 'Sin fecha'} · <span className="font-bold">{dato.estadoPago || dato.estado || 'PENDIENTE'}</span> · ${dato.total}</p>
                      )}
                    </div>
                    <button
                      onClick={() => setSeleccionada(dato)}
                      className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-amber-300 px-3 py-2 font-medium text-amber-800 transition hover:bg-amber-50"
                    >
                      {esCategorias ? <Package className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {esCategorias ? 'Ver productos' : 'Ver detalle'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          <button onClick={() => setVistaActual('admin-panel')} className="mt-6 rounded-xl bg-amber-700 px-4 py-2 font-medium text-white hover:bg-amber-800">Volver al panel</button>
        </div>
      </div>

      {seleccionada && (esCategorias
        ? <DetalleCategoria categoria={seleccionada} productos={productosSeleccionados} cerrar={() => setSeleccionada(null)} />
        : <DetalleVenta venta={seleccionada} cerrar={() => setSeleccionada(null)} />)}
    </div>
  )
}
