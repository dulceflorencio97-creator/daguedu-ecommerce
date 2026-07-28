export const Profile = ({ user, onLogout, setVistaActual }) => {
  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800">No hay sesión activa</h2>
          <p className="mt-3 text-gray-600">Inicia sesión para ver tu perfil.</p>
          <button
            onClick={() => setVistaActual('login')}
            className="mt-6 px-5 py-2 rounded-lg bg-amber-600 text-white font-semibold"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  const roleLabel = user.role === 'ROLE_ADMIN' ? 'Administrador' : 'Cliente';

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-rose-950 px-6 py-8 text-amber-100">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Perfil de usuario</p>
          <h2 className="mt-2 text-3xl font-bold">{user.nombre || user.username}</h2>
          <p className="mt-2 text-amber-200">{user.username}</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">Nombre</p>
              <p className="font-semibold text-gray-800">{user.nombre || 'Sin nombre'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">Usuario</p>
              <p className="font-semibold text-gray-800">{user.username}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">Rol</p>
              <p className="font-semibold text-gray-800">{roleLabel}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">Estado</p>
              <p className="font-semibold text-green-600">Activo</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => setVistaActual('catalogo')}
              className="px-4 py-2 rounded-lg bg-amber-600 text-white font-semibold"
            >
              Volver al catálogo
            </button>
            <button
              onClick={() => {
                onLogout();
                setVistaActual('catalogo');
              }}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
