import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

export default api

//esto se hace porque nuestras url para la api siempre son las mismas a excepcion de la utlima parte