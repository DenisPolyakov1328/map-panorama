import axios from 'axios'

export const api = axios.create({
  baseURL: '/data',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)
