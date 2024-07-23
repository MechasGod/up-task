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

