import axiosClient from './axiosClient'

export async function listarUsuarios(page = 0, size = 10, filtros = {}) {
    const { data } = await axiosClient.get('/usuarios', { params: { page, size, ...filtros } })
    return data
}

export async function crearUsuario(datos) {
    const { data } = await axiosClient.post('/usuarios', datos)
    return data
}

export async function actualizarUsuario(id, datos) {
    const { data } = await axiosClient.put(`/usuarios/${id}`, datos)
    return data
}

export async function cambiarEstadoUsuario(id, activo) {
    const { data } = await axiosClient.patch(`/usuarios/${id}/estado`, { activo })
    return data
}
