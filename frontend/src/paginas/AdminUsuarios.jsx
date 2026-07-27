import { useEffect, useState, useCallback } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { SidebarAdmin } from '../componentes/comunes/SidebarAdmin';
import { HeaderAdmin } from '../componentes/comunes/HeaderAdmin';
import { ModalNuevoUsuario } from '../componentes/admin/ModalNuevoUsuario';

const TAMANO_PAGINA = 10;

export default function AdminUsuarios() {
  const { user } = useAuth();

  const [usuarios, setUsuarios] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalElementos, setTotalElementos] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  const [modalAbierto, setModalAbierto] = useState(false);

  const cargarUsuarios = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const { data } = await axiosClient.get('/admin/usuarios', {
        params: {
          page: pagina,
          size: TAMANO_PAGINA,
          busqueda: busqueda || undefined,
          rol: filtroRol || undefined,
          activo: filtroEstado || undefined,
        },
      });
      setUsuarios(data.contenido);
      setTotalPaginas(data.totalPaginas);
      setTotalElementos(data.totalElementos);
    } catch (err) {
      setError('No se pudieron cargar los usuarios. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  }, [pagina, busqueda, filtroRol, filtroEstado]);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  async function manejarDesactivar(usuarioId) {
    try {
      await axiosClient.patch(`/admin/usuarios/${usuarioId}/desactivar`);
      cargarUsuarios();
    } catch (err) {
      setError('No se pudo desactivar el usuario.');
    }
  }

  async function manejarReactivar(usuarioId) {
    try {
      await axiosClient.patch(`/admin/usuarios/${usuarioId}/reactivar`);
      cargarUsuarios();
    } catch (err) {
      setError('No se pudo reactivar el usuario.');
    }
  }

  function iniciales(nombre) {
    if (!nombre) return '??';
    const partes = nombre.trim().split(' ');
    return (partes[0][0] + (partes[1]?.[0] || '')).toUpperCase();
  }

  function etiquetaRol(rol) {
    return { ADMIN: 'Administrador', MEDICO: 'Médico', PACIENTE: 'Paciente' }[rol] || rol;
  }

  function colorAvatar(u) {
    if (!u.activo) return 'bg-slate-300 text-slate-600';
    if (u.rol === 'ADMIN') return 'bg-brand-800 text-white';
    return 'bg-brand-700 text-white';
  }

  const conteoPorRol = usuarios.reduce(
    (acc, u) => ({ ...acc, [u.rol]: (acc[u.rol] || 0) + 1 }),
    {}
  );

  const inicioRango = totalElementos === 0 ? 0 : pagina * TAMANO_PAGINA + 1;
  const finRango = Math.min((pagina + 1) * TAMANO_PAGINA, totalElementos);
  const numerosPagina = Array.from({ length: totalPaginas }, (_, i) => i);

  return (
    <div className="flex min-h-screen bg-canvas text-ink antialiased">
      <SidebarAdmin />

      <div className="flex-1 flex flex-col min-w-0">
        <HeaderAdmin
          titulo="Gestión de usuarios"
          accionPrimaria={
            <button
              type="button"
              onClick={() => setModalAbierto(true)}
              className="flex items-center gap-2 rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-800 active:bg-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Nuevo usuario
            </button>
          }
        />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="grid grid-cols-12 gap-6 items-start">

            <section className="col-span-8 rounded-xl border border-line bg-white min-w-0">
              <div className="px-6 py-4 border-b border-line flex flex-wrap items-end gap-4">
                <div className="min-w-[200px] flex-1">
                  <label htmlFor="buscar" className="block text-xs font-semibold uppercase tracking-[0.06em] text-muted mb-2">
                    Buscar por correo
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                      </svg>
                    </span>
                    <input
                      id="buscar" type="search" placeholder="correo@saludoax.me"
                      value={busqueda}
                      onChange={(e) => { setPagina(0); setBusqueda(e.target.value); }}
                      className="w-full rounded-lg border border-line bg-white pl-10 pr-3 py-2 text-sm text-ink placeholder:text-slate-400 focus:border-brand-700 focus:ring-2 focus:ring-brand-700/25 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="min-w-[160px]">
                  <label htmlFor="filtro-rol" className="block text-xs font-semibold uppercase tracking-[0.06em] text-muted mb-2">
                    Rol
                  </label>
                  <select
                    id="filtro-rol" value={filtroRol}
                    onChange={(e) => { setPagina(0); setFiltroRol(e.target.value); }}
                    className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand-700 focus:ring-2 focus:ring-brand-700/25 focus:outline-none"
                  >
                    <option value="">Todos los roles</option>
                    <option value="ADMIN">Administrador</option>
                    <option value="MEDICO">Médico</option>
                    <option value="PACIENTE">Paciente</option>
                  </select>
                </div>

                <div className="min-w-[130px]">
                  <label htmlFor="filtro-estado" className="block text-xs font-semibold uppercase tracking-[0.06em] text-muted mb-2">
                    Estado
                  </label>
                  <select
                    id="filtro-estado" value={filtroEstado}
                    onChange={(e) => { setPagina(0); setFiltroEstado(e.target.value); }}
                    className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand-700 focus:ring-2 focus:ring-brand-700/25 focus:outline-none"
                  >
                    <option value="">Todos</option>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
              </div>

              {error && (
                <p className="px-6 py-3 text-sm text-urgente font-medium" role="alert">{error}</p>
              )}

              {cargando ? (
                <p className="px-6 py-10 text-center text-sm text-muted">Cargando usuarios...</p>
              ) : usuarios.length === 0 ? (
                <p className="px-6 py-10 text-center text-sm text-muted">No se encontraron usuarios con estos filtros.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-subtle text-left">
                        <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-muted">Usuario</th>
                        <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-muted">Rol</th>
                        <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-muted">Estado</th>
                        <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-muted text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuarios.map((u) => {
                        const esUnoMismo = u.id === user?.id;
                        return (
                          <tr key={u.id} className="border-t border-line hover:bg-subtle/60 transition-colors duration-150">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <span className={`w-9 h-9 shrink-0 rounded-full text-xs font-semibold flex items-center justify-center ${colorAvatar(u)}`}>
                                  {iniciales(u.nombre)}
                                </span>
                                <span className="leading-tight">
                                  <span className={`block font-medium ${!u.activo && 'text-muted'}`}>{u.nombre}</span>
                                  <span className="block text-xs text-muted">{u.email}</span>
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center rounded-full border border-line bg-subtle px-2.5 py-1 text-xs font-semibold text-ink">
                                {etiquetaRol(u.rol)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-subtle px-2.5 py-1 text-xs font-semibold text-ink">
                                <span className={`w-1.5 h-1.5 rounded-full ${u.activo ? 'bg-leve' : 'bg-neutro'}`} />
                                {u.activo ? 'Activo' : 'Inactivo'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  className="rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-muted hover:bg-subtle hover:text-ink transition-colors duration-150"
                                >
                                  Editar
                                </button>
                                {u.activo ? (
                                  <button
                                    type="button"
                                    disabled={esUnoMismo}
                                    title={esUnoMismo ? 'No puedes desactivar tu propia cuenta' : undefined}
                                    onClick={() => manejarDesactivar(u.id)}
                                    className={
                                      esUnoMismo
                                        ? 'rounded-lg border border-line bg-subtle px-3 py-1.5 text-xs font-semibold text-slate-400 cursor-not-allowed'
                                        : 'rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-urgente hover:bg-urgente hover:text-white hover:border-urgente transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-urgente focus:ring-offset-2'
                                    }
                                  >
                                    Desactivar
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => manejarReactivar(u.id)}
                                    className="rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-leve hover:bg-leve hover:text-white hover:border-leve transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-leve focus:ring-offset-2"
                                  >
                                    Reactivar
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {totalPaginas > 1 && (
                <div className="px-6 py-4 border-t border-line flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-muted">
                    Mostrando {inicioRango}–{finRango} de {totalElementos} usuarios
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
              <div className="rounded-xl border border-line bg-white p-6">
                <h3 className="text-sm font-semibold uppercase tracking-[0.06em] text-muted mb-4">Usuarios por rol</h3>
                <dl className="grid grid-cols-2 gap-3 text-center">
                  <div className="col-span-2 rounded-lg bg-brand-50 p-4">
                    <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-muted">Total</dt>
                    <dd className="mt-1 text-2xl font-bold text-brand-800">{usuarios.length}</dd>
                  </div>
                  <div className="rounded-lg bg-leve/10 p-3">
                    <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-muted">Administradores</dt>
                    <dd className="mt-1 text-xl font-bold text-leve">{conteoPorRol.ADMIN || 0}</dd>
                  </div>
                  <div className="rounded-lg bg-brand-50 p-3">
                    <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-muted">Médicos</dt>
                    <dd className="mt-1 text-xl font-bold text-brand-700">{conteoPorRol.MEDICO || 0}</dd>
                  </div>
                  <div className="rounded-lg bg-sky-50 p-3">
                    <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-muted">Pacientes</dt>
                    <dd className="mt-1 text-xl font-bold text-sky-700">{conteoPorRol.PACIENTE || 0}</dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-xl border border-line bg-white p-5">
                <h4 className="text-sm font-semibold uppercase tracking-[0.06em] text-muted mb-3">Reglas de negocio</h4>
                <ul className="space-y-2 text-xs text-muted leading-5">
                  <li className="flex gap-2"><span className="shrink-0 w-1.5 h-1.5 rounded-full bg-leve mt-1.5" />Un admin no puede desactivarse a sí mismo.</li>
                  <li className="flex gap-2"><span className="shrink-0 w-1.5 h-1.5 rounded-full bg-brand-700 mt-1.5" />La contraseña se genera al crear el usuario (mínimo 8 caracteres, mayúscula, número y especial).</li>
                  <li className="flex gap-2"><span className="shrink-0 w-1.5 h-1.5 rounded-full bg-info mt-1.5" />El correo es el identificador único; no se permite duplicado.</li>
                  <li className="flex gap-2"><span className="shrink-0 w-1.5 h-1.5 rounded-full bg-moderada mt-1.5" />Al desactivar, el usuario pierde acceso inmediato (token en blacklist).</li>
                  <li className="flex gap-2"><span className="shrink-0 w-1.5 h-1.5 rounded-full bg-neutro mt-1.5" />Al reactivar, recupera su mismo rol y perfil.</li>
                </ul>
              </div>
            </aside>
          </div>
        </main>
      </div>

      <ModalNuevoUsuario
        abierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
        onCreado={() => { setModalAbierto(false); cargarUsuarios(); }}
      />
    </div>
  );
}