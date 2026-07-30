import { useEffect, useState } from 'react'
import { CreditCard, Eye, PackagePlus, ReceiptText, Trash2, X } from 'lucide-react'
import { apiService } from '../services/apiService'

const money = (value) => `$${Number(value || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`

const DetalleCompra = ({ compra, cerrar, onTerminarCompra, onAgregarProductos, onEliminarProducto }) => {
  const pendiente = compra.estadoPago !== 'PAGADO'

  return (
    <div className="fixed inset-0 z-50">
      <button onClick={cerrar} className="absolute inset-0 bg-rose-950/40" aria-label="Cerrar" />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white shadow-2xl p-6">
        <button onClick={cerrar} className="float-right text-rose-800"><X /></button>
        <p className="text-sm font-bold uppercase tracking-wider text-amber-700">Detalle de compra</p>
        <h2 className="mt-1 text-2xl font-extrabold text-rose-950">Compra #{compra.id}</h2>
        <p className="mt-1 text-sm text-rose-700">{compra.fecha ? new Date(compra.fecha).toLocaleString('es-MX') : 'Fecha no disponible'}</p>

        <div className="mt-6 space-y-3">
          {(compra.detalles || []).map((detalle) => (
            <div key={detalle.id || detalle.producto?.id} className="flex items-center justify-between gap-4 border-b border-rose-100 pb-3">
              <span className="text-rose-950">{detalle.producto?.nombre || `Producto #${detalle.producto?.id}`} x {detalle.cantidad}</span>
              <div className="flex items-center gap-3"><strong className="text-amber-800">{money(detalle.subtotal || detalle.precioUnitario * detalle.cantidad)}</strong>{pendiente && <button onClick={() => onEliminarProducto(compra, detalle)} className="rounded-lg p-1.5 text-rose-700 hover:bg-rose-50" title="Eliminar producto"><Trash2 className="w-4 h-4" /></button>}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-rose-100 flex justify-between font-extrabold text-rose-950">
          <span>Total</span><span>{money(compra.total)}</span>
        </div>

        {pendiente && (
          <div className="mt-6 space-y-3">
            <button onClick={() => onAgregarProductos(compra)} className="w-full inline-flex justify-center items-center gap-2 rounded-xl border border-amber-700 bg-white px-4 py-3 text-amber-800 font-bold hover:bg-amber-50">
              <PackagePlus className="w-5 h-5" /> Agregar productos
            </button>
            <button onClick={() => onTerminarCompra(compra)} className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-amber-700 hover:bg-amber-600 px-4 py-3 text-white font-bold">
              <CreditCard className="w-5 h-5" /> Terminar compra
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}

export const MisCompras = ({ user, setVistaActual, onTerminarCompra, onAgregarProductos }) => {
  const [compras, setCompras] = useState([])
  const [error, setError] = useState('')
  const [seleccionada, setSeleccionada] = useState(null)

  const eliminarProducto = async (compra, detalle) => {
    if (!window.confirm(`¿Eliminar ${detalle.producto?.nombre || 'este producto'} de la compra? El stock se devolverá al almacén.`)) return
    try {
      const actualizada = await apiService.eliminarProductoDeVenta(compra.id, detalle.id)
      setCompras((actuales) => actuales.map((venta) => venta.id === actualizada.id ? actualizada : venta))
      setSeleccionada(actualizada)
    } catch (err) {
      alert(err.message || 'No se pudo eliminar el producto de la compra.')
    }
  }

  const eliminarCompraPendiente = async (compra) => {
    if (!window.confirm(`¿Eliminar la compra pendiente #${compra.id}? Sus productos se devolverán al almacén.`)) return
    try {
      await apiService.eliminarVenta(compra.id)
      setCompras((actuales) => actuales.filter((venta) => venta.id !== compra.id))
      if (seleccionada?.id === compra.id) setSeleccionada(null)
    } catch (err) {
      alert(err.message || 'No se pudo eliminar la compra pendiente.')
    }
  }

  useEffect(() => {
    apiService.getVentas()
      .then((ventas) => setCompras((Array.isArray(ventas) ? ventas : []).filter((venta) => venta.cliente?.email === user?.email || venta.cliente?.email === user?.username)))
      .catch((err) => setError(err.message || 'No se pudieron cargar las compras.'))
  }, [user?.email, user?.username])

  if (user?.role !== 'ROLE_CLIENTE') return <div className="max-w-5xl mx-auto px-4 py-12 text-center text-rose-900">Esta vista es exclusiva para clientes.</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl border border-rose-100 overflow-hidden shadow-sm">
        <header className="bg-gradient-to-r from-rose-950 via-amber-900 to-amber-600 text-amber-100 p-6 flex items-center gap-3">
          <ReceiptText className="text-amber-300" />
          <div><h1 className="font-extrabold text-xl">Mis compras</h1><p className="text-sm text-amber-100">Consulta el historial, agrega productos y termina tus pedidos pendientes.</p></div>
        </header>
        <div className="p-6">
          {error && <p className="text-rose-700">{error}</p>}
          {!error && compras.length === 0 && <p className="text-rose-700">Aun no tienes compras registradas.</p>}
          {compras.map((compra) => {
            const pendiente = compra.estadoPago !== 'PAGADO'
            return <article key={compra.id} className="border-b border-rose-100 py-4 flex flex-wrap items-center justify-between gap-4">
              <div><p className="font-bold text-rose-950">Compra #{compra.id}</p><p className="text-sm text-rose-700">{compra.fecha ? new Date(compra.fecha).toLocaleString('es-MX') : 'Fecha no disponible'}</p></div>
              <div className="flex items-center gap-3"><div className="text-right"><p className="font-bold text-amber-800">{money(compra.total)}</p><p className={`text-xs font-bold ${pendiente ? 'text-amber-700' : 'text-green-600'}`}>{compra.estadoPago || 'PENDIENTE'}</p></div>{pendiente && <button onClick={() => onTerminarCompra(compra)} className="inline-flex items-center gap-1 rounded-lg bg-amber-700 px-3 py-2 text-white font-bold text-sm"><CreditCard className="w-4 h-4" />Terminar</button>}{pendiente && <button onClick={() => eliminarCompraPendiente(compra)} className="p-2 rounded-lg text-rose-700 hover:bg-rose-50" title="Eliminar compra pendiente"><Trash2 className="w-5 h-5" /></button>}<button onClick={() => setSeleccionada(compra)} className="p-2 rounded-lg text-amber-800 hover:bg-amber-100" title="Ver detalle"><Eye className="w-5 h-5" /></button></div>
            </article>
          })}
          <button onClick={() => setVistaActual('catalogo')} className="mt-6 px-4 py-2 rounded-xl bg-amber-700 text-white font-bold">Volver al catalogo</button>
        </div>
      </div>
      {seleccionada && <DetalleCompra compra={seleccionada} cerrar={() => setSeleccionada(null)} onTerminarCompra={onTerminarCompra} onAgregarProductos={onAgregarProductos} onEliminarProducto={eliminarProducto} />}
    </div>
  )
}
