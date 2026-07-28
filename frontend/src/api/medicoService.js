import axiosClient from './axiosClient'

export async function listarMedicos(page = 0, size = 10, filtros = {}) {
  const { data } = await axiosClient.get('/medicos', { params: { page, size, ...filtros } })
  return data
}

export async function obtenerMiPerfil() {
  const { data } = await axiosClient.get('/medicos/mi-perfil')
  return data
}

export async function obtenerMedico(id) {
  const { data } = await axiosClient.get(`/medicos/${id}`)
  return data
}

export async function crearMedico(datos) {
  const { data } = await axiosClient.post('/admin/medicos', datos)
  return data
}

export async function actualizarMedico(id, datos) {
  const { data } = await axiosClient.put(`/admin/medicos/${id}`, datos)
  return data
}

export async function desactivarMedico(id) {
  await axiosClient.patch(`/admin/medicos/${id}/desactivar`)
}

export async function reactivarMedico(id) {
  await axiosClient.patch(`/admin/medicos/${id}/reactivar`)
}
