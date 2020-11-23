import axios from 'axios'

const baseUrl = axios.create({
  baseURL: 'https://api.serriu.com.br'
  // baseURL: 'http://127.0.0.1:3333'
})

export default baseUrl
