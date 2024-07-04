import mongoose, { connect } from "mongoose"
import colors from "colors"
import dotenv from "dotenv"

dotenv.config()


export const connectToDb = async () => {
  try {
    
    const connection = await mongoose.connect(process.env.DATABASE_URL)
    const url = `${connection.connection.host}:${connection.connection.port}`
    console.log(colors.cyan.bold(`Mongo db conectado en ${url}`))

  } catch (error) {
    console.log(error.message)
    process.exit(1)
  }
}
