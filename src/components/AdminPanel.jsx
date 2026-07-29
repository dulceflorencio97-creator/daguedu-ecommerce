import { Boxes, Building2, ClipboardList, LayoutDashboard, Tags, Users } from 'lucide-react'

export const AdminPanel = ({ user, setVistaActual }) => {
  if (user?.role !== 'ROLE_ADMIN') {
    return <div className="max-w-5xl mx-auto px-4 py-12 text-center text-rose-900">Esta vista es exclusiva para administradores.</div>
  }

  const opciones = [
    { icon: Boxes, titulo: 'Productos', texto: 'Lista, consulta detalles y agrega productos.', vista: 'admin-productos' },
    { icon: Tags, titulo: 'Categorías', texto: 'Consulta las categorías registradas.', vista: 'admin-categorias' },
    { icon: ClipboardList, titulo: 'Ventas', texto: 'Lista y consulta el detalle de las compras realizadas.', vista: 'admin-ventas' },
    { icon: Users, titulo: 'Clientes', texto: 'Consulta clientes y sus compras realizadas.', vista: 'admin-clientes' },
    { icon: Building2, titulo: 'Proveedores', texto: 'Consulta los proveedores registrados.', vista: 'admin-proveedores' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <section className="bg-gradient-to-r from-rose-950 via-amber-900 to-amber-600 rounded-3xl p-8 text-white shadow-[0_20px_60px_-30px_rgba(112,33,18,0.8)]">
        <div className="flex items-center gap-3 text-amber-200"><LayoutDashboard className="w-6 h-6" /><span className="text-sm font-bold uppercase tracking-wider">Área privada</span></div>
        <h1 className="mt-3 text-3xl font-extrabold">Panel de administración</h1>
        <p className="mt-2 text-amber-100">Sesión de administrador: {user.username}</p>
      </section>

      <div className="grid md:grid-cols-3 gap-5 mt-7">
        {opciones.map(({ icon: Icon, titulo, texto, vista }) => (
          <button key={titulo} onClick={() => setVistaActual(vista)} className="text-left bg-white rounded-2xl border border-rose-100 p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all">
            <Icon className="w-8 h-8 text-amber-700" />
            <h2 className="mt-4 font-bold text-rose-950">{titulo}</h2>
            <p className="mt-1 text-sm text-rose-700">{texto}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
