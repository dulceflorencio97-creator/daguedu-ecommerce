import { useState } from 'react';
import { User, Mail, Lock, Phone, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { apiService } from '../services/apiService';

export const Registro = ({ onRegisterSuccess }) => {

    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [rol, setRol] = useState('ROLE_CLIENTE');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const payload = {
            // daguedu1 autentica por username; se guarda el correo como username.
            username: email,
            password,
            nombre,
            email,
            rol,
            direccion,
            telefono,
        };

        try {
            await apiService.registro(payload);
            setSuccess('Registro completado con éxito! Redirigiendo al inicio de sesión...');
            setTimeout(() => {
                onRegisterSuccess();
            }, 2000);
        } catch (err) {
            setError(err.message || 'Error al completar el registro. Intenta con otro correo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg w-full mx-auto my-12 bg-white rounded-3xl shadow-[0_20px_60px_-30px_rgba(112,33,18,0.8)] overflow-hidden border border-rose-100">

            <div className="bg-gradient-to-r from-rose-950 via-amber-900 to-amber-600 px-6 py-7 text-white">
                <h1 className="text-2xl font-extrabold">Crear cuenta</h1>
                <p className="mt-1 text-sm text-amber-100">Elige tu rol y completa tus datos.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">

                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-2.5 border border-red-200 text-sm">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-start gap-2.5 border border-green-200 text-sm">
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span>{success}</span>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            name="nombre"
                            required
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ingresa tu nombre"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300
                            rounded-xl border-rose-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Correo
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="email"
                            name="correo"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Ingresa tu correo"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300
                            rounded-xl border-rose-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contraseña
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="password"
                            name="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Ingresa tu contraseña"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300
                            rounded-xl border-rose-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>
                </div>

                {/* Rol Selector */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rol de usuario
                    </label>
                    <select
                        value={rol}
                        onChange={(e) => setRol(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300
                        rounded-xl border-rose-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                        <option value="ROLE_CLIENTE">Cliente</option>
                        <option value="ROLE_ADMIN">Administrador</option>
                    </select>
                </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Teléfono de contacto
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type="tel"
                                    name="telefono"
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                    placeholder="Ingresa tu teléfono"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300
                                    rounded-xl border-rose-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Dirección
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    name="direccion"
                                    value={direccion}
                                    onChange={(e) => setDireccion(e.target.value)}
                                    placeholder="Ingresa tu dirección"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300
                                    rounded-xl border-rose-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                        </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-amber-700 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition shadow-lg"
                >
                    {loading ? 'Registrando...' : 'Registrarse'}
                </button>

            </form>

        </div>
    );
};


   
