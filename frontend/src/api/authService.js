import axiosClient from './axiosClient'

export async function login(email, password) {
  try {
    const { data } = await axiosClient.post('/auth/login', { email, password })
    localStorage.setItem('saludoax_token', data.token)
    localStorage.setItem('saludoax_user', JSON.stringify({ email: data.email, rol: data.rol }))
    return data
  } catch (error) {
    if (!error.response) {
      throw new Error('No se pudo conectar con el servidor. Revisa tu conexion.')
    }
    throw new Error(error.response.data?.mensaje || 'Correo o contrasena incorrectos.')
  }
}

export async function register(email, password, rol) {
  const { data } = await axiosClient.post('/auth/register', { email, password, rol })
  localStorage.setItem('saludoax_token', data.token)
  localStorage.setItem('saludoax_user', JSON.stringify({ email: data.email, rol: data.rol }))
  return data
}

export function logout() {
  localStorage.removeItem('saludoax_token')
  localStorage.removeItem('saludoax_user')
}

export function getCurrentUser() {
  const raw = localStorage.getItem('saludoax_user')
  return raw ? JSON.parse(raw) : null
}
