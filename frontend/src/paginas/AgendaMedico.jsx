import { useAuth } from '../context/AuthContext'

export default function AgendaMedico() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-canvas text-ink antialiased flex items-center justify-center">
      <div className="card max-w-lg w-full mx-4 p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-brand-100 flex items-center justify-center mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-brand-700">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
        </div>
        <h1 className="mt-6 text-xl font-semibold tracking-[-0.01em]">Mi agenda</h1>
        <p className="mt-2 text-sm text-muted">
          Bienvenido, {user?.email}. Aquí podrás ver y gestionar tu agenda de citas.
        </p>
        <p className="mt-6 text-xs text-muted">
          Este panel estará disponible cuando el backend de médicos esté implementado.
        </p>
      </div>
    </div>
  )
}
