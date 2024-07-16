import { z } from "zod"


// Projects

export const projectSchema = z.object({
  _id: z.string(),
  projectName: z.string(),
  clientName: z.string(),
  description: z.string(),
})

export type Project = z.infer<typeof projectSchema>
export type DraftProject = Omit<Project, "_id"> 
export type Projects = z.infer<typeof projectsSchema>

export const projectsSchema = z.array(projectSchema)

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