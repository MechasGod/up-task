import { Router } from "express"
import { body, param } from "express-validator"
import { handleErrors } from '../middlewares/validation';
import { AuthController } from '../controllers/AuthController';

const authRouter = Router()


authRouter.post("/create-account", 
  body("name").notEmpty().withMessage("El nombre no debe ir vacío!"),
  body("password").notEmpty().withMessage("La contraseña no debe ir vacío!").isLength({ min: 8 }).withMessage("Password muy corto"),
  body("email").notEmpty().withMessage("El email no debe ir vacío!").isEmail().withMessage("Email no valido"),
  //Haremos nuestra propia validación del password de confirmación al crear una cuenta,
  //custom recibe un callback en el que se le pasa el value que es el value que se le envio a password_confirmation y 
  //un objeto llamado meta que contiene la request y podemos acceder a todo el body de la request por medio de este
  body("password_confirmation").custom((value, { req }) => value === req.body.password)
    .withMessage("El password de confirmación no es igual"),
  handleErrors,
  AuthController.createAccount )

  authRouter.patch(`/confirm-account/:userId`,
    param("userId").isMongoId().withMessage("Id no valido"),
    body("token").notEmpty().withMessage("El token no puede ir vacio").isLength({ min: 6, max: 6 })
      .withMessage("Token no valido"),
    handleErrors,
    AuthController.confirmateAccount
  )


export default authRouter