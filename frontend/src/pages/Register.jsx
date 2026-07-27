import { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogoMarca } from '../componentes/comunes/LogoMarca';

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGLAS_PASSWORD = [
  { texto: 'Mínimo 8 caracteres', test: (p) => p.length >= 8 },
  { texto: 'Una letra mayúscula', test: (p) => /[A-Z]/.test(p) },
  { texto: 'Un número', test: (p) => /[0-9]/.test(p) },
  { texto: 'Un carácter especial (por ejemplo ! # $ %)', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export default function Register() {
  const { user, cargando, register } = useAuth();
  const navegar = useNavigate();

  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [errorGeneral, setErrorGeneral] = useState('');
  const [errorConfirmar, setErrorConfirmar] = useState('');

  if (user) return <Navigate to="/" replace />;

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setErrorGeneral('');
    setErrorConfirmar('');

    if (!REGEX_EMAIL.test(email.trim())) {
      setErrorGeneral('Correo inválido.');
      return;
    }
    if (!REGLAS_PASSWORD.every((regla) => regla.test(contrasena))) {
      setErrorGeneral('La contraseña no cumple los requisitos.');
      return;
    }
    if (contrasena !== confirmar) {
      setErrorConfirmar('Las contraseñas no coinciden.');
      return;
    }

    try {
      await register(email.trim(), contrasena, 'PACIENTE');
      navegar('/', { replace: true });
    } catch (error) {
      setErrorGeneral(error.message);
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-center items-center p-4 text-ink antialiased">
      <div className="max-w-md w-full card shadow-sm">
        <div className="flex flex-col items-center">
          <LogoMarca />
          <span className="mt-3 text-base font-semibold tracking-tight text-brand-800">SaludOAX</span>
        </div>

        <h1 className="mt-6 text-xl font-semibold tracking-[-0.01em] text-center">Crear cuenta</h1>
        <p className="mt-1.5 text-sm text-muted text-center">El registro público crea siempre una cuenta de paciente.</p>

        <form onSubmit={manejarEnvio} className="mt-8 space-y-5" noValidate>
          <div>
            <label htmlFor="email" className="label">
              Correo electrónico
            </label>
            <input
              id="email" type="email" placeholder="nombre@correo.com" autoComplete="email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
            <p className="mt-2 text-xs text-muted">Será su identificador de acceso.</p>
          </div>

          <div>
            <label htmlFor="password" className="label">
              Contraseña
            </label>
            <input
              id="password" type="password" autoComplete="new-password"
              value={contrasena} onChange={(e) => setContrasena(e.target.value)}
              className="input-field"
            />
            <ul className="mt-3 space-y-1.5 text-xs" aria-live="polite">
              {REGLAS_PASSWORD.map((regla) => {
                const cumple = regla.test(contrasena);
                return (
                  <li key={regla.texto} className={`flex items-center gap-2 font-medium ${cumple ? 'text-leve' : 'text-urgente'}`}>
                    {cumple ? '✓' : '✕'} {regla.texto}
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <label htmlFor="password2" className="label">
              Confirmar contraseña
            </label>
            <input
              id="password2" type="password" autoComplete="new-password"
              value={confirmar} onChange={(e) => setConfirmar(e.target.value)}
              className={`input-field ${errorConfirmar ? 'border-urgente focus:border-urgente focus:ring-urgente' : ''}`}
            />
            {errorConfirmar && <p className="mt-2 text-xs text-urgente font-medium">{errorConfirmar}</p>}
          </div>

          {errorGeneral && <p className="text-xs text-urgente font-medium" role="alert">{errorGeneral}</p>}

          <button type="submit" disabled={cargando} className="btn-primary">
            {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="mt-8 text-sm text-muted text-center">
          ¿Ya tiene cuenta?{' '}
          <Link to="/login" className="font-semibold text-brand-700 hover:text-brand-800 underline underline-offset-2">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}