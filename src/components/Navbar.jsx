import { ShoppingBag, ShoppingCart, ListOrdered, UserCircle2 } from "lucide-react"

export const Navbar = ({ vistaActual, setVistaActual, user, onLogout, carCount, openCart }) => {
    const isClient = user && user.role === 'ROLE_CLIENTE'
    const isAdmin = user && user.role === 'ROLE_ADMIN'

    return (
        <nav className="sticky top-0 z-50 bg-rose-950 text-amber-100 shadow-[0_10px_30px_-10px_rgba(112,33,18,0.75)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => setVistaActual('catalogo')}
                    >
                        <ShoppingBag className="h-8 w-8 text-amber-200 animate-pulse" />
                        <span className="ml-2 font-bold text-lg">DAGUEDU</span>
                    </div>

                    <div className="flex items-center space-x-3 flex-wrap justify-end">
                        <button onClick={() => setVistaActual('catalogo')}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-amber-700 ${vistaActual === 'catalogo' ? 'bg-amber-900 font-bold border-b-2 border-white text-white' : 'bg-amber-500 text-rose-950'}`}>
                            Catálogo
                        </button>

                        {isClient && (
                            <button onClick={() => setVistaActual('cliente-panel')}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-amber-700 ${vistaActual === 'cliente-panel' ? 'bg-amber-900 font-bold border-b-2 border-white text-white' : 'bg-amber-500 text-rose-950'}`} >
                                <span className="flex items-center gap-2">
                                    <ListOrdered className="w-4 h-4" />
                                    Mi cuenta
                                </span>
                            </button>
                        )}

                        {isAdmin && (
                            <button onClick={() => setVistaActual('admin-panel')}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-amber-700 ${vistaActual === 'admin-panel' ? 'bg-amber-900 font-bold border-b-2 border-white text-white' : 'bg-amber-500 text-rose-950'}`} >
                                <span className="flex items-center gap-2">
                                    <ListOrdered className="w-4 h-4" />
                                    Admin Panel
                                </span>
                            </button>
                        )}

                        {user ? (
                            <>
                                <button
                                    onClick={() => setVistaActual('profile')}
                                    className="flex items-center text-left text-sm font-medium bg-amber-900 px-3 py-1.5 rounded-full border border-amber-700 gap-2 max-w-64"
                                >
                                    <UserCircle2 className="w-4 h-4 text-amber-100 flex shrink-0" />
                                    <span className="min-w-0 leading-tight">
                                        <span className="block truncate text-amber-50">{user.username || user.nombre}</span>
                                        <span className="block text-xs text-amber-200">{isAdmin ? 'Administrador' : 'Cliente'}</span>
                                    </span>
                                </button>

                                {isClient && (
                                    <button onClick={openCart}
                                        className="relative p-2 rounded-full bg-amber-700 hover:bg-amber-600 transition-colors cursor-pointer group">
                                        <ShoppingCart className="w-6 h-6 text-rose-950 group-hover:text-rose-900" />
                                        {carCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold border border-amber-900">{carCount}</span>
                                        )}
                                    </button>
                                )}

                                <button
                                    onClick={() => {
                                        onLogout()
                                        setVistaActual('catalogo')
                                    }}
                                    className="px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 bg-amber-600 hover:bg-amber-500 text-white"
                                >
                                    Cerrar sesión
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setVistaActual('login')}
                                    className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 bg-amber-500 hover:bg-amber-400 text-rose-950 hover:shadow-lg">
                                    Iniciar Sesión
                                </button>
                                <button onClick={() => setVistaActual('register')}
                                    className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-md">
                                    Registrarse
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
