import api from "../lib/axios";
import { UserSignUp, userSignUpSchema } from '../types/index';

export async function createAccount ( userSignupData: UserSignUp ) {
  try {

    const req = userSignUpSchema.safeParse(userSignupData)

    if (req.success) {
      const { data } = await api.post("/auth/create-account", req.data)
      return data
    }

    throw new Error(req.error.message)
    
  } catch (error) {
    console.log(error)
  }
}

export async function getUserIdByEmail ( email: string ) {
  try {
    
    const { data: response } = await api.get(`/auth/getUserIdByEmail/${email}`)

    return response

  } catch (error) {
    if (error) throw new Error("Ha habido un error en getUserIdByEmail")
  }
}

export async function confirmAccount ( { userId, token }: { userId: string, token: string } ) {
  try {
    
    const { data: response } = await api.patch(`/auth/confirm-account/${userId}`, {token})

    console.log(response)
    return response


  } catch (error) {
    console.log(error)
  }
}

export async function getNewAuthCode ( userId: string ) {
  try {
    
    const { data: response } = await api.get(`/auth/getNewAuthCode/${userId}`)

    return response

  } catch (error) {
    console.log(error)
  }
}

export async function forgotPasword ( email: string ) {
  try {

    const { data: response } = await api.post(`/auth/forgot-password`, { email })  
    
    return response

  } catch (error) {
    console.log(error)
  }
}

interface RestorePassData {
  userId: string,
  token: string,
  password: string,
  confirm_password: string
}

export async function restorePassword ( data: RestorePassData ) {
  try {

    const { data: response } = await api.patch(`/auth/restore-password/${data.userId}`, {
      token: data.token,
      password: data.password,
      confirm_password: data.confirm_password
    })  
    
    return response

  } catch (error) {
    console.log(error)
  }
}
 
