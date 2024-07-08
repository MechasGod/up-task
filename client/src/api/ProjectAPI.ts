import api from "../lib/axios";
import { DraftProject, projectSchema, projectsSchema } from '../types';

export async function createProject( formData: DraftProject ) {
  try {

    const { data } = await api.post("/projects", formData)

    if (data.error) throw new Error("errorUponCreateProject")
    else return data
    
  } catch(error) {
      // Verificar si el error es una instancia de Error antes de acceder a su propiedad message
      if (error instanceof Error && error.message === "errorUponCreateProject") {
        throw new Error("Hubo un error al crear el proyecto");
      } else {
        // Manejar otros tipos de errores desconocidos
        throw new Error("Error desconocido al crear el proyecto");
      }
  }
}

export async function getAllProjects() {
  try {
    
    const { data } = await api.get("/projects")

    const result = projectsSchema.safeParse(data)

    if (result.success) return result.data
    
    console.log(result.error)

  } catch (error) {
    console.log(error)
  }
}

export async function getProjectById( id: string ) {
  try {
    
    const { data } = await api.get(`/projects/${id}`)

    const result = projectSchema.safeParse(data)

    if (result.success) return result.data
    
    console.log(result.error)

  } catch (error) {
    console.log(error)
  }
}

export async function updateProject({id, body}: {id: string, body: DraftProject} ) {
  try {
    
    const { data } = await api.put(`/projects/${id}`, body)

    const result = projectSchema.safeParse(data)

    if (result.success) return result.data
    
    console.log(result.error)
    
  } catch (error) {
    throw new Error(error.message)
  }
}