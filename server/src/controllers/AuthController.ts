import type { Request, Response } from "express";
import UserModel from '../models/auth';
import bcrypt from "bcrypt"
import { TokenModel } from '../models/token';
import { generateToken } from '../utils/token';
import { AuthEmail } from '../emails/AuthEmail';

export class AuthController {

  static createAccount = async (req: Request, res: Response) => {
    try {

      //findOne devuelve undefined si no lo encuentra, en cambio find devuelve un array vacio
      //Lo que anularia nuestra comprobación
      const emailExists = await UserModel.findOne({ email: req.body.email })

      if (emailExists) return res.json("El email ya existe").status(409)

      const newUser = new UserModel(req.body)
      
      //Password hash
      const salt = await bcrypt.genSalt(10)
      //El salt es un string unico que se le aplica a la contraseña antes de hashearla
      //Hashearla hará que se encripte, pero no evita que si por ejemplo hay dos contraseñas iguales
      //El hash resultante sea diferete. Si por ejemplo tenemos la contraseña 123, y solamente la hasehamos
      //Por ejemplo resultará "a4bd6", y si otro usuario tiene la misma contraseña (123), entonces su hash también será
      //"a4b9ead1", lo que puede ocasionar problemas de seguridad. 
      //En cambio si se tiene un salt, que aseguré que la contraseña es única antes de hasheara, al haseharla, no será
      //Igual a ninguna otra.
      newUser.password = await bcrypt.hash(req.body.password, salt)

      //Generate token

      const token = new TokenModel({
        token: generateToken(),
        user: newUser.id,
      })

      //Send email
      AuthEmail.sendConfirmationEmail({
        user: newUser.name,
        email: newUser.email,
        token: token.token
      })
     
      await Promise.allSettled([newUser.save(), token.save()])
  
      res.json("Usuario creado correctamente").status(201)

    } catch (error) {
      res.json({error: "Hubo un error"}).status(500)
    }
  }

  static confirmateAccount = async (req: Request, res: Response) => {
    try {
      const { token: reqToken } = req.body
      const { userId } = req.params

      const currentUser = await UserModel.findOne({ _id: userId })

      if (!currentUser) return res.json("Usuario no encontrado").status(404)
        
      const userToken = await TokenModel.findOne({ user: userId })
      //En este caso no hay que hacer conversiones a string de los ObjectsId, mongoose las hace automaticamente
      //cuando se trata de filtros como el de find o findOne

      if (!userToken) return res.json("El usuario no tiene tokens activos").status(409)

      if (userToken.token === reqToken ) {
        currentUser.confirmed = true
      } else return res.json("El token es incorrecto").status(409)

      await Promise.allSettled([currentUser.save(), userToken.deleteOne()])

      res.json("Usuario confirmado correctamente").status(200)

    } catch (error) {
      res.json({error: "Hubo un error"}).status(500)
    }
  }

}