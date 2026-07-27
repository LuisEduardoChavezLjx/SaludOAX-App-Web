import axiosClient from './axiosClient'

export async function estimarCita(citaId) {
    const { data } = await axiosClient.post(`/citas/${citaId}/estimar`)
    return data
}

export async function obtenerEstimacion(citaId) {
    const { data } = await axiosClient.get(`/citas/${citaId}/estimacion`)
    return data
}
