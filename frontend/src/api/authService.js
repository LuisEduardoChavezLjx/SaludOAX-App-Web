import axiosClient from './axiosClient'

export async function login(email, password) {
  try {
    const { data } = await axiosClient.post('/auth/login', { email, password })
    localStorage.setItem('saludoax_token', data.token)
    localStorage.setItem('saludoax_user', JSON.stringify({ email: data.email, rol: data.rol, nombre: data.nombre }))
    return data
  } catch (error) {
    if (!error.response) {
      throw new Error('No se pudo conectar con el servidor. Revisa tu conexion.')
    }
    throw new Error(error.response.data?.mensaje || 'Correo o contrasena incorrectos.')
  }
}

export async function register(email, password) {
  const { data } = await axiosClient.post('/auth/register', { email, password })
  localStorage.setItem('saludoax_token', data.token)
  localStorage.setItem('saludoax_user', JSON.stringify({ email: data.email, rol: data.rol, nombre: data.nombre }))
  return data
}

export async function logout() {
  try {
    await axiosClient.post('/auth/logout')
  } catch {
    // Si el backend no responde, igual cerramos sesion localmente
  } finally {
    localStorage.removeItem('saludoax_token')
    localStorage.removeItem('saludoax_user')
  }
}

function tokenExpirado() {
  const token = localStorage.getItem('saludoax_token')
  if (!token) return true
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

export function getCurrentUser() {
  if (tokenExpirado()) {
    localStorage.removeItem('saludoax_token')
    localStorage.removeItem('saludoax_user')
    return null
  }
  const raw = localStorage.getItem('saludoax_user')
  return raw ? JSON.parse(raw) : null
}

export async function recuperarPassword(email) {
  await axiosClient.post('/auth/recuperar', { email })
}

export async function restablecerPassword(token, nuevaPassword) {
  const { data } = await axiosClient.post('/auth/restablecer', { token, nuevaPassword })
  return data
}
