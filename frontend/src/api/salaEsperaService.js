import axiosClient from './axiosClient'
import { cambiarEstadoCita } from './citaService'

export async function listarSalaEspera(medicoId) {
    const { data } = await axiosClient.get(`/medicos/${medicoId}/sala-espera`)
    return data
}

export async function obtenerMiTurno() {
    const { data } = await axiosClient.get('/pacientes/mi-turno')
    return data
}

export async function finalizarConsulta(citaId) {
    return cambiarEstadoCita(citaId, 'ATENDIDA')
}
