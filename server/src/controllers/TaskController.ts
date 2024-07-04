import { Request, Response } from 'express'
import ProjectModel from '../models/project';
import TaskModel, { TaskType } from '../models/task';
import { Model } from 'mongoose';

export class TaskController {

  static createTask = async (req: Request, res: Response) => {
    try {

      const project = req.project
      
      const task = await new TaskModel(req.body) //uso esta forma porque si uso create va a validar que tenga el project
      //como no lo tendra, mandara un error a consola
      
      task.project = project.id
      project.tasks.push(task.id)
      
      //Promise.allSettled hace que se ejecute la promesa si ambas promesas se cumplen
      await Promise.allSettled([task.save(), project.save()])

      res.json(task).status(201)

    } catch (error) {
      console.log(error)
    }
  }

  static getTasks = async (req: Request, res: Response) => {
    try {
      //a Model.find se le puede pasar un objeto de filtro como parametro. En este caso, le estamos especificando
      //que busque dentro de la collecion de tasks todas las task cuyo proyecto coincida con el de la url
      const tasks = await TaskModel.find({project: req.project.id}).populate("project")

      //hasta aqui lo que hace es traerse las tasks, pero en el atributo project de cad task aparece la ObjectId del proyecto
      //para que se traiga la información completa (el documento) del proyecto usaremos populate, y le pasamos como parametro
      //el atributo de cada task en el array de tasks que sabemos que tiene las ObjectId's y que queremos que popule 

      res.json(tasks).status(200)


    } catch (Error) {
      console.log(Error)
    }
  }

  static getTaskById = async (req: Request, res: Response) => {
    try {

       if (req.task.project.toString() !== req.project.id) return res.json({ error: "La tarea no pertenece al proyecto" }).status(400)

      //hay que tener cuidado con esa comparación, porque cuando accedes a la id de un documento, mongoose la retorna
      //directamente, es decir ya en string, mientras que si accedes a una propiedad de un documento cuyo tipo de dato
      //sea ObjectId, te devolvera directamente el ObjectId, no string, por eso hacemos la conversion


      res.json(req.task).status(200)
    } catch (error) {
      console.log(error)
    }
  }

  static updateTask = async (req: Request, res: Response) => {
    try {

      if (req.task.project.toString() !== req.project.id) return res.json({ error: "La tarea no pertenece al proyecto" }).status(400)

      req.task.name = req.body.name
      req.task.description = req.body.description

      await req.task.save()

      res.json(req.task).status(200)

    } catch (error) {
      console.log(error)
    }
  }

  static updateTaskState = async (req: Request, res: Response) => {
    try {
      const task = req.task
      
      if (!req.body.status) return res.json({ error: "No se ha enviado un status valido" }).status(400)
        
      task.status = req.body.status
      await task.save()
      res.json(task).status(200)

    } catch (error) {
      console.log(error)
    }
  }

  static deleteTask = async (req: Request, res: Response) => {
    try {

      if (req.task.project.toString() !== req.project.id) return res.json({ error: "La tarea no pertenece al proyecto" }).status(400)
        
        
      req.project.tasks = req.project.tasks.filter(task => task.toString() !== req.task.id) //revisar por que funciona
        
      
      await Promise.allSettled([req.task.deleteOne(), req.project.save()])

      res.json("Eliminado correctamente")
        
    } catch (error) {
      console.log(error)
    }
  }

}