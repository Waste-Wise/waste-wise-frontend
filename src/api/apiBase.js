import axios from 'axios'

const BaseURL = process.env.NEXT_PUBLIC_BACKEND_BASEURL
const BaseURL_Local = process.env.NEXT_PUBLIC_BACKEND_BASEURL_LOCAL

export const auth = axios.create({
  baseURL: BaseURL

  // baseURL: BaseURL_Local
})

export const api = axios.create({
  baseURL: BaseURL,
  headers: {
    'Content-Type': 'application/json'
  }

  // baseURL: BaseURL_Local
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken')
  config.headers.Authorization = `Bearer ${token}`

  return config
})
