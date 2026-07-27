import axios from 'axios'

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
})

// Adjunta el JWT en cada peticion protegida
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('saludoax_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Si el token expira o es invalido, cierra sesion y redirige a login
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('saludoax_token')
            localStorage.removeItem('saludoax_user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default axiosClient
