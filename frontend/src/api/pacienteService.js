import axiosClient from './axiosClient'

export async function crearPerfilPaciente(datos) {
  const { data } = await axiosClient.post('/pacientes', datos)
  return data
}

export async function obtenerPaciente(id) {
  const { data } = await axiosClient.get(`/pacientes/${id}`)
  return data
}
