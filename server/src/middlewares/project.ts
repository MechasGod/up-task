import type { Request, Response, NextFunction } from "express"
import ProjectModel, { ProjectType } from '../models/project';

declare global {
  namespace Express {
    interface Request {
      project: ProjectType
    }
  }
} //Con declare global vamos a modificar el type en todos los archivos, namespace Express nos permite trabajar en los 
//types de express, definimos otra vez la interface de Request, que no va a sobreescribir la original, solo agregarle
//las propiedades que le demos acontinuación. 

export async function ValidateProjectExists(req: Request, res:Response, next: NextFunction) {
  const { projectId } = req.params
  try {
    
    const project = await ProjectModel.findById(projectId)
      
    if (!project) return res.status(404).json({error: "Proyecto no encontrado"})
    
    req.project = project 
    next()

  } catch (error) {
    console.log(error)
    res.status(500).json("Hubo un error en el servidor")
  }
}