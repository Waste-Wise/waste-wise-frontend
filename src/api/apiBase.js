import axios from 'axios'

const BaseURL = process.env.NEXT_PUBLIC_BACKEND_BASEURL
const BaseURL_Local = process.env.NEXT_PUBLIC_BACKEND_BASEURL_LOCAL

export const api = axios.create({
  baseURL: BaseURL

  // baseURL: BaseURL_Local
})
