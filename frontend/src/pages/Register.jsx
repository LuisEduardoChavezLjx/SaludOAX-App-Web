import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import { validarFormularioAcceso, tieneErrores } from '../utilidades/validaciones'
import { MensajeError } from '../componentes/comunes/MensajeError'
import { NOMBRE_CLINICA, RUTA_ILUSTRACION_REGISTRO } from '../utilidades/constantes'

export default function Register() {
  const { register, estaAutenticado } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [mostrarContrasena, setMostrarContrasena] = useState(false)
  const [errores, setErrores] = useState({})
  const [errorServidor, setErrorServidor] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorServidor('')

    const erroresValidacion = validarFormularioAcceso({ email, contrasena })
    setErrores(erroresValidacion)

    if (tieneErrores(erroresValidacion)) return

    setCargando(true)
    try {
      await register(email.trim(), contrasena, 'PACIENTE')
      navigate('/salud')
    } catch (err) {
      setErrorServidor(err.message || 'No se pudo crear la cuenta. Intenta de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  const handleBlurEmail = () => {
    const err = validarFormularioAcceso({ email, contrasena: '' })
    setErrores((prev) => ({ ...prev, email: err.email || undefined }))
  }

  const handleBlurContrasena = () => {
    const err = validarFormularioAcceso({ email: '', contrasena })
    setErrores((prev) => ({ ...prev, contrasena: err.contrasena || undefined }))
  }

  if (estaAutenticado) {
    return null
  }

  return (
    <div className="min-h-screen flex">
      <aside className="hidden lg:flex lg:w-1/2 items-center justify-center p-10 bg-crema-oscuro relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-salvia)_0%,_transparent_70%)] opacity-30" />
        <img
          src={RUTA_ILUSTRACION_REGISTRO}
          alt={`${NOMBRE_CLINICA} - Registro`}
          className="relative max-w-md h-auto drop-shadow-2xl"
        />
      </aside>

      <main className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-texto">{NOMBRE_CLINICA}</h1>
            <p className="mt-2 text-texto-suave">Crea tu cuenta de paciente</p>
          </div>

          <div className="superficie p-8">
            <form onSubmit={handleSubmit} noValidate>
              <MensajeError mensaje={errorServidor} />

              <div className="mb-5">
                <label htmlFor="email" className="block text-sm font-medium text-texto mb-1.5">
                  Correo electronico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-texto-suave" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleBlurEmail}
                    className="campo-hundido w-full pl-10 pr-4 py-3 text-texto placeholder-texto-suave border-none focus:outline-none focus:ring-2 focus:ring-verde"
                    placeholder="nombre@correo.com"
                    disabled={cargando}
                    aria-invalid={!!errores.email}
                    aria-describedby={errores.email ? 'email-error' : undefined}
                  />
                </div>
                {errores.email && (
                  <p id="email-error" className="mt-1.5 text-sm text-peligro" role="alert">
                    {errores.email}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label htmlFor="contrasena" className="block text-sm font-medium text-texto mb-1.5">
                  Contrasena
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-texto-suave" />
                  <input
                    id="contrasena"
                    type={mostrarContrasena ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    onBlur={handleBlurContrasena}
                    className="campo-hundido w-full pl-10 pr-12 py-3 text-texto placeholder-texto-suave border-none focus:outline-none focus:ring-2 focus:ring-verde"
                    placeholder="********"
                    disabled={cargando}
                    aria-invalid={!!errores.contrasena}
                    aria-describedby={errores.contrasena ? 'contrasena-error' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarContrasena(!mostrarContrasena)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-texto-suave hover:text-texto transition-colors"
                    aria-label={mostrarContrasena ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                    aria-pressed={mostrarContrasena}
                  >
                    {mostrarContrasena ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errores.contrasena && (
                  <p id="contrasena-error" className="mt-1.5 text-sm text-peligro" role="alert">
                    {errores.contrasena}
                  </p>
                )}
                <p className="mt-2 text-xs text-texto-suave">
                  Minimo 8 caracteres, una mayuscula, un numero y un caracter especial.
                </p>
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="boton-primario w-full py-3.5 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-texto-suave">
              Ya tienes cuenta?{' '}
              <Link to="/login" className="font-medium text-verde hover:text-verde-oscuro underline underline-offset-2">
                Inicia sesion
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}