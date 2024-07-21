import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string,
  password: string,
  name: string,
  confirmed: boolean
}

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  confirmed: {
    type: Boolean,
    required: true,
    trim: true,
    default: false
  }
}, { timestamps: true })

const UserModel = mongoose.model<IUser>("User", userSchema)

export default UserModel