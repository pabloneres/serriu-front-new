import axios from 'axios'

const baseUrl = axios.create({
  //baseURL: 'http://serriu-back.herokuapp.com'
  // baseURL: 'http://127.0.0.1:3333'
  // baseURL : 'http://26.206.241.138:3333'
  baseURL: 'https://api.serriu.com.br'
})

export default baseUrl  