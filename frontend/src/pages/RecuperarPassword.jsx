import { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { LogoMarca } from '../componentes/comunes/LogoMarca';

export default function RecuperarPassword() {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setMensaje('');
    setError('');
    setCargando(true);
    try {
      const { data } = await axiosClient.post('/auth/recuperar', { email: email.trim() });
      setMensaje(data.mensaje);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Ocurrio un error, intenta mas tarde.');
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

        <h1 className="mt-6 text-xl font-semibold tracking-[-0.01em] text-center">Recuperar contraseña</h1>
        <p className="mt-1.5 text-sm text-muted text-center">
          Escriba su correo y le enviaremos las instrucciones para restablecerla.
        </p>

        <form onSubmit={manejarEnvio} className="mt-8 space-y-5" noValidate>
          <div>
            <label htmlFor="email" className="label">
              Correo electrónico
            </label>
            <input
              id="email" type="email" placeholder="nombre@correo.com" autoComplete="email"
              value={email} onChange={(e) => setEmail(e.target.value)} required
              className="input-field"
            />
          </div>

          <button type="submit" disabled={cargando} className="btn-primary">
            {cargando ? 'Enviando...' : 'Enviar instrucciones'}
          </button>
        </form>

        {mensaje && (
          <div className="mt-6 rounded-lg bg-leve/10 border border-leve/30 px-4 py-3" role="status">
            <p className="text-xs text-leve font-medium leading-5">{mensaje}</p>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-lg bg-urgente/10 border border-urgente/30 px-4 py-3" role="alert">
            <p className="text-xs text-urgente font-medium leading-5">{error}</p>
          </div>
        )}

        <p className="mt-6 text-sm text-muted text-center">
          <Link to="/login" className="font-semibold text-brand-700 hover:text-brand-800 underline underline-offset-2">
            Volver a iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
