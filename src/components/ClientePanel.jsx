import { PackageCheck, ReceiptText, ShoppingBag, ShoppingCart, UserCircle2 } from 'lucide-react'

export const ClientePanel = ({ user, setVistaActual, openCart }) => {
  if (user?.role !== 'ROLE_CLIENTE') {
    return <div className="max-w-5xl mx-auto px-4 py-12 text-center text-rose-900">Esta vista es exclusiva para clientes.</div>
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <section className="bg-gradient-to-r from-rose-950 via-amber-900 to-amber-600 rounded-3xl p-8 text-white shadow-[0_20px_60px_-30px_rgba(112,33,18,0.8)]">
        <div className="flex items-center gap-3 text-amber-200"><UserCircle2 className="w-6 h-6" /><span className="text-sm font-bold uppercase tracking-wider">Área privada</span></div>
        <h1 className="mt-3 text-3xl font-extrabold">Hola, {user.nombre || user.username}</h1>
        <p className="mt-2 text-amber-100">Cuenta de cliente: {user.username}</p>
      </section>

      <div className="grid md:grid-cols-2 gap-5 mt-7">
        <button onClick={() => setVistaActual('catalogo')} className="text-left bg-white rounded-2xl border border-rose-100 p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all">
          <ShoppingBag className="w-8 h-8 text-amber-700" />
          <h2 className="mt-4 font-bold text-rose-950">Explorar catálogo</h2>
          <p className="mt-1 text-sm text-rose-700">Consulta los productos disponibles y realiza tus compras.</p>
        </button>
        <button onClick={() => setVistaActual('profile')} className="text-left bg-white rounded-2xl border border-rose-100 p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all">
          <PackageCheck className="w-8 h-8 text-amber-700" />
          <h2 className="mt-4 font-bold text-rose-950">Mi perfil</h2>
          <p className="mt-1 text-sm text-rose-700">Consulta el correo y rol de tu sesión.</p>
        </button>
        <button onClick={openCart} className="text-left bg-white rounded-2xl border border-rose-100 p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all">
          <ShoppingCart className="w-8 h-8 text-amber-700" />
          <h2 className="mt-4 font-bold text-rose-950">Mi carrito</h2>
          <p className="mt-1 text-sm text-rose-700">Consulta los productos que agregaste para comprar.</p>
        </button>
        <button onClick={() => setVistaActual('compras')} className="text-left bg-white rounded-2xl border border-rose-100 p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all">
          <ReceiptText className="w-8 h-8 text-amber-700" />
          <h2 className="mt-4 font-bold text-rose-950">Mis compras</h2>
          <p className="mt-1 text-sm text-rose-700">Revisa el historial y el detalle de tus compras.</p>
        </button>
      </div>
    </div>
  )
}
