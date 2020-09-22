import axios from 'axios'

const baseUrl = axios.create({
  baseURL: 'http://54.94.48.232:3333'
})

export default baseUrl