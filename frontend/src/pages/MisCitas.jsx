import { useEffect, useState } from 'react'
import { listarCitasPorPaciente, cambiarEstadoCita } from '../api/citaService'
import ConfirmModal from '../components/ConfirmModal'

// pacienteId vendria del perfil del usuario autenticado; se recibe como prop
export default function MisCitas({ pacienteId }) {
  const [pagina, setPagina] = useState(0)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [citaACancelar, setCitaACancelar] = useState(null)
  const [cancelando, setCancelando] = useState(false)

  const cargar = async (page) => {
    setLoading(true)
    setError('')
    try {
      const res = await listarCitasPorPaciente(pacienteId, page, 5)
      setData(res)
    } catch (err) {
      setError('No se pudieron cargar las citas. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargar(pagina)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina])

  const confirmarCancelacion = async () => {
    setCancelando(true)
    try {
      await cambiarEstadoCita(citaACancelar.id, 'CANCELADA')
      setCitaACancelar(null)
      cargar(pagina)
    } catch (err) {
      setError('No se pudo cancelar la cita.')
    } finally {
      setCancelando(false)
    }
  }

  if (loading) return <p>Cargando citas...</p>
  if (error) return <p role="alert">{error}</p>
  if (!data) return null

  return (
    <div>
      <h1>Mis citas</h1>

      {data.contenido.length === 0 && <p>No tienes citas registradas.</p>}

      <ul>
        {data.contenido.map((cita) => (
          <li key={cita.id}>
            {new Date(cita.fechaHora).toLocaleString()} — {cita.estado}
            {cita.estado === 'PENDIENTE' && (
              <button type="button" onClick={() => setCitaACancelar(cita)}>
                Cancelar
              </button>
            )}
          </li>
        ))}
      </ul>

      <div>
        <button disabled={pagina === 0} onClick={() => setPagina((p) => p - 1)}>
          Anterior
        </button>
        <span> Pagina {data.paginaActual + 1} de {data.totalPaginas || 1} </span>
        <button disabled={pagina + 1 >= data.totalPaginas} onClick={() => setPagina((p) => p + 1)}>
          Siguiente
        </button>
      </div>

      <ConfirmModal
        open={!!citaACancelar}
        title="Cancelar cita"
        message={`Estas por cancelar tu cita del ${citaACancelar ? new Date(citaACancelar.fechaHora).toLocaleString() : ''}. Esta accion no se puede deshacer.`}
        onConfirm={confirmarCancelacion}
        onCancel={() => setCitaACancelar(null)}
        loading={cancelando}
      />
    </div>
  )
}
