import { useState } from 'react'
import { apiService } from '../services/apiService'
import { Lock, Mail, AlertCircle, CheckCircle } from 'lucide-react'

export const Login = ({ onLoginSuccess, onGoToRegister }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        try {
            const data = await apiService.login(email, password)
            const normalizedUser = {
                username: data.username || email,
                nombre: data.nombre || data.username || email,
                role: (() => {
                    const rol = data.rol || data.role || 'ROLE_CLIENTE'
                    return rol.startsWith('ROLE_') ? rol : `ROLE_${rol}`
                })()
            }

            setSuccess('¡Inicio de sesión exitoso! Redirigiendo...')
            setTimeout(() => {
                onLoginSuccess(normalizedUser)
            }, 1200)
        } catch (err) {
            setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-lg w-full mx-auto my-12 bg-white rounded-3xl shadow-[0_20px_60px_-30px_rgba(112,33,18,0.8)] overflow-hidden border border-rose-100">
            <div className="bg-gradient-to-r from-rose-950 via-amber-900 to-amber-600 px-6 py-7 text-white">
                <h1 className="text-2xl font-extrabold">Bienvenido de nuevo</h1>
                <p className="mt-1 text-sm text-amber-100">Ingresa con tu correo y contraseña.</p>
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
                        Correo electrónico
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="email"
                            name="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="correo@ejemplo.com"
                            className="w-full pl-10 pr-4 py-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                            className="w-full pl-10 pr-4 py-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-amber-700 hover:bg-amber-600 disabled:bg-rose-200 text-white font-bold py-3 rounded-xl transition-colors shadow-lg"
                >
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </button>

                <div className="text-center text-sm text-rose-700">
                    ¿No tienes cuenta?{' '}
                    <button
                        type="button"
                        onClick={onGoToRegister}
                        className="text-amber-800 font-bold hover:underline"
                    >
                        Regístrate
                    </button>
                </div>
            </form>
        </div>
    )
}
