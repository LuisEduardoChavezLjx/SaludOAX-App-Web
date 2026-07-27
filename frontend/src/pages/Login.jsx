import { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogoMarca } from '../componentes/comunes/LogoMarca';
import { validarFormularioAcceso, tieneErrores } from '../utilidades/validaciones';

export default function Login() {
  const { user, cargando, login } = useAuth();
  const navegar = useNavigate();

  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [erroresCampos, setErroresCampos] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');

  if (user) return <Navigate to="/" replace />;

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setErrorGeneral('');
    const erroresEncontrados = validarFormularioAcceso({ email, contrasena });
    setErroresCampos(erroresEncontrados);
    if (tieneErrores(erroresEncontrados)) return;

    try {
      await login(email.trim(), contrasena);
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

        <h1 className="mt-6 text-xl font-semibold tracking-[-0.01em] text-center">Iniciar sesión</h1>
        <p className="mt-1.5 text-sm text-muted text-center">Ingrese sus credenciales para continuar.</p>

        <form onSubmit={manejarEnvio} className="mt-8 space-y-5" noValidate>
          <div>
            <label htmlFor="email" className="label">
              Correo electrónico
            </label>
            <input
              id="email" type="email" autoComplete="email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              className={`input-field ${erroresCampos.email ? 'border-urgente focus:border-urgente focus:ring-urgente' : ''}`}
            />
            {erroresCampos.email && (
              <p className="mt-2 text-xs text-urgente font-medium">{erroresCampos.email}</p>
            )}
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-2">
              <label htmlFor="password" className="label">
                Contraseña
              </label>
              <Link to="/recuperar" className="text-xs font-semibold text-brand-700 hover:text-brand-800 underline underline-offset-2">
                ¿Olvidó su contraseña?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password" type={mostrarContrasena ? 'text' : 'password'} autoComplete="current-password"
                value={contrasena} onChange={(e) => setContrasena(e.target.value)}
                className={`input-field pr-11 ${erroresCampos.contrasena ? 'border-urgente focus:border-urgente focus:ring-urgente' : ''}`}
              />
              <button
                type="button" onClick={() => setMostrarContrasena((v) => !v)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-ink"
                aria-label={mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {mostrarContrasena ? '🙈' : '👁️'}
              </button>
            </div>
            {erroresCampos.contrasena && (
              <p className="mt-2 text-xs text-urgente font-medium">{erroresCampos.contrasena}</p>
            )}
          </div>

          {errorGeneral && (
            <p className="text-xs text-urgente font-medium" role="alert">{errorGeneral}</p>
          )}

          <button type="submit" disabled={cargando} className="btn-primary">
            {cargando ? 'Ingresando...' : 'Entrar'}
          </button>
        </form>

        <p className="mt-8 text-sm text-muted text-center">
          ¿Aún no tiene cuenta?{' '}
          <Link to="/register" className="font-semibold text-brand-700 hover:text-brand-800 underline underline-offset-2">
            Crear cuenta de paciente
          </Link>
        </p>
      </div>
    </div>
  );
}