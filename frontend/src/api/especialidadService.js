import axiosClient from './axiosClient'

export async function listarEspecialidades() {
    const { data } = await axiosClient.get('/especialidades')
    return data
}

export async function crearEspecialidad(nombre) {
    const { data } = await axiosClient.post('/especialidades', { nombre })
    return data
}
