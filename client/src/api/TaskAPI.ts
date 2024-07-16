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