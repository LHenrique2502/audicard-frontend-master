import axios from "axios";
import { getToken, login } from "./Auth";
const baseURL = "http://127.0.0.1:8000/api"
const baseURLProd = "https://api.audicard.net.br/api"
const baseURLGit = "http://191.252.197.20:8080/http://api.audicard.net.br/api" // Url usada para acesso loca na rede
const baseURLImg = "http://api.audicard.net.br/"

const api = axios.create({
  baseURL: baseURLProd
});


api.interceptors.request.use(async config => {

  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers['Content-Type'] = 'multipart/form-data';

  return config;
});


api.interceptors.response.use(async response => {

  console.log(response);
  return response;
});




export default api;
