import { useState } from 'react'
import { CheckCircle, PackagePlus, AlertCircle } from 'lucide-react'
import { apiService } from '../services/apiService'

export const NuevoProducto = ({ user, setVistaActual }) => {
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', stock: '', imagenUrl: '' })
  const [estado, setEstado] = useState({ error: '', exito: '', cargando: false })

  if (user?.role !== 'ROLE_ADMIN') return <div className="max-w-4xl mx-auto px-4 py-12 text-center text-rose-900">Esta vista es exclusiva para administradores.</div>

  const cambiar = (evento) => setForm({ ...form, [evento.target.name]: evento.target.value })
  const guardar = async (evento) => {
    evento.preventDefault()
    setEstado({ error: '', exito: '', cargando: true })
    try {
      await apiService.crearProducto({ ...form, precio: Number(form.precio), stock: Number(form.stock) })
      setEstado({ error: '', exito: 'Producto agregado correctamente.', cargando: false })
      setForm({ nombre: '', descripcion: '', precio: '', stock: '', imagenUrl: '' })
    } catch (error) {
      setEstado({ error: error.message || 'No se pudo agregar el producto.', exito: '', cargando: false })
    }
  }

  return <div className="max-w-2xl mx-auto px-4 py-10"><div className="bg-white rounded-3xl overflow-hidden border border-rose-100 shadow-[0_20px_60px_-30px_rgba(112,33,18,0.8)]"><header className="bg-gradient-to-r from-rose-950 via-amber-900 to-amber-600 p-7 text-white"><div className="flex gap-2 items-center"><PackagePlus /><span className="font-bold">Administración</span></div><h1 className="text-2xl font-extrabold mt-2">Agregar nuevo producto</h1></header><form onSubmit={guardar} className="p-6 grid gap-4">{estado.error && <p className="p-3 rounded-xl bg-rose-50 text-rose-700 flex gap-2"><AlertCircle className="w-5 h-5" />{estado.error}</p>}{estado.exito && <p className="p-3 rounded-xl bg-green-50 text-green-700 flex gap-2"><CheckCircle className="w-5 h-5" />{estado.exito}</p>}<input required name="nombre" value={form.nombre} onChange={cambiar} placeholder="Nombre del producto" className="p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-amber-500" /><textarea name="descripcion" value={form.descripcion} onChange={cambiar} placeholder="Descripción" className="p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-amber-500" /><div className="grid grid-cols-2 gap-4"><input required min="0" step="0.01" type="number" name="precio" value={form.precio} onChange={cambiar} placeholder="Precio" className="p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-amber-500" /><input required min="0" type="number" name="stock" value={form.stock} onChange={cambiar} placeholder="Stock" className="p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-amber-500" /></div><input name="imagenUrl" type="url" value={form.imagenUrl} onChange={cambiar} placeholder="URL de imagen (opcional)" className="p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-amber-500" /><div className="flex gap-3"><button disabled={estado.cargando} className="grow py-3 rounded-xl bg-amber-700 hover:bg-amber-600 disabled:bg-rose-200 text-white font-bold">{estado.cargando ? 'Guardando...' : 'Guardar producto'}</button><button type="button" onClick={() => setVistaActual('admin-panel')} className="px-4 rounded-xl border border-rose-200 text-rose-800 font-bold">Volver</button></div></form></div></div>
}
