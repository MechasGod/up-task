import api from "../lib/axios";
import { DraftTask, taskSchema } from '../types/index';

export async function createTask ( { projectId, draftTask } : { projectId: string, draftTask: DraftTask} ) {
  try {
    
    const { data } = await api.post(`/projects/${projectId}/tasks`, draftTask)

    return data

  } catch (error) {
    console.log(error)
  }
}

export async function getDraftTaskById ( projectId: string, taskId: string ) {
  try {

    const { data } = await api.get(`/projects/${projectId}/tasks/${taskId}`)

    return data   

  } catch (error) {
    console.log(error)
  }
}

export async function getTaskById ( projectId: string, taskId: string ) {
  try {

    const { data } = await api.get(`/projects/${projectId}/tasks/${taskId}`)

    const result = taskSchema.safeParse(data)

    if (result.success) return result.data

    console.log(result.error)

  } catch (error) {
    console.log(error)
  }
}

interface UpdateTaskParams { 
  projectId: string,
  taskId: string,
  draftTask: DraftTask
}

export async function updateTask ( { projectId, taskId, draftTask }: UpdateTaskParams) {
  try {
    
    const { data } = await api.put(`/projects/${projectId}/tasks/${taskId}`, draftTask)

    return data

  } catch (error) {
    console.log(error)
  }
}

export async function updateTaskStatus ( 
  { projectId, taskId, status }: { projectId: string, taskId: string, status: string }
) {
  try {
    
    const { data } = await api.patch(`/projects/${projectId}/tasks/${taskId}`, { status })

    return data

  } catch (error) {
    console.log(error)
  }
}


export async function deleteTask ( { projectId, taskId }: { projectId: string, taskId: string } ) {
  try {
    
    const { data } = await api.delete(`/projects/${projectId}/tasks/${taskId}`)

    return data

  } catch (error) {
    console.log(error)
  }
}


