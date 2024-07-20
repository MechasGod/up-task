import api from "../lib/axios";
import { DraftTask } from '../types/index';

export async function createTask ( { projectId, draftTask } : { projectId: string, draftTask: DraftTask} ) {
  try {
    
    const { data } = await api.post(`/projects/${projectId}/tasks`, draftTask)

    return data

  } catch (error) {
    console.log(error)
  }
}

export async function getTaskById ( projectId: string, taskId: string ) {
  try {

    const { data } = await api.get(`/projects/${projectId}/tasks/${taskId}`)

    return data   

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