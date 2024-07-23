import { transport } from '../config/nodemailer';

interface IData {
  user: string,
  email: string,
  token: string,
  userId: string
}

export class AuthEmail {
  static sendConfirmationEmail = async ( data: IData ) => {
    try {
      await transport.sendMail({
        from: "UpTask <upTaskAdmin@gmail.com>",
        to: data.email,
        subject: "UpTask - Verificación de la cuenta",
        text: `UpTask - Confirma tu cuenta`,
        html: `<p>UpTask - Hola ${data.user}, ya estas a un paso de crear tu cuenta en UpTask</p>
              <p>Todo casi listo, solo debes confirmar tu cuenta</p>
              <p>Visita el siguiente enlace: </p>
              <a href="${process.env.FRONTEND_URL}/auth/confirm-account/${data.userId}">Confirmar cuenta</a>
              <p>E ingresa el siguiente código: <b>${data.token}</b> </p>
              <p>El código expira en 10 minutos!</p>
        `
      })
    } catch (error) {
      console.log(error)
    }
  }

  static sendReqPasswordEmail = async ( data: IData ) => {
    try {
      await transport.sendMail({
        from: "UpTask <upTaskAdmin@gmail.com>",
        to: data.email,
        subject: "UpTask - Recuperación de la cuenta",
        text: `UpTask - Recupera tu contraseña`,
        html: `<p>UpTask - Hola ${data.user}, visita el siguiente link para restablecer tu contraseña en UpTask</p>
              <a href="${process.env.FRONTEND_URL}/auth/forgot-password/${data.userId}?token=${data.token}">Confirmar cuenta</a>

              <p>Este link expira en 15 minutos!</p>
        `
      })
    } catch (error) {
      console.log(error)
    }
  }
}