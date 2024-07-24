import { Router } from "express"
import { body, param } from "express-validator"
import { handleErrors } from '../middlewares/validation';
import { AuthController } from '../controllers/AuthController';
import { authenticate } from '../middlewares/jwtAuth';

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
  AuthController.createAccount)

authRouter.post("/login",
  body("email").notEmpty().withMessage("El email no debe ir vacío!").isEmail().withMessage("Email no valido"),
  body("password").notEmpty().withMessage("La contraseña no debe ir vacía"),
  handleErrors,
  AuthController.login)

authRouter.patch(`/confirm-account/:userId`,
    param("userId").isMongoId().withMessage("Id no valido"),
    body("token").notEmpty().withMessage("El token no puede ir vacio").isLength({ min: 6, max: 6 })
      .withMessage("Token no valido"),
    handleErrors,
    AuthController.confirmateAccount)

authRouter.get("/getUserIdByEmail/:email", 
  param("email").notEmpty().withMessage("Debe incluir un email").isEmail().withMessage("Email no valido"),
  handleErrors,
  AuthController.getUserIdByEmail
 )

authRouter.get("/getNewAuthCode/:userId",
  param("userId").notEmpty().withMessage("El id del usuario no debe ir vacio").isMongoId().withMessage("Id no valido"),
  handleErrors,
  AuthController.getNewAuthToken
 )

authRouter.post("/forgot-password",
  body("email").notEmpty().withMessage("El email del usuario no debe ir vacio").isEmail().withMessage("Correo no valido"),
  handleErrors,
  AuthController.forgotPassword
)

authRouter.patch("/restore-password/:userId",
  param("userId").notEmpty().withMessage("El id del usuario no debe ir vacio").isMongoId().withMessage("Id no valido"),
  body("token").notEmpty().withMessage("El token no debe ir vacio").isLength({ min: 6, max: 6 }).withMessage("Token no valido"),
  body("password").notEmpty().withMessage("El password no debe ir vacio").isLength({ min: 8 }),
  body("confirm_password").notEmpty().withMessage("El password de confirmacion no puede ir vacio")
    .custom((value, { req }) => value === req.body.password ).withMessage("Los passwords no coinciden"),
  handleErrors,
  AuthController.restorePassword
)

authRouter.get("/user",
  authenticate,
  AuthController.user
 )


export default authRouter