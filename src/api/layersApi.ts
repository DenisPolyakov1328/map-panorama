import { api } from './client'

export const fetchLines = async () => {
  const { data } = await api.get('/line.json')
  return data
}

export const fetchRoadCross = async () => {
  const { data } = await api.get('/road_cros.json')
  return data
}

export const fetchSemaphores = async () => {
  const { data } = await api.get('/semaphores.json')
  return data
}
