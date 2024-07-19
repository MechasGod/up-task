import { z } from "zod"


//Tasks
export const taskStatusSchema = z.enum([ "pending" , "onHold" , "inProgress" , "undeReview" , "completed" ])

export const taskSchema = z.object({
  _id: z.string(),
  description: z.string(),
  project: z.string(),
  name: z.string(),
  status: taskStatusSchema
})

export const tasksSchema = z.array(taskSchema)

export type Task = z.infer<typeof taskSchema>
export type DraftTask = Pick<Task, "name" | "description">

// Projects

export const projectSchema = z.object({
  _id: z.string(),
  projectName: z.string(),
  clientName: z.string(),
  description: z.string(),
  tasks: z.array(taskSchema).or(z.array(z.string())) //asi se indica que también podrian ser un string, lo cual es cierto
  //pues cuando hacemos la petición desde el dashboard el backend no popula los tasks, y los manda como un arreglo de id's
})

export type Project = z.infer<typeof projectSchema>
export type DraftProject = Omit<Project, "_id"> 
export type Projects = z.infer<typeof projectsSchema>

export const projectsSchema = z.array(projectSchema)