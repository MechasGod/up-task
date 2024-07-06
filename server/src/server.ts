import express from "express"
import { connectToDb } from './config/db';
import projectsRouter from './routes/projectRoutes';
import cors from "cors"
import { corsConfig } from './config/cors';


const app = express()

//Express Configs
app.use(express.json())
app.disable("x-powered-by")

//DB
connectToDb()

//CORS
app.use(cors(corsConfig))

//Routes
app.use("/projects", projectsRouter)


export default app