import axios from "axios";

const baseUrl = axios.create({
  //baseURL: 'http://serriu-back.herokuapp.com'
  // baseURL: "http://127.0.0.1:3333"
  baseURL : 'http://165.227.116.44'
  // baseURL: "http://api.serriu.com.br"
});

export default baseUrl;
