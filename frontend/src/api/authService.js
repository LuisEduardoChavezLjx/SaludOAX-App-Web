import axiosClient from './axiosClient'

export async function login(email, password) {
  const { data } = await axiosClient.post('/auth/login', { email, password })
  localStorage.setItem('saludoax_token', data.token)
  localStorage.setItem('saludoax_user', JSON.stringify({ email: data.email, rol: data.rol }))
  return data
}

export async function register(email, password) {
  const { data } = await axiosClient.post('/auth/register', { email, password })
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
