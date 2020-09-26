import axios from 'axios'

const baseUrl = axios.create({
  baseURL: 'https://serriu-back.herokuapp.com'
})

export default baseUrl