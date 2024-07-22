import bcrypt from 'bcrypt';

export const generateToken = () => Math.floor(100000 + Math.random() * 900000).toString()

export const comparePasswords = async ( enteredPassword: string, storeHash: string ) => {
  return await bcrypt.compare(enteredPassword, storeHash)
}