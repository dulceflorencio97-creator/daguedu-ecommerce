import { useState } from 'react'
import Catalogo from './components/Catalogo'
import Footer from './components/Footer'
import { Navbar } from './components/Navbar'
import { Registro } from './components/registro'
import { Login } from './components/Login'
import { Profile } from './components/Profile'
import { AdminPanel } from './components/AdminPanel'
import { ClientePanel } from './components/ClientePanel'
import { CartDrawer } from './components/CartDrawer'
import { NuevoProducto } from './components/NuevoProducto'
import { AdminConsulta } from './components/AdminConsulta'
import { AdminProductos } from './components/AdminProductos'
import { CheckoutForm } from './components/CheckoutForm'
import { MisCompras } from './components/MisCompras'
import { AdminClientes } from './components/AdminClientes'
import { AdminProveedores } from './components/AdminProveedores'
import { apiService } from './services/apiService'

function App() {
  const [vistaActual, setVistaActual] = useState('catalogo')
  const [user, setUser] = useState(() => {
    if (apiService.isAuthenticated()) {
      return {
        username: localStorage.getItem('username') || '',
        nombre: localStorage.getItem('nombre') || localStorage.getItem('username') || '',
        email: localStorage.getItem('email') || localStorage.getItem('username') || '',
        direccion: localStorage.getItem('direccion') || '',
        telefono: localStorage.getItem('telefono') || '',
        role: (() => {
          const rol = localStorage.getItem('rol') || localStorage.getItem('role') || 'ROLE_CLIENTE'
          return rol.startsWith('ROLE_') ? rol : `ROLE_${rol}`
        })()
      }
    }

    return null
  })
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [ventaActiva, setVentaActiva] = useState(null)
  const [ventaPendienteEdicion, setVentaPendienteEdicion] = useState(null)
  const [adminSubtab, setAdminSubtab] = useState('productos')
  const [listaCarOpen, setlistaCarOpen] = useState(false)
  const [guardandoPendiente, setGuardandoPendiente] = useState(false)
  const [carCount, setCarCount] = useState(0)
  const cantidadCarrito = cart.reduce((total, item) => total + item.cantidad, 0)

  const handleLogSucces = (userData) => {
    const normalizedUser = {
      username: userData.username || userData.nombre || '',
      nombre: userData.nombre || userData.username || '',
      email: userData.email || userData.username || '',
      direccion: userData.direccion || '',
      telefono: userData.telefono || '',
      role: (() => {
        const rol = userData.role || userData.rol || 'ROLE_CLIENTE'
        return rol.startsWith('ROLE_') ? rol : `ROLE_${rol}`
      })()
    }

    setUser(normalizedUser)

    if (normalizedUser.role === 'ROLE_ADMIN') {
      setVistaActual('admin-panel')
    } else {
      setVistaActual('cliente-panel')
    }
  }

  const handLeLogout = () => {
    apiService.LogOut()
    setUser(null)
    setCart([])
    setIsCartOpen(false)
    setCarCount(0)
    setlistaCarOpen(false)
  }

  const actualizarUsuarioActivo = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('nombre', updatedUser.nombre || '')
    localStorage.setItem('email', updatedUser.email || updatedUser.username || '')
    localStorage.setItem('telefono', updatedUser.telefono || '')
    localStorage.setItem('direccion', updatedUser.direccion || '')
  }

  const terminarCompraPendiente = (venta) => {
    setVentaActiva(venta)
    setVistaActual('checkout')
  }

  const agregarProductosACompraPendiente = (venta) => {
    setVentaPendienteEdicion(venta)
    setCart([])
    setVistaActual('catalogo')
  }

  const agregarACarrito = (producto) => {
    if (!user) { setVistaActual('login'); return }
    if (user.role !== 'ROLE_CLIENTE') return
    setCart((actual) => {
      const existe = actual.find((item) => item.id === producto.id)
      if (existe) return actual.map((item) => item.id === producto.id ? { ...item, cantidad: Math.min(item.cantidad + 1, producto.stock) } : item)
      return [...actual, { ...producto, cantidad: 1 }]
    })
    setlistaCarOpen(true)
  }

  const cambiarCantidad = (id, cantidad) => {
    setCart((actual) => actual.map((item) => item.id === id ? { ...item, cantidad: Math.max(1, Math.min(cantidad, item.stock)) } : item))
  }

  const eliminarDelCarrito = (id) => setCart((actual) => actual.filter((item) => item.id !== id))

  const iniciarCheckout = async () => {
    try {
      const detalles = cart.map((item) => ({ producto: { id: item.id }, cantidad: item.cantidad }))
      const venta = ventaPendienteEdicion
        ? (detalles.length ? await apiService.agregarProductosVenta(ventaPendienteEdicion.id, detalles) : ventaPendienteEdicion)
        : await apiService.procesarVenta({ detalles }, user.username)
      setVentaActiva(venta)
      setCart([])
      setVentaPendienteEdicion(null)
      setlistaCarOpen(false)
      setVistaActual('checkout')
    } catch (error) {
      alert(error.message || 'No se pudo registrar la compra.')
    }
  }

  const cerrarYGuardarPendiente = async () => {
    if (guardandoPendiente) return
    if (!cart.length) {
      setlistaCarOpen(false)
      setVentaPendienteEdicion(null)
      return
    }

    try {
      setGuardandoPendiente(true)
      const detalles = cart.map((item) => ({ producto: { id: item.id }, cantidad: item.cantidad }))
      const venta = ventaPendienteEdicion
        ? await apiService.agregarProductosVenta(ventaPendienteEdicion.id, detalles)
        : await apiService.procesarVenta({ detalles }, user.username)
      setVentaActiva(venta)
      setCart([])
      setVentaPendienteEdicion(null)
      setlistaCarOpen(false)
    } catch (error) {
      alert(error.message || 'No se pudo guardar la compra pendiente.')
    } finally {
      setGuardandoPendiente(false)
    }
  }

  const _stateRefs = {
    cart,
    setCart,
    isCartOpen,
    setIsCartOpen,
    ventaActiva,
    setVentaActiva,
    adminSubtab,
    setAdminSubtab,
    listaCarOpen,
    setlistaCarOpen,
    carCount,
    setCarCount,
    handleLogSucces
  }
  void _stateRefs

  const vistaContenido = () => {
    switch (vistaActual) {
      case 'register':
        return <Registro onRegisterSuccess={() => setVistaActual('login')} onGoToLogin={() => setVistaActual('login')} />
      case 'login':
        return <Login onLoginSuccess={handleLogSucces} onGoToRegister={() => setVistaActual('register')} />
      case 'profile':
        return <Profile user={user} onLogout={handLeLogout} setVistaActual={setVistaActual} onUserUpdated={actualizarUsuarioActivo} />
      case 'admin-panel':
        return <AdminPanel user={user} setVistaActual={setVistaActual} />
      case 'nuevo-producto':
        return <NuevoProducto user={user} setVistaActual={setVistaActual} />
      case 'admin-productos':
        return <AdminProductos user={user} setVistaActual={setVistaActual} />
      case 'admin-categorias':
        return <AdminConsulta user={user} tipo="categorias" setVistaActual={setVistaActual} />
      case 'admin-ventas':
        return <AdminConsulta user={user} tipo="ventas" setVistaActual={setVistaActual} />
      case 'admin-clientes':
        return <AdminClientes user={user} setVistaActual={setVistaActual} />
      case 'admin-proveedores':
        return <AdminProveedores user={user} setVistaActual={setVistaActual} />
      case 'checkout':
        return <CheckoutForm ventaActiva={ventaActiva} setCurrentTab={setVistaActual} />
      case 'compras':
        return <MisCompras user={user} setVistaActual={setVistaActual} onTerminarCompra={terminarCompraPendiente} onAgregarProductos={agregarProductosACompraPendiente} />
      case 'cliente-panel':
      case 'miscompras':
        return <ClientePanel user={user} setVistaActual={setVistaActual} openCart={() => setlistaCarOpen(true)} />
      case 'catalogo':
      default:
        return <Catalogo setVistaActual={setVistaActual} user={user} cart={cart} agregarACarrito={agregarACarrito} compraEnEdicion={ventaPendienteEdicion} />
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 antialiased">
      <Navbar
        vistaActual={vistaActual}
        setVistaActual={setVistaActual}
        user={user}
        onLogout={handLeLogout}
        carCount={cantidadCarrito}
        openCart={() => setlistaCarOpen(true)}
      />

      <main className="grow pb-12">
        {vistaContenido()}
      </main>
      <CartDrawer abierto={listaCarOpen} items={cart} onClose={cerrarYGuardarPendiente} onCantidad={cambiarCantidad} onEliminar={eliminarDelCarrito} onCheckout={iniciarCheckout} guardando={guardandoPendiente} compraEnEdicion={ventaPendienteEdicion} />
      <Footer />
    </div>
  )
}

export default App
