import mongoose, { Schema, Document, PopulatedDoc, Types } from 'mongoose'

interface IToken extends Document {
  token: string,
  user: Types.ObjectId,
  createdAt: Date
}

const tokenSchema: Schema = new Schema({
  token: {
    type: String,
    trim: true,
    required: true
  },
  user: {
    type: Types.ObjectId,
    required: true,
    ref: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now(), //al habilitarlo de esta forma nos habilita la propeidad expires que lo elimina automaticamente
    //dependiendo del tiempo que se le de
    expires: "10m"
  },
})

export const TokenModel = mongoose.model<IToken>("Token", tokenSchema)