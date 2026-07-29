import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { LogoMarca } from '../componentes/comunes/LogoMarca';

const REGLAS_PASSWORD = [
  { texto: 'Mínimo 8 caracteres', test: (p) => p.length >= 8 },
  { texto: 'Una mayúscula, un número y un carácter especial', test: (p) => /[A-Z]/.test(p) && /[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p) },
];

export default function RestablecerPassword() {
  const { token } = useParams();
  const navegar = useNavigate();

  const [contrasena, setContrasena] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [errorConfirmar, setErrorConfirmar] = useState('');
  const [errorGeneral, setErrorGeneral] = useState('');
  const [cargando, setCargando] = useState(false);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setErrorConfirmar('');
    setErrorGeneral('');

    if (!REGLAS_PASSWORD.every((r) => r.test(contrasena))) {
      setErrorGeneral('La contraseña no cumple los requisitos.');
      return;
    }
    if (contrasena !== confirmar) {
      setErrorConfirmar('Las contraseñas no coinciden. Escríbalas de nuevo.');
      return;
    }

    setCargando(true);
    try {
      await axiosClient.post('/auth/restablecer', { token, nuevaPassword: contrasena });
      navegar('/login', { replace: true });
    } catch (error) {
      setErrorGeneral(error.response?.data?.mensaje || 'El enlace expiró o no es válido.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-center items-center p-4 text-ink antialiased">
      <div className="max-w-md w-full card shadow-sm">
        <div className="flex flex-col items-center">
          <LogoMarca />
          <span className="mt-3 text-base font-semibold tracking-tight text-brand-800">SaludOAX</span>
        </div>

        <h1 className="mt-6 text-xl font-semibold tracking-[-0.01em] text-center">Restablecer contraseña</h1>
        <p className="mt-1.5 text-sm text-muted text-center">
          Escriba su nueva contraseña. Debe ser distinta a la anterior.
        </p>

        <form onSubmit={manejarEnvio} className="mt-8 space-y-5" noValidate>
          <div>
            <label htmlFor="password" className="label">
              Nueva contraseña
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
            {cargando ? 'Restableciendo...' : 'Restablecer contraseña'}
          </button>
        </form>

        <p className="mt-6 text-sm text-muted text-center">
          <Link to="/login" className="font-semibold text-brand-700 hover:text-brand-800 underline underline-offset-2">
            Volver a iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}