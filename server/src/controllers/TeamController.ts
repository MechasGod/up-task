import { Request, Response } from 'express'
import UserModel from '../models/auth';
import ProjectModel from '../models/project';

export class TeamController {
  static findMemberByEmail = async (req: Request, res: Response) => {
    try {
      
      const { email } = req.params
    
      const currentUser = await UserModel.findOne({ email }).select("id email name")

      if (!currentUser) return res.json({ success: false, msg: "usuario no encontrado" }).status(404)

      res.json(currentUser).status(200)

    } catch (error) {
      res.json({ success: false, msg: error.message  }).status(500)
    }
  }

  static addMemberById = async (req: Request, res: Response) => {
    try {
      
      const { id } = req.body

      const currentUser = await UserModel.findById(id).select("id")

      if (!currentUser) return res.json({ success: false, msg: "usuario no encontrado" }).status(404)

      if ( req.project.team.some(member => member.toString() === currentUser.id.toString())) {
        return res.json({ success: false, msg: "El usuario ya existe en el proyecto" }).status(409)
      }

      req.project.team.push(currentUser)

      await req.project.save()

      res.json({ success: true, msg: "Usuario agregado correctamente" }).status(200)

    } catch (error) {
      res.json({ success: false, msg: error.message  }).status(500)
    }
  }

  static deleteMemberById = async (req: Request, res: Response) => {
    try {
      
      const { id } = req.body

      const currentUser = await UserModel.findById(id).select("id")

      if (!currentUser) return res.json({ success: false, msg: "usuario no encontrado" }).status(404)

      if ( !req.project.team.some(member => member.toString() === currentUser.id.toString())) {
          return res.json({ success: false, msg: "El usuario no existe en el proyecto" }).status(409)
      }

      req.project.team = req.project.team.filter(member => member.toString() !== currentUser.id.toString())

      await req.project.save()

      res.json({ sucess: true, msg: "Miembro eliminado correctamente" })

    } catch (error) {
      res.json({ success: false, msg: error.message  }).status(500)
    }
  }

  static getProjectMembers = async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params
      const project = await ProjectModel.findById(projectId).populate({
        path: "team",
        select: "id name email"
      })

      //esta es la manera de hacer el select con el populate en mongoose

      res.json(project.team).status(200)

    } catch (error) {
      res.json({ success: false, msg: error.message  }).status(500)
    }
  }

}

