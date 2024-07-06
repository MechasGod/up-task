import api from "../lib/axios";
import { DraftProject, projectSchema } from '../types';

export async function createProject( formData: DraftProject ) {
  try {

    const { data } = await api.post("/projects", formData)

    console.log(data)

    // const result = projectSchema.safeParse(data)

  } catch(error) {
    console.log(error)
  }
}