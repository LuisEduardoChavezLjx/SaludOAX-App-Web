export const ROLES = ['ADMIN', 'PACIENTE', 'MEDICO']
export const ESTADOS_CITA = ['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'ATENDIDA']
export const GRAVEDADES = ['LEVE', 'MODERADA', 'URGENTE']
export const ORIGENES = ['IA', 'FALLBACK']
export const SEXOS = ['MASCULINO', 'FEMENINO', 'OTRO']

export const RANGOS = {
    peso: { min: 1, max: 400, label: 'peso en kg' },
    sistolica: { min: 50, max: 300, label: 'presion sistolica' },
    diastolica: { min: 30, max: 200, label: 'presion diastolica' },
}
