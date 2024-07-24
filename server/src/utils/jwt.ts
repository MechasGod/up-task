import jwt from "jsonwebtoken"

interface UserPayload {
  id: string
}

export const generateJWT = ( userPayload: UserPayload ) => {
  const token = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: "180d" })
  return token
}