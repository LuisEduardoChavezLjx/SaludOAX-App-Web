import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/;
const ID_FORMULARIO = 'form-nuevo-usuario';
const ETIQUETAS_ROL = { ADMIN: 'Administrador', MEDICO: 'Médico', PACIENTE: 'Paciente' };

export function ModalNuevoUsuario({ abierto, onCerrar, onCreado, datosIniciales = null }) {
  const editando = datosIniciales !== null;
  const [form, setForm] = useState({
    rol: 'MEDICO', nombre: '', email: '', password: '', cedula: '', consultorio: '',
  });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!abierto) return;
    if (datosIniciales) {
      setForm({
        rol: datosIniciales.rol, nombre: datosIniciales.nombre, email: datosIniciales.email,
        password: '', cedula: '', consultorio: '',
      });
    } else {
      setForm({ rol: 'MEDICO', nombre: '', email: '', password: '', cedula: '', consultorio: '' });
    }
    setErrores({});
    setErrorGeneral('');
  }, [abierto, datosIniciales]);

  if (!abierto) return null;

  function actualizar(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  function validar() {
    const nuevosErrores = {};
    if (!form.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) nuevosErrores.email = 'Correo inválido.';
    const passwordObligatoria = !editando;
    if (passwordObligatoria && !PASSWORD_REGEX.test(form.password)) {
      nuevosErrores.password = 'Mínimo 8 caracteres, una mayúscula, un número y un carácter especial.';
    }
    if (editando && form.password && !PASSWORD_REGEX.test(form.password)) {
      nuevosErrores.password = 'Mínimo 8 caracteres, una mayúscula, un número y un carácter especial.';
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setErrorGeneral('');
    if (!validar()) return;

    setCargando(true);
    try {
      if (editando) {
        await axiosClient.put(`/admin/usuarios/${datosIniciales.id}`, {
          nombre: form.nombre, email: form.email, password: form.password || undefined,
        });
      } else {
        await axiosClient.post('/admin/usuarios', form);
      }
      onCreado();
    } catch (error) {
      setErrorGeneral(error.response?.data?.mensaje || 'No se pudo guardar el usuario.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-6" role="dialog" aria-modal="true" aria-labelledby="modal-alta">
      <div className="w-full max-w-[560px] rounded-xl bg-white shadow-[0_20px_40px_-12px_rgba(15,23,42,0.35)]">
        <div className="px-6 py-5 border-b border-line flex items-start justify-between gap-4">
          <div>
            <h2 id="modal-alta" className="text-base font-semibold">{editando ? 'Editar usuario' : 'Nuevo usuario'}</h2>
            <p className="mt-1 text-sm text-muted">
              {editando ? 'El rol no se puede cambiar desde aquí.' : 'La cuenta y el perfil se crean en una sola operación.'}
            </p>
          </div>
          <button type="button" onClick={onCerrar} className="shrink-0 text-muted hover:text-ink" aria-label="Cerrar">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form id={ID_FORMULARIO} onSubmit={manejarEnvio} className="p-6 space-y-5" noValidate>
          {editando ? (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.06em] text-muted mb-2">Rol</label>
              <p className="rounded-lg border border-line bg-subtle px-3 py-2.5 text-sm text-ink">
                {ETIQUETAS_ROL[form.rol] || form.rol}
              </p>
            </div>
          ) : (
            <div>
              <label htmlFor="rol" className="block text-xs font-semibold uppercase tracking-[0.06em] text-muted mb-2">Rol</label>
              <select
                id="rol" value={form.rol} onChange={(e) => actualizar('rol', e.target.value)}
                className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink focus:border-brand-700 focus:ring-2 focus:ring-brand-700/25 focus:outline-none"
              >
                <option value="MEDICO">Médico</option>
                <option value="PACIENTE">Paciente</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2">
              <label htmlFor="nombre-nuevo" className="block text-xs font-semibold uppercase tracking-[0.06em] text-muted mb-2">
                Nombre completo
              </label>
              <input
                id="nombre-nuevo" type="text" placeholder="Dra. Silvia Ramos Ojeda"
                value={form.nombre} onChange={(e) => actualizar('nombre', e.target.value)}
                className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-ink placeholder:text-slate-400 focus:ring-2 focus:outline-none ${
                  errores.nombre ? 'border-urgente focus:border-urgente focus:ring-urgente/25' : 'border-line focus:border-brand-700 focus:ring-brand-700/25'
                }`}
              />
              {errores.nombre && <p className="mt-2 text-xs text-urgente font-medium">{errores.nombre}</p>}
            </div>

            <div className="col-span-2">
              <label htmlFor="email-nuevo" className="block text-xs font-semibold uppercase tracking-[0.06em] text-muted mb-2">
                Correo electrónico
              </label>
              <input
                id="email-nuevo" type="email"
                value={form.email} onChange={(e) => actualizar('email', e.target.value)}
                className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-ink focus:ring-2 focus:outline-none ${
                  errores.email ? 'border-urgente focus:border-urgente focus:ring-urgente/25' : 'border-line focus:border-brand-700 focus:ring-brand-700/25'
                }`}
              />
              {errores.email && <p className="mt-2 text-xs text-urgente font-medium">{errores.email}</p>}
            </div>

            {!editando && form.rol === 'MEDICO' && (
              <>
                <div>
                  <label htmlFor="cedula" className="block text-xs font-semibold uppercase tracking-[0.06em] text-muted mb-2">
                    Cédula profesional
                  </label>
                  <input
                    id="cedula" type="text" placeholder="12345678"
                    value={form.cedula} onChange={(e) => actualizar('cedula', e.target.value)}
                    className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink tabular-nums placeholder:text-slate-400 focus:border-brand-700 focus:ring-2 focus:ring-brand-700/25 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="consultorio" className="block text-xs font-semibold uppercase tracking-[0.06em] text-muted mb-2">
                    Consultorio
                  </label>
                  <input
                    id="consultorio" type="text" placeholder="5"
                    value={form.consultorio} onChange={(e) => actualizar('consultorio', e.target.value)}
                    className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-slate-400 focus:border-brand-700 focus:ring-2 focus:ring-brand-700/25 focus:outline-none"
                  />
                </div>
              </>
            )}

            <div className="col-span-2">
              <label htmlFor="password-nuevo" className="block text-xs font-semibold uppercase tracking-[0.06em] text-muted mb-2">
                {editando ? 'Nueva contraseña (opcional)' : 'Contraseña inicial'}
              </label>
              <input
                id="password-nuevo" type="password"
                value={form.password} onChange={(e) => actualizar('password', e.target.value)}
                className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-ink focus:ring-2 focus:outline-none ${
                  errores.password ? 'border-urgente focus:border-urgente focus:ring-urgente/25' : 'border-line focus:border-brand-700 focus:ring-brand-700/25'
                }`}
              />
              <p className="mt-2 text-xs text-muted">
                {editando ? 'Déjala en blanco para no cambiarla.' : 'Mínimo 8 caracteres, una mayúscula, un número y un carácter especial.'}
              </p>
              {errores.password && <p className="mt-1 text-xs text-urgente font-medium">{errores.password}</p>}
            </div>
          </div>

          {errorGeneral && <p className="text-xs text-urgente font-medium" role="alert">{errorGeneral}</p>}
        </form>

        <div className="px-6 py-4 border-t border-line flex justify-end gap-3">
          <button
            type="button" onClick={onCerrar}
            className="rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-semibold text-muted hover:bg-subtle hover:text-ink transition-colors duration-150"
          >
            Cancelar
          </button>
          <button
            type="submit" form={ID_FORMULARIO} disabled={cargando}
            className="rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 active:bg-brand-900 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2 disabled:opacity-60"
          >
            {cargando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Crear usuario'}
          </button>
        </div>
      </div>
    </div>
  );
}
