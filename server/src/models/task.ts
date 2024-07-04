import mongoose, { Schema, Document, Types } from "mongoose"

const taskStatus = {
  PENDING: "pending",
  ON_HOLD: "onHold",
  IN_PROGRESS: "inProgress",
  UNDER_REVIEW: "undeReview",
  COMPLETED: "completed"
} as const //hace que todo el objeto readonly, solo se puede leer

export type TaskStatus = typeof taskStatus[keyof typeof taskStatus] //revisar explicación

export interface TaskType extends Document {
  name: string,
  description: string,
  project: Types.ObjectId,
  status: TaskStatus
}

const TaskSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  project: {
    type: Types.ObjectId,
    ref: "Project", //se requiere para realizar operaciones del tipo populate para reemplazar automaticamente ese ObejctId 
    //por el documento completo
    required: true
  },
  status: {
    type: String,
    enum: Object.values(taskStatus), //enum sirve para restringir a datos especificos los valores que puede tomar status
    //recibe un array, que se lo damos con Object.values y le pasamos taskStatus
    default: taskStatus.PENDING

  }
}, { timestamps: true })

const TaskModel = mongoose.model<TaskType>("Task", TaskSchema)

export default TaskModel