import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'
import { MensajeError } from '../componentes/comunes/MensajeError'
import { NOMBRE_CLINICA } from '../utilidades/constantes'
import * as authService from '../api/authService'

export default function RecuperarPassword() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) {
      setError('Ingrese su correo electrónico.')
      return
    }
    setCargando(true)
    try {
      await authService.recuperarPassword(email.trim())
    } catch {
      // Respuesta idéntica exista o no el correo (anti-enumeración)
    } finally {
      setEnviado(true)
      setCargando(false)
    }
  }

  if (enviado) {
    return (
        <div className="min-h-screen bg-canvas flex flex-col justify-center items-center p-4 text-ink">
          <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-2xl border border-line shadow-sm text-center">
          <span className="w-11 h-11 rounded-xl bg-brand-700 flex items-center justify-center text-white mx-auto">
            <Mail className="w-6 h-6" />
          </span>
            <h1 className="mt-6 text-xl font-semibold tracking-[-0.01em]">Correo enviado</h1>
            <p className="mt-3 text-sm text-muted leading-6">
              Si existe una cuenta con ese correo, recibirá un enlace para restablecer su contraseña en los próximos minutos.
            </p>
            <Link to="/login" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800 underline underline-offset-2">
              <ArrowLeft className="w-4 h-4" /> Volver al inicio de sesión
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

          <h1 className="mt-6 text-xl font-semibold tracking-[-0.01em] text-center">Recuperar contraseña</h1>
          <p className="mt-1.5 text-sm text-muted text-center">Ingrese su correo para recibir un enlace de restablecimiento.</p>

          <form onSubmit={handleSubmit} noValidate className="mt-8">
            <MensajeError mensaje={error} />

            <div className="mb-6">
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink mb-2">Correo electrónico</label>
              <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted pointer-events-none">
                <Mail className="w-5 h-5" />
              </span>
                <input id="email" type="email" autoComplete="email" value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       className="w-full rounded-lg border border-line bg-white pl-10 pr-3 py-2.5 text-sm text-ink placeholder:text-slate-400 focus:border-brand-700 focus:ring-2 focus:ring-brand-700 focus:outline-none"
                       placeholder="nombre@correo.com" disabled={cargando} />
              </div>
            </div>

            <button type="submit" disabled={cargando}
                    className="w-full rounded-lg bg-brand-700 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-brand-800 active:bg-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2 disabled:opacity-50">
              {cargando ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </form>

          <p className="mt-8 text-sm text-muted text-center">
            <Link to="/login" className="font-semibold text-brand-700 hover:text-brand-800 underline underline-offset-2">
              Volver al inicio de sesión
            </Link>
          </p>
        </div>
      </div>
  )
}
