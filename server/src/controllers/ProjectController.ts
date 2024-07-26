import type { Request, Response } from "express"
import ProjectModel from '../models/project';

export class ProjectController {

  static getAllProjects = async (req: Request, res: Response) => {
    try {

      const userId = req.user.id

      const projects = await ProjectModel.find({
        $or: [
          { manager: userId },
          { team: { $in: [userId] } }
        ]
      });

      res.json(projects)

    } catch (error) {
      console.log(error)
    }
  }
  
  static createProject = async (req: Request, res: Response) => {
    try {
      
      // const project = new ProjectModel(req.body) //instancia del modelo de proyecto 

      // await project.save()
      
      //Manager 
      await ProjectModel.create({
        ...req.body,
        manager: req.user
      }) //otra manera de crearlo y guardarlo automaticamente

      res.send("Proyecto creado correctamente")

    } catch (error) {
      console.log(error)
    }
  }

  static getProjectById = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
      
      const project = await ProjectModel.findById(id).populate("tasks")

      if (project.manager.toString() !== req.user.id.toString() && !(project.team.some(member => member.toString() === req.user.id)) ) {
        console.log("No es del proyecto")
        return res.json({ error: "Proyecto no encontrado" }).status(404)
      }

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

      if (project.manager.toString() !== req.user.id.toString()) {
          return res.json({ error: "Proyecto no encontrado" }).status(404)
      }
        
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

      if (project.manager.toString() !== req.user.id.toString()) {
          return res.json({ error: "Proyecto no encontrado" }).status(404)
      }

      res.send("Proyecto eliminado correctamente")

    } catch (error) {
      console.log(error)
    }
  }
}