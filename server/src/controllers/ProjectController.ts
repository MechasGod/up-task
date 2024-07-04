import type { Request, Response } from "express"
import ProjectModel from '../models/project';

export class ProjectController {

  static getAllProjects = async (req: Request, res: Response) => {
    try {

      const projects = await ProjectModel.find({})
      res.json(projects)

    } catch (error) {
      console.log(error)
    }
  }
  
  static createProject = async (req: Request, res: Response) => {
    try {
      
      // const project = new ProjectModel(req.body) //instancia del modelo de proyecto 

      // await project.save()

      await ProjectModel.create(req.body) //otra manera de crearlo y guardarlo automaticamente

      res.send("Proyecto creado correctamente")

    } catch (error) {
      console.log(error)
    }
  }

  static getProjectById = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
      
      const project = await ProjectModel.findById(id).populate("tasks")

      if (!project) return res.status(404).json({error: "Proyecto no encontrado"})

      res.json(project).status(200)

    } catch (error) {
      console.log(error)
    }
  }

  static updateProject = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
      //por defecto el siguiente metodo retorna el proyecto sin actualizar
      const project = await ProjectModel.findByIdAndUpdate(id, req.body, { new: true })
      //le debemos añadir un objeto options como tercer parametro y pasarle new: true para que retorne el actualizado
      //OJO esto es solo para poder mostrarlo en la respuesta del json

      if (!project) return res.status(404).json({error: "Proyecto no encontrado"})
        
      await project.save()
      
      res.json(project)

    } catch (error) {
      console.log(error)
    }
  }

  static deleteProject = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
      
      const project = await ProjectModel.findByIdAndDelete(id)

      if (!project) return res.status(404).json({error: "Proyecto no encontrado"})

      res.send("Proyecto eliminado correctamente")

    } catch (error) {
      console.log(error)
    }
  }
}