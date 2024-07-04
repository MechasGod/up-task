import mongoose, { Schema, Document, PopulatedDoc, Types } from 'mongoose'
import { TaskType } from './task';

export type ProjectType = Document & {
  projectName: string,
  clientName: string,
  description: string,
  tasks: PopulatedDoc<TaskType & Document>[]
}

const ProjectSchema: Schema = new Schema({
  projectName: {
    type: String,
    required: true,
    trim: true, //corta los espacios al inicio y al final
  },
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  tasks: [
    {
      type: Types.ObjectId,
      ref: "Task" //explicación en mi Notion
    }
  ]
}, { timestamps: true })

const ProjectModel = mongoose.model<ProjectType>("Project", ProjectSchema) //El nombre del modelo tiene que ser unico
export default ProjectModel

