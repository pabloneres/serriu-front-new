import axios from 'axios'

const baseUrl = axios.create({
  baseURL: 'http://serriu-back.herokuapp.com'
})

export default baseUrl