import type { Request, Response, NextFunction } from "express"
import TaskModel, { TaskType } from '../models/task';

declare global {
  namespace Express {
    interface Request {
      task: TaskType
    }
  }
}

export const ValidateTaskExists = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const task = await TaskModel.findById(req.params.id)
    if (!task) return res.json({error: "La tarea no existe"}).status(404)
    req.task = task

    next()

  } catch (error) {
    console.log(error)
  }
}