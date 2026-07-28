import { useState, useEffect, useCallback } from 'react';
import axiosClient from '../api/axiosClient';
import { SidebarAdmin } from '../componentes/comunes/SidebarAdmin';
import { HeaderAdmin } from '../componentes/comunes/HeaderAdmin';
import { ModalNuevoMedico } from '../componentes/admin/ModalNuevoMedico';
import ConfirmModal from '../components/ConfirmModal';

const TAMANO_PAGINA = 10;

export default function AdminMedicos() {
  const [medicos, setMedicos] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalElementos, setTotalElementos] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [busqueda, setBusqueda] = useState('');
  const [filtroEspecialidad, setFiltroEspecialidad] = useState('');
  const [especialidades, setEspecialidades] = useState([]);
  const [medicoSeleccionado, setMedicoSeleccionado] = useState(null);
  const [modalMedicoAbierto, setModalMedicoAbierto] = useState(false);
  const [editando, setEditando] = useState(false);
  const [confirmarAccion, setConfirmarAccion] = useState(null);

  const cargarMedicos = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const { data } = await axiosClient.get('/admin/medicos', {
        params: {
          page: pagina,
          size: TAMANO_PAGINA,
          busqueda: busqueda || undefined,
          especialidad: filtroEspecialidad || undefined,
        },
      });
      setMedicos(data.contenido);
      setTotalPaginas(data.totalPaginas);
      setTotalElementos(data.totalElementos);
    } catch (err) {
      setError('No se pudieron cargar los médicos. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  }, [pagina, busqueda, filtroEspecialidad]);

  useEffect(() => {
    cargarMedicos();
    axiosClient.get('/especialidades').then(({ data }) => {
      setEspecialidades(data.contenido || data);
    });
  }, [cargarMedicos]);

  function manejarDesactivar(medicoId) {
    setConfirmarAccion({
      tipo: 'desactivar',
      medicoId,
      titulo: 'Desactivar médico',
      mensaje: '¿Desactivar este médico? Perderá acceso al sistema.',
    });
  }

  function manejarReactivar(medicoId) {
    setConfirmarAccion({
      tipo: 'reactivar',
      medicoId,
      titulo: 'Reactivar médico',
      mensaje: '¿Reactivar este médico? Recuperará su acceso al sistema.',
    });
  }

  function ejecutarConfirmacion() {
    if (!confirmarAccion) return;
    const { tipo, medicoId } = confirmarAccion;
    const ruta = tipo === 'desactivar' ? 'desactivar' : 'reactivar';
    axiosClient.patch(`/admin/medicos/${medicoId}/${ruta}`)
      .then(() => { setConfirmarAccion(null); cargarMedicos(); })
      .catch(() => setError('No se pudo completar la operación.'));
  }

  function iniciales(nombre) {
    if (!nombre) return '??';
    const partes = nombre.trim().split(' ');
    return (partes[0][0] + (partes[1]?.[0] || '')).toUpperCase();
  }

  function colorAvatar(m) {
    if (!m.activo) return 'bg-slate-300 text-slate-600';
    return 'bg-brand-700 text-white';
  }

  function badgeEspecialidad(nombre) {
    return (
      <span className="inline-flex items-center rounded-full border border-line bg-subtle px-2 py-0.5 text-xs font-semibold text-ink">
        {nombre}
      </span>
    );
  }

  const inicioRango = totalElementos === 0 ? 0 : pagina * TAMANO_PAGINA + 1;
  const finRango = Math.min((pagina + 1) * TAMANO_PAGINA, totalElementos);
  const numerosPagina = Array.from({ length: totalPaginas }, (_, i) => i);

  return (
    <div className="flex min-h-screen bg-canvas text-ink antialiased">
      <SidebarAdmin />

      <div className="flex-1 flex flex-col min-w-0">
        <HeaderAdmin
          titulo="Gestión de médicos"
          accionPrimaria={
            <button
              type="button"
              onClick={() => { setEditando(false); setMedicoSeleccionado(null); setModalMedicoAbierto(true); }}
              className="flex items-center gap-2 rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-800 active:bg-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Nuevo médico
            </button>
          }
        />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="grid grid-cols-12 gap-6 items-start">

            <section className="col-span-8 rounded-xl border border-line bg-white min-w-0">
              <div className="px-6 py-4 border-b border-line flex flex-wrap items-end gap-4">
                <div className="min-w-[220px] flex-1">
                  <label htmlFor="buscar-medico" className="block text-xs font-semibold uppercase tracking-[0.06em] text-muted mb-2">
                    Buscar por nombre o cédula
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                      </svg>
                    </span>
                    <input
                      id="buscar-medico" type="search" placeholder="nombre o cédula"
                      value={busqueda}
                      onChange={(e) => { setPagina(0); setBusqueda(e.target.value); }}
                      className="w-full rounded-lg border border-line bg-white pl-10 pr-3 py-2 text-sm text-ink placeholder:text-slate-400 focus:border-brand-700 focus:ring-2 focus:ring-brand-700/25 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="min-w-[160px]">
                  <label htmlFor="filtro-especialidad" className="block text-xs font-semibold uppercase tracking-[0.06em] text-muted mb-2">
                    Especialidad
                  </label>
                  <select
                    id="filtro-especialidad" value={filtroEspecialidad}
                    onChange={(e) => { setPagina(0); setFiltroEspecialidad(e.target.value); }}
                    className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand-700 focus:ring-2 focus:ring-brand-700/25 focus:outline-none"
                  >
                    <option value="">Todas</option>
                    {especialidades.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                  </select>
                </div>
              </div>

              {error && (
                <p className="px-6 py-3 text-sm text-urgente font-medium" role="alert">{error}</p>
              )}

              {cargando ? (
                <p className="px-6 py-10 text-center text-sm text-muted">Cargando médicos...</p>
              ) : medicos.length === 0 ? (
                <p className="px-6 py-10 text-center text-sm text-muted">No se encontraron médicos con estos filtros.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-subtle text-left">
                        <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-muted">Médico</th>
                        <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-muted">Especialidades</th>
                        <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-muted">Consultorio</th>
                        <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-muted text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medicos.map((m) => (
                        <tr key={m.id} className="border-t border-line hover:bg-subtle/60 transition-colors duration-150">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className={`w-9 h-9 shrink-0 rounded-full text-xs font-semibold flex items-center justify-center ${colorAvatar(m)}`}>
                                {iniciales(m.nombre)}
                              </span>
                              <span className="leading-tight">
                                <span className={`block font-medium ${!m.activo && 'text-muted'}`}>{m.nombre}</span>
                                <span className="block text-xs text-muted">Céd: {m.cedula || '—'}</span>
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1.5">
                              {m.especialidad && badgeEspecialidad(m.especialidad)}
                              {m.especialidadesAdicionales?.slice(0, 3).map((e) => (
                                <span key={e.id} className="inline-flex items-center rounded-full border border-line bg-subtle px-2 py-0.5 text-xs font-semibold text-ink">
                                  {e.nombre}
                                </span>
                              ))}
                              {(m.especialidadesAdicionales?.length || 0) > 3 && (
                                <span className="inline-flex items-center rounded-full border border-line bg-subtle px-2 py-0.5 text-xs font-semibold text-muted">
                                  +{(m.especialidadesAdicionales?.length || 0) - 3} más
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {m.consultorio || '—'}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => { setEditando(true); setMedicoSeleccionado(m); setModalMedicoAbierto(true); }}
                                className="rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-muted hover:bg-subtle hover:text-ink transition-colors duration-150"
                              >
                                Editar
                              </button>
                              {m.activo ? (
                                <button
                                  type="button"
                                  onClick={() => manejarDesactivar(m.id)}
                                  className="rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-urgente hover:bg-urgente hover:text-white hover:border-urgente transition-colors duration-150"
                                >
                                  Desactivar
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => manejarReactivar(m.id)}
                                  className="rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-leve hover:bg-leve hover:text-white hover:border-leve transition-colors duration-150"
                                >
                                  Reactivar
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {totalPaginas > 1 && (
                <div className="px-6 py-4 border-t border-line flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-muted">
                    Mostrando {inicioRango}–{finRango} de {totalElementos} médicos
                  </p>
                  <nav className="flex items-center gap-1" aria-label="Paginación">
                    <button
                      type="button"
                      onClick={() => setPagina((p) => Math.max(0, p - 1))}
                      disabled={pagina === 0}
                      className="rounded-lg border border-line bg-white px-3 py-1.5 text-sm font-semibold text-muted hover:bg-subtle hover:text-ink transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    {numerosPagina.map((i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPagina(i)}
                        className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors duration-150 ${
                          i === pagina
                            ? 'bg-brand-700 text-white'
                            : 'border border-line bg-white text-muted hover:bg-subtle hover:text-ink'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setPagina((p) => Math.min(totalPaginas - 1, p + 1))}
                      disabled={pagina === totalPaginas - 1}
                      className="rounded-lg border border-line bg-white px-3 py-1.5 text-sm font-semibold text-muted hover:bg-subtle hover:text-ink transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Siguiente
                    </button>
                  </nav>
                </div>
              )}
            </section>

            <aside className="col-span-4 space-y-6">
              <div className="rounded-xl border border-line bg-white p-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.06em] text-muted mb-4">Médicos por especialidad</h3>
                <dl className="grid grid-cols-2 gap-3 text-center">
                  <div className="col-span-2 rounded-lg bg-brand-50 p-4">
                    <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-muted">Total</dt>
                    <dd className="mt-1 text-2xl font-bold text-brand-800">{medicos.length}</dd>
                  </div>
                  {especialidades.map((esp) => (
                    <div key={esp.id} className="rounded-lg bg-brand-50 p-3">
                      <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-muted">{esp.nombre}</dt>
                      <dd className="mt-1 text-xl font-bold text-brand-700">
                        {medicos.filter((m) =>
                          m.especialidad === esp.id ||
                          m.especialidadesAdicionales?.some((e) => e.id === esp.id)
                        ).length}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="rounded-xl border border-line bg-white p-5">
                <h4 className="text-sm font-semibold uppercase tracking-[0.06em] text-muted mb-3">Reglas de negocio</h4>
                <ul className="space-y-2 text-xs text-muted leading-5">
                  <li className="flex gap-2"><span className="shrink-0 w-1.5 h-1.5 rounded-full bg-leve mt-1.5" />Un médico no puede desactivarse a sí mismo.</li>
                  <li className="flex gap-2"><span className="shrink-0 w-1.5 h-1.5 rounded-full bg-brand-700 mt-1.5" />La contraseña se genera al crear el médico (mínimo 8 caracteres, mayúscula, número y especial).</li>
                  <li className="flex gap-2"><span className="shrink-0 w-1.5 h-1.5 rounded-full bg-info mt-1.5" />La cédula profesional es obligatoria y única.</li>
                  <li className="flex gap-2"><span className="shrink-0 w-1.5 h-1.5 rounded-full bg-moderada mt-1.5" />Al desactivar, el médico pierde acceso inmediato (token en blacklist).</li>
                  <li className="flex gap-2"><span className="shrink-0 w-1.5 h-1.5 rounded-full bg-neutro mt-1.5" />Al reactivar, recupera su mismo rol, consultorio y especialidades.</li>
                </ul>
              </div>
            </aside>
          </div>
        </main>
      </div>

      <ModalNuevoMedico
        abierto={modalMedicoAbierto}
        onCerrar={() => { setModalMedicoAbierto(false); setMedicoSeleccionado(null); setEditando(false); }}
        onGuardado={() => { setModalMedicoAbierto(false); setMedicoSeleccionado(null); setEditando(false); cargarMedicos(); }}
        datosIniciales={editando ? medicoSeleccionado : null}
      />

      <ConfirmModal
        open={!!confirmarAccion}
        title={confirmarAccion?.titulo || ''}
        message={confirmarAccion?.mensaje || ''}
        onConfirm={ejecutarConfirmacion}
        onCancel={() => setConfirmarAccion(null)}
      />
    </div>
  );
}