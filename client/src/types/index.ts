import { z } from "zod"

// Projects

export const projectSchema = z.object({
  _id: z.string(),
  projectName: z.string(),
  clientName: z.string(),
  description: z.string(),
})

export const projectsSchema = z.array(projectSchema)

export type Project = z.infer<typeof projectSchema>
export type DraftProject = Omit<Project, "_id"> 
export type Projects = z.infer<typeof projectsSchema>