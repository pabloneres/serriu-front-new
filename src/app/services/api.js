import axios from "axios";

const baseUrl = axios.create({
  //baseURL: 'http://serriu-back.herokuapp.com'
  // baseURL: "http://127.0.0.1:3333"
  baseURL : 'http://164.90.130.146'
  // baseURL: "http://api.serriu.com.br"
});

export default baseUrl;
