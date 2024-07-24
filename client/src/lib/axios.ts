import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use( config => {
  const authToken = localStorage.getItem("AUTH_TOKEN")
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`
  }
  return config
}) //Añade el JWT del localStorage para las peticiones al backend

export default api

//esto se hace porque nuestras url para la api siempre son las mismas a excepcion de la utlima parte