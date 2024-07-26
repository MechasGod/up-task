import api from "../lib/axios";

export async function getUserIdByEmailTEAM ({ projectId, email }: { projectId: string, email: string } ) {
  try {
    
    const { data } = await api.get(`projects/${projectId}/team/${email}`)

    return data

  } catch (error) {
    console.log(error)
  }
}

export async function addMember ( { projectId, id }: { projectId: string, id: string }  ) {
  try {
    
    const { data } = await api.post(`projects/${projectId}/team`, { id })

    return data

  } catch (error) {
    console.log(error)
  }
}

export async function getAllMembers ( projectId: string ) {
  try {
    
    const { data } = await api.get(`projects/${projectId}/team`)

    return data

  } catch (error) {
    console.log(error)
  }
}