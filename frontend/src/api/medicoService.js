import axiosClient from './axiosClient'

export async function listarMedicos() {
  const { data } = await axiosClient.get('/medicos')
  return data
}