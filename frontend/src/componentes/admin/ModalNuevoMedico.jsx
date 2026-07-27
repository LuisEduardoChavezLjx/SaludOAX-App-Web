import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

export function ModalNuevoMedico({ abierto, onCerrar, onGuardado, datosIniciales = null }) {
  const [form, setForm] = useState({
    nombre: '', email: '', password: '', cedula: '', consultorio: '',
    especialidades: [], horarios: [],
  });
  const [catalogoEspecialidades, setCatalogoEspecialidades] = useState([]);
  const [errorGeneral, setErrorGeneral] = useState('');
  const [cargando, setCargando] = useState(false);
  const editando = datosIniciales !== null;

  useEffect(() => {
    if (abierto) {
      setForm({
        nombre: '', email: '', password: '', cedula: '', consultorio: '',
        especialidades: [], horarios: [],
      });
      setErrorGeneral('');
      axiosClient.get('/especialidades').then(({ data }) => setCatalogoEspecialidades(data.contenido || data));
    }
  }, [abierto]);

  useEffect(() => {
    if (datosIniciales) {
      setForm({
        nombre: datosIniciales.nombre || '',
        email: datosIniciales.email || '',
        password: '',
        cedula: datosIniciales.cedula || '',
        consultorio: datosIniciales.consultorio || '',
        especialidades: datosIniciales.especialidadesAdicionales?.map((e) => e.id) || [],
        horarios: datosIniciales.horarios?.map((h) => ({
          diaSemana: h.diaSemana,
          horaInicio: h.horaInicio.slice(0, 5),
          horaFin: h.horaFin.slice(0, 5),
        })) || [],
      });
    }
  }, [datosIniciales]);

  function actualizar(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  function actualizarHorario(index, campo, valor) {
    setForm((f) => {
      const nuevos = [...f.horarios];
      nuevos[index] = { ...nuevos[index], [campo]: valor };
      return { ...f, horarios: nuevos };
    });
  }

  function agregarHorario() {
    setForm((f) => ({
      ...f,
      horarios: [...f.horarios, { diaSemana: '', horaInicio: '', horaFin: '' }],
    }));
  }

  function quitarHorario(index) {
    setForm((f) => ({
      ...f,
      horarios: f.horarios.filter((_, i) => i !== index),
    }));
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setErrorGeneral('');

    if (!form.nombre.trim()) {
      setErrorGeneral('El nombre es obligatorio.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setErrorGeneral('Correo inválido.');
      return;
    }
    if (!editando && !/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/.test(form.password)) {
      setErrorGeneral('Contraseña mínima 8 caracteres, mayúscula, número y especial.');
      return;
    }

    setCargando(true);
    try {
      const payload = { ...form, rol: 'MEDICO' };
      if (editando) {
        await axiosClient.put(`/admin/medicos/${datosIniciales.id}`, payload);
      } else {
        await axiosClient.post('/admin/medicos', payload);
      }
      onGuardado();
    } catch (error) {
      setErrorGeneral(error.response?.data?.mensaje || 'No se pudo guardar el médico.');
    } finally {
      setCargando(false);
    }
  }

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4" role="dialog" aria-modal="true" aria-labelledby="modal-medico">
      <div className="w-full max-w-[720px] max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-[0_20px_40px_-12px_rgba(15,23,42,0.35)]">
        <div className="px-6 py-5 border-b border-line flex items-start justify-between gap-4 sticky top-0 bg-white z-10">
          <div>
            <h2 id="modal-medico" className="text-base font-semibold">{editando ? 'Editar médico' : 'Nuevo médico'}</h2>
            <p className="mt-1 text-sm text-muted">Los campos con * son obligatorios.</p>
          </div>
          <button type="button" onClick={onCerrar} className="shrink-0 text-muted hover:text-ink" aria-label="Cerrar">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={manejarEnvio} className="p-6 space-y-6" noValidate>
          {errorGeneral && <p className="text-xs text-urgente font-medium" role="alert">{errorGeneral}</p>}

          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2">
              <label htmlFor="nombre-medico" className="block text-xs font-semibold uppercase tracking-[0.06em] text-muted mb-2">Nombre completo *</label>
              <input
                id="nombre-medico" type="text" placeholder="Dra. Ana Gómez López"
                value={form.nombre} onChange={(e) => actualizar('nombre', e.target.value)}
                className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-slate-400 focus:border-brand-700 focus:ring-2 focus:ring-brand-700/25 focus:outline-none"
                required
              />
            </div>

            <div className="col-span-2">
              <label htmlFor="email-medico" className="block text-xs font-semibold uppercase tracking-[0.06em] text-muted mb-2">Correo electrónico *</label>
              <input
                id="email-medico" type="email"
                value={form.email} onChange={(e) => actualizar('email', e.target.value)}
                className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-slate-400 focus:border-brand-700 focus:ring-2 focus:ring-brand-700/25 focus:outline-none"
                required
              />
            </div>

            {editando ? (
              <div className="col-span-2">
                <label htmlFor="consultorio-medico" className="block text-xs font-semibold uppercase tracking-[0.06em] text-muted mb-2">Consultorio *</label>
                <input
                  id="consultorio-medico" type="text" placeholder="5"
                  value={form.consultorio} onChange={(e) => actualizar('consultorio', e.target.value)}
                  className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-slate-400 focus:border-brand-700 focus:ring-2 focus:ring-brand-700/25 focus:outline-none"
                />
              </div>
            ) : (
              <>
                <div className="col-span-2">
                  <label htmlFor="password-medico" className="block text-xs font-semibold uppercase tracking-[0.06em] text-muted mb-2">Contraseña inicial *</label>
                  <input
                    id="password-medico" type="password"
                    value={form.password} onChange={(e) => actualizar('password', e.target.value)}
                    className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink focus:border-brand-700 focus:ring-2 focus:ring-brand-700/25 focus:outline-none"
                    required
                  />
                  <p className="mt-2 text-xs text-muted">Mínimo 8 caracteres, una mayúscula, un número y un carácter especial.</p>
                </div>
                <div className="col-span-2">
                  <label htmlFor="cedula-medico" className="block text-xs font-semibold uppercase tracking-[0.06em] text-muted mb-2">Cédula profesional *</label>
                  <input
                    id="cedula-medico" type="text" placeholder="12345678"
                    value={form.cedula} onChange={(e) => actualizar('cedula', e.target.value)}
                    className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink tabular-nums placeholder:text-slate-400 focus:border-brand-700 focus:ring-2 focus:ring-brand-700/25 focus:outline-none"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="consultorio-medico" className="block text-xs font-semibold uppercase tracking-[0.06em] text-muted mb-2">Consultorio *</label>
                  <input
                    id="consultorio-medico" type="text" placeholder="5"
                    value={form.consultorio} onChange={(e) => actualizar('consultorio', e.target.value)}
                    className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-slate-400 focus:border-brand-700 focus:ring-2 focus:ring-brand-700/25 focus:outline-none"
                    required
                  />
                </div>
              </>
            )}

            <div className="col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-[0.06em] text-muted mb-2">Especialidades (principal + adicionales) *</label>
              <div className="flex flex-wrap gap-2">
                {catalogoEspecialidades.map((esp) => (
                  <label key={esp.id} className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm cursor-pointer transition-colors duration-150">
                    <input
                      type="checkbox"
                      checked={form.especialidades.includes(esp.id)}
                      onChange={(e) => {
                        if (e.target.checked) actualizar('especialidades', [...form.especialidades, esp.id]);
                        else actualizar('especialidades', form.especialidades.filter((id) => id !== esp.id));
                      }}
                      className="w-4 h-4 rounded border-line text-brand-700 focus:ring-2 focus:ring-brand-700/25"
                    />
                    <span>{esp.nombre}</span>
                  </label>
                ))}
              </div>
              {form.especialidades.length === 0 && <p className="mt-2 text-xs text-urgente">Selecciona al menos una especialidad.</p>}
            </div>

            <div className="col-span-2">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-semibold uppercase tracking-[0.06em] text-muted">Horarios de atención</label>
                <button type="button" onClick={agregarHorario} className="text-xs font-semibold text-brand-700 hover:text-brand-800 underline underline-offset-2">+ Agregar franja</button>
              </div>
              {form.horarios.length === 0 && <p className="text-xs text-muted mb-3">Sin horarios definidos aún.</p>}
              {form.horarios.map((h, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 mb-3 p-3 rounded-lg bg-subtle/50">
                  <select
                    value={h.diaSemana} onChange={(e) => actualizarHorario(i, 'diaSemana', e.target.value)}
                    className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand-700 focus:ring-2 focus:ring-brand-700/25 focus:outline-none"
                  >
                    <option value="">Día</option>
                    <option value="LUNES">Lunes</option>
                    <option value="MARTES">Martes</option>
                    <option value="MIERCOLES">Miércoles</option>
                    <option value="JUEVES">Jueves</option>
                    <option value="VIERNES">Viernes</option>
                    <option value="SABADO">Sábado</option>
                    <option value="DOMINGO">Domingo</option>
                  </select>
                  <input
                    type="time" value={h.horaInicio} onChange={(e) => actualizarHorario(i, 'horaInicio', e.target.value)}
                    className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand-700 focus:ring-2 focus:ring-brand-700/25 focus:outline-none"
                  />
                  <input
                    type="time" value={h.horaFin} onChange={(e) => actualizarHorario(i, 'horaFin', e.target.value)}
                    className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand-700 focus:ring-2 focus:ring-brand-700/25 focus:outline-none"
                  />
                  <button
                    type="button" onClick={() => quitarHorario(i)}
                    className="text-urgente hover:text-urgente/70 text-sm font-medium"
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="px-0 pt-4 border-t border-line flex justify-end gap-3">
            <button
              type="button" onClick={onCerrar}
              className="rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-semibold text-muted hover:bg-subtle hover:text-ink transition-colors duration-150"
            >
              Cancelar
            </button>
            <button
              type="submit" disabled={cargando}
              className="rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 active:bg-brand-900 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2 disabled:opacity-60"
            >
              {cargando ? 'Guardando...' : editando ? 'Actualizar' : 'Crear médico'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}