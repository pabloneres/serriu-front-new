import axios from 'axios'

const baseUrl = axios.create({
  // baseURL: 'http://serriu-back.herokuapp.com'
  // baseURL: 'http://127.0.0.1:3333'
  baseURL: 'http://157.230.214.88'
})

export default baseUrl