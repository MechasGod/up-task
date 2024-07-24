import type { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import UserModel, { IUser } from '../models/auth';

declare global {
  namespace Express {
    interface Request {
      user?: IUser
    }
  }
}

export const authenticate = async (req: Request, res:Response, next: NextFunction) => {
  
  const bearer = req.headers.authorization

  if (!bearer) return res.json({ error: "No autorizado" }).status(401)

  const [ ,token] = bearer.split(" ")
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (decoded && typeof decoded === "object") { 
      const user = await UserModel.findById(decoded.id).select("_id name email")
      if (!user) return res.json({ error: "Usuario no encontrado" }).status(404)
      req.user = user
    }


  } catch (error) {
    res.json({ error: "Token no valido" }).status(404)
  }



  next()
}