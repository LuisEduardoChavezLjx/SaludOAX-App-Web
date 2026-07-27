import axiosClient from './axiosClient'

export async function crearPerfilPaciente(datos) {
  const { data } = await axiosClient.post('/pacientes', datos)
  return data
}

export async function obtenerPaciente(id) {
  const { data } = await axiosClient.get(`/pacientes/${id}`)
  return data
}

export async function obtenerMiPerfil() {
  const { data } = await axiosClient.get('/pacientes/mi-perfil')
  return data
}

export async function actualizarPerfilPaciente(id, datos) {
  const { data } = await axiosClient.put(`/pacientes/${id}`, datos)
  return data
}

export async function obtenerUltimosVitales() {
  const { data } = await axiosClient.get('/pacientes/ultimos-vitales')
  return data
}
