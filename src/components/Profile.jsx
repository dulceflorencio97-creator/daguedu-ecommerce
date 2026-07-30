import { useState } from 'react';
import { Edit3, Save, X } from 'lucide-react';
import { apiService } from '../services/apiService';

export const Profile = ({ user, onLogout, setVistaActual, onUserUpdated }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    nombre: user?.nombre || '',
    email: user?.email || user?.username || '',
    telefono: user?.telefono || '',
    direccion: user?.direccion || '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  if (!user) return <div className="max-w-3xl mx-auto px-4 py-12 text-center"><h2 className="text-2xl font-bold">No hay sesión activa</h2><button onClick={() => setVistaActual('login')} className="mt-5 px-5 py-2 rounded-xl bg-amber-700 text-white font-bold">Iniciar sesión</button></div>;

  const roleLabel = user.role === 'ROLE_ADMIN' ? 'Administrador' : 'Cliente';
  const update = (field) => (event) => setForm((actual) => ({ ...actual, [field]: event.target.value }));
  const cancelar = () => { setForm({ nombre: user.nombre || '', email: user.email || user.username || '', telefono: user.telefono || '', direccion: user.direccion || '' }); setEditing(false); setError(''); };

  const guardar = async (event) => {
    event.preventDefault(); setSaving(true); setError(''); setMessage('');
    try {
      const updated = await apiService.actualizarPerfil(form);
      const nextUser = { ...user, nombre: updated.nombre, email: updated.email, telefono: updated.telefono || '', direccion: updated.direccion || '' };
      onUserUpdated(nextUser);
      setMessage('Tus datos se guardaron correctamente.'); setEditing(false);
    } catch (err) { setError(err.message || 'No se pudo actualizar el perfil.'); }
    finally { setSaving(false); }
  };

  return <div className="max-w-3xl mx-auto px-4 py-12"><div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-rose-100"><header className="bg-gradient-to-r from-rose-950 via-amber-900 to-amber-600 px-6 py-8 text-white"><p className="text-sm uppercase tracking-[0.25em] text-amber-200">Perfil de usuario</p><h2 className="mt-2 text-3xl font-extrabold">{user.nombre || user.username}</h2><p className="mt-1 text-amber-100">{roleLabel}</p></header><div className="p-6">{message && <p className="mb-4 rounded-xl bg-green-50 border border-green-200 p-3 text-green-700">{message}</p>}{error && <p className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-red-700">{error}</p>}{editing ? <form onSubmit={guardar} className="grid md:grid-cols-2 gap-4"><Campo label="Nombre" value={form.nombre} onChange={update('nombre')} required /><Campo label="Correo" value={form.email} disabled help="El correo identifica tu cuenta y no se modifica." /><Campo label="Teléfono" value={form.telefono} onChange={update('telefono')} /><Campo label="Dirección" value={form.direccion} onChange={update('direccion')} /><div className="md:col-span-2 flex gap-3 pt-2"><button disabled={saving} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-700 text-white font-bold"><Save className="w-4 h-4" />{saving ? 'Guardando...' : 'Guardar cambios'}</button><button type="button" onClick={cancelar} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-300 font-bold"><X className="w-4 h-4" />Cancelar</button></div></form> : <><div className="grid md:grid-cols-2 gap-4"><Dato label="Nombre" value={user.nombre} /><Dato label="Correo" value={user.email || user.username} /><Dato label="Rol" value={roleLabel} /><Dato label="Estado" value="Activo" green /><Dato label="Teléfono" value={user.telefono || 'Sin teléfono registrado'} /><Dato label="Dirección" value={user.direccion || 'Sin dirección registrada'} /></div><div className="flex flex-wrap gap-3 pt-6"><button onClick={() => setEditing(true)} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold"><Edit3 className="w-4 h-4" />Editar perfil</button><button onClick={() => setVistaActual('catalogo')} className="px-5 py-3 rounded-xl bg-rose-950 text-white font-bold">Volver al catálogo</button><button onClick={() => { onLogout(); setVistaActual('catalogo'); }} className="px-5 py-3 rounded-xl border border-gray-300 font-bold">Cerrar sesión</button></div></>}</div></div></div>;
};

const Dato = ({ label, value, green }) => <div className="bg-rose-50 rounded-xl p-4 border border-rose-100"><p className="text-sm text-gray-500">{label}</p><p className={`mt-1 font-bold break-words ${green ? 'text-green-600' : 'text-rose-950'}`}>{value}</p></div>;
const Campo = ({ label, value, onChange, required, disabled, help }) => <label className="block"><span className="text-sm font-bold text-rose-950">{label}</span><input value={value} onChange={onChange} required={required} disabled={disabled} className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-100" />{help && <small className="text-gray-500">{help}</small>}</label>;
