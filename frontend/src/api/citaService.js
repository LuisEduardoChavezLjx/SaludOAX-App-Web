import axiosClient from './axiosClient'

export async function crearCita(datos) {
  const { data } = await axiosClient.post('/citas', datos)
  return data
}

export async function listarCitasPorPaciente(pacienteId, page = 0, size = 10) {
  const { data } = await axiosClient.get(`/citas/paciente/${pacienteId}`, {
    params: { page, size },
  })
  return data
}

export async function cambiarEstadoCita(citaId, estado) {
  const { data } = await axiosClient.patch(`/citas/${citaId}/estado`, { estado })
  return data
}

export async function obtenerPosicionEnFila(citaId) {
  const { data } = await axiosClient.get(`/citas/${citaId}/posicion-fila`)
  return data
}
