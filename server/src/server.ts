import express from "express"
import { connectToDb } from './config/db';
import projectsRouter from './routes/projectRoutes';

const app = express()

//Express Configs
app.use(express.json())
app.disable("")

//DB
connectToDb()

//Routes
app.use("/projects", projectsRouter)


export default app