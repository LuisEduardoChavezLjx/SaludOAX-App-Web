import axiosClient from './axiosClient'

export async function listarSalaEspera(medicoId) {
    const { data } = await axiosClient.get(`/medicos/${medicoId}/sala-espera`)
    return data
}

export async function obtenerMiTurno() {
    const { data } = await axiosClient.get('/pacientes/mi-turno')
    return data
}

export async function iniciarConsulta(citaId) {
    const { data } = await axiosClient.post(`/citas/${citaId}/turno/iniciar`)
    return data
}

export async function finalizarConsulta(citaId) {
    const { data } = await axiosClient.post(`/citas/${citaId}/turno/finalizar`)
    return data
}
