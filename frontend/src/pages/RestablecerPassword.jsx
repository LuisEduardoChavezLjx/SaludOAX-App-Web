import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { MensajeError } from '../componentes/comunes/MensajeError'
import { NOMBRE_CLINICA } from '../utilidades/constantes'
import * as authService from '../api/authService'

export default function RestablecerPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [contrasena, setContrasena] = useState('')
  const [confirmacion, setConfirmacion] = useState('')
  const [mostrar, setMostrar] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState(false)
  const [cargando, setCargando] = useState(false)

  const validarContrasena = (pass) => {
    if (pass.length < 8) return 'Debe tener al menos 8 caracteres'
    if (!/[A-Z]/.test(pass)) return 'Debe contener una mayúscula'
    if (!/[0-9]/.test(pass)) return 'Debe contener un número'
    if (!/[^A-Za-z0-9]/.test(pass)) return 'Debe contener un caracter especial'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const err = validarContrasena(contrasena)
    if (err) { setError(err); return }
    if (contrasena !== confirmacion) { setError('Las contraseñas no coinciden.'); return }

    setCargando(true)
    try {
      await authService.restablecerPassword(token, contrasena)
      setExito(true)
    } catch (err) {
      setError(err.message || 'El enlace es inválido o ya expiró.')
    } finally {
      setCargando(false)
    }
  }

  if (exito) {
    return (
        <div className="min-h-screen bg-canvas flex flex-col justify-center items-center p-4 text-ink">
          <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-2xl border border-line shadow-sm text-center">
          <span className="w-11 h-11 rounded-xl bg-leve flex items-center justify-center text-white mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </span>
            <h1 className="mt-6 text-xl font-semibold tracking-[-0.01em]">Contraseña actualizada</h1>
            <p className="mt-3 text-sm text-muted leading-6">Su contraseña se ha actualizado correctamente. Ya puede iniciar sesión con su nueva contraseña.</p>
            <Link to="/login" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800 underline underline-offset-2">
              <ArrowLeft className="w-4 h-4" /> Ir al inicio de sesión
            </Link>
          </div>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-canvas flex flex-col justify-center items-center p-4 text-ink">
        <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-2xl border border-line shadow-sm">
          <div className="flex flex-col items-center">
          <span className="w-11 h-11 rounded-xl bg-brand-700 flex items-center justify-center text-white">
            <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none" aria-hidden="true">
              <path d="M13 4h6v9h9v6h-9v9h-6v-9H4v-6h9V4z" fill="currentColor" opacity=".28" />
              <path d="M4 16h5l3-6 4 12 3-6h9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
            <span className="mt-3 text-base font-semibold tracking-tight text-brand-800">{NOMBRE_CLINICA}</span>
          </div>

          <h1 className="mt-6 text-xl font-semibold tracking-[-0.01em] text-center">Restablecer contraseña</h1>
          <p className="mt-1.5 text-sm text-muted text-center">Ingrese su nueva contraseña.</p>

          <form onSubmit={handleSubmit} noValidate className="mt-8">
            <MensajeError mensaje={error} />

            <div className="mb-5">
              <label htmlFor="nueva-pass" className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink mb-2">Nueva contraseña</label>
              <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted pointer-events-none">
                <Lock className="w-5 h-5" />
              </span>
                <input id="nueva-pass" type={mostrar ? 'text' : 'password'} autoComplete="new-password" value={contrasena}
                       onChange={(e) => setContrasena(e.target.value)}
                       className="w-full rounded-lg border border-line bg-white pl-10 pr-11 py-2.5 text-sm text-ink focus:border-brand-700 focus:ring-2 focus:ring-brand-700 focus:outline-none"
                       placeholder="********" disabled={cargando} />
                <button type="button" onClick={() => setMostrar(!mostrar)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-ink"
                        aria-label={mostrar ? 'Ocultar' : 'Mostrar'}>
                  {mostrar ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="mt-2 text-xs text-muted">Mínimo 8 caracteres, una mayúscula, un número y un caracter especial.</p>
            </div>

            <div className="mb-6">
              <label htmlFor="confirmar-pass" className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink mb-2">Confirmar contraseña</label>
              <input id="confirmar-pass" type="password" autoComplete="new-password" value={confirmacion}
                     onChange={(e) => setConfirmacion(e.target.value)}
                     className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink focus:border-brand-700 focus:ring-2 focus:ring-brand-700 focus:outline-none"
                     placeholder="********" disabled={cargando} />
            </div>

            <button type="submit" disabled={cargando}
                    className="w-full rounded-lg bg-brand-700 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-brand-800 active:bg-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2 disabled:opacity-50">
              {cargando ? 'Actualizando...' : 'Actualizar contraseña'}
            </button>
          </form>
        </div>
      </div>
  )
}
