import * as dotenv from 'dotenv';
import axios from 'axios'
dotenv.config()



const baseUrl = axios.create({
  baseURL: process.env.APP_URL
})

export default baseUrl