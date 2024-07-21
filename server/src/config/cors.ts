import { CorsOptions } from "cors"

export const corsConfig: CorsOptions = {
  origin: function(origin, callback) {
    const whiteList = [process.env.FRONTEND_URL]
    
    if (origin === undefined) {
      callback(null, true)
    } else if (whiteList.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("Error de CORS"))
    }
  }
}
