import type { Request, Response } from "express";
import UserModel from '../models/auth';
import bcrypt from "bcrypt"
import { TokenModel } from '../models/token';
import { comparePasswords, generateToken } from '../utils/token';
import { AuthEmail } from '../emails/AuthEmail';
import { generateJWT } from '../utils/jwt';

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
        token: token.token,
        userId: newUser.id
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

      if (!currentUser) return res.json({ auth: false, msg: "Usuario no encontrado" }).status(404)
        
      const userToken = await TokenModel.findOne({ user: userId })
      //En este caso no hay que hacer conversiones a string de los ObjectsId, mongoose las hace automaticamente
      //cuando se trata de filtros como el de find o findOne

      if (!userToken) return res.json({ auth: false, msg: "El token no está activo o a expirado" }).status(409)

      if (userToken.token === reqToken ) {
        currentUser.confirmed = true
      } else return res.json({ auth: false, msg:"El token es incorrecto" }).status(409)

      await Promise.allSettled([currentUser.save(), userToken.deleteOne()])

      res.json({ auth: true, msg: "Usuario confirmado correctamente" }).status(200)

    } catch (error) {
      res.json({error: "Hubo un error"}).status(500)
    }
  }

  static login = async (req: Request, res: Response) => {
    try {
      
      const { email, password } = req.body

      const currentUser = await UserModel.findOne({ email })

      if (!currentUser) return res.json({ login: false, msg: "Esta cunta no existe" }).status(404)
      if (!currentUser.confirmed) return res.json({ login: false, msg:"Esta cuenta no esta confirmada" }).status(401)
      
      
      const isCorrectPassword = await comparePasswords(password, currentUser.password)

      if (!isCorrectPassword) return res.json({ login: false, msg: "Acceso denegado, usuario o contraseña incorrectos" })
      
      const token = generateJWT({ id: currentUser.id })
      
      res.json({ login: true, token }).status(200)

    } catch (error) {
      res.json({error: "Hubo un error"}).status(500)
    }
  }

  static getUserIdByEmail = async (req: Request, res: Response) => {
    try {
      
      const { email } = req.params

      const currentUser = await UserModel.findOne({ email })

      if (!currentUser) return res.json("Usuario no encontrado").status(404)

      res.json(currentUser.id).status(200)

    } catch (error) {
      res.json({ error: "Hubo un error" }).status(500)
    }
  }

  static getNewAuthToken = async (req: Request, res: Response) => {
    try {
      
      const { userId } = req.params

      const currentUser = await UserModel.findOne({ _id: userId })
      //usar el _id para estas comparaciones

      if (!currentUser) return res.json({ sucess: false, msg: "Usuario no encontrado" }).status(404)

      const userHasToken = await TokenModel.findOne({ user: userId })

      if (userHasToken) return res.json({ success: false, msg: "Ya hay un token activo de esta cuenta, verificar email" }).status(409)

      const newToken = new TokenModel({
        token: generateToken(),
        user: userId
      })

      await newToken.save()

      AuthEmail.sendConfirmationEmail({
        user: currentUser.name,
        email: currentUser.email,
        token: newToken.token,
        userId: currentUser.id
      })

      res.json({ success: true, msg:"Código enviado al correo correctamente" }).status(200)
      
    } catch (error) {
      res.json({ error: "Hubo un error" }).status(500)
    }
  }

  static forgotPassword = async (req: Request, res: Response) => {
    try {
      
      const { email: reqEmail } = req.body

      const currentUser = await UserModel.findOne({ email: reqEmail })

      if (!currentUser) return res.json({ success: false, msg: "El usuario no existe, verifique el correo" }).status(404)
      if (!currentUser.confirmed) return res.json({ success: false, msg: "Cuenta no confirmada, verifique el correo" }).status(409)

      

      const newToken = new TokenModel({
        token: generateToken(),
        user: currentUser.id
      })

      await newToken.save()

      AuthEmail.sendReqPasswordEmail({
        email: currentUser.email,
        token: newToken.token,
        user: currentUser.name,
        userId: currentUser.id
      })     
      
      res.json({ success: true, msg: "Correo de restablecimiento enviado correctamente" })

    } catch (error) {
      res.json({ error: "Hubo un error" }).status(500)
    }
  }

  static restorePassword = async (req: Request, res: Response) => {
    try {
      
      const { userId } = req.params
      const { token: reqToken, password: newPassword } = req.body

      const currentUser = await UserModel.findOne({ _id: userId })

      if (!currentUser) return res.json({ sucess: false, msg: "Usuario no encontrado" }).status(404)
    
      const currentToken = await TokenModel.findOne({ token: reqToken })

      if (!currentToken) return res.json({ success: false, msg: "Este enlace ha caducado" })

      const salt = await bcrypt.genSalt(10) 
      const hashedPassword = await bcrypt.hash(newPassword, salt)  
      
      currentUser.password = hashedPassword
      
      await Promise.allSettled([ currentUser.save(), currentToken.deleteOne() ])

      res.json({ success: true, msg: "Contraseña restablecida con exito" })

    } catch (error) {
      res.json({ error: "Hubo un error" }).status(500)
    }
  }

  static user = (req: Request, res: Response) => {
    return res.json(req.user).status(200)
  }

}
