import { createProject } from '../api/ProjectAPI';
import { useForm  } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { Link, useNavigate } from 'react-router-dom';


interface DraftProject {
  projectName: string,
  clientName: string
  description: string
}

export const CreateProjectPage = () => {

  const { register, formState: { errors }, handleSubmit, reset } = useForm<DraftProject>()
  const mutation = useMutation({
    mutationFn: createProject,
    onError: (error) => {
      toast.error("Ha habido un error, intentelo más tarde")
      console.log(error)
      navigate("/")
      reset()
    },
    onSuccess: ( data ) => {
      toast.success(data)
      navigate("/")
      reset()
    }
  })
  const navigate = useNavigate()

  const createProjectHandler = ( draftProject: DraftProject ) => {

    // const createdProject = await createProject(draftProject)
    mutation.mutate(draftProject) //retorna una promesa, se le pasa el argumento que esperamos cuando definimos
    //mutationFn. NO ES NECESARIO EL mutateAsync ni el await ni el async ya que react query maneja la 
    //asincronia en automatico

  }

  return (
    <form 
    className="px-10 bg-white space-y-6 roudned-sm shadow-lg py-5 mx-20"
      onSubmit={handleSubmit(createProjectHandler)}
    >
      <h1 className="text-3xl font-bold text-black-500">Crea tu proyecto</h1>
      <div className="flex flex-col">
        <span className="text-xl text-gray-400 ">Rellena el siguiente formulario para crear tu proyecto</span>

        <Link to="/" className="bg-purple-400 w-[350px] mt-2 py-2  text-center font-bold hover:bg-purple-500  text-white text-xl fonto-bold cursor-pointer transition-colors">
          Volver a los proyectos
        </Link>
      </div>
  
        <div className="flex flex-col space-y-2">
          <span className="text-xl font-bold">Nombre del proyecto</span>
          <input 
            type="text" id="projectNameInput" className="shadow-sm p-2 border-gray border-2" placeholder="Ej: Administrador de tareas"  
            { ...register("projectName", {
              required: "El nombre del proyecto no puede ir vacío",
              maxLength: { value: 40, message: "El nombre ingresado es muy largo" }
            } ) }
          />
          {errors.projectName && (
            <div 
            className="bg-red-400 py-3 text-white px-2 uppercase font-bold">
              {errors.projectName?.message?.toString()}
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <span className="text-xl font-bold">Nombre del cliente</span>
          <input 
            type="text" id="clientNameInput" className="shadow-sm p-2 border-gray border-2" placeholder="Ej: Spotify"  
            { ...register("clientName", {
              required: "El nombre del cliente no puede ir vacío",
              maxLength: { value: 30, message: "El nombre ingresado es muy largo" }
            })}
          />
          {errors.clientName && (
            <div 
            className="bg-red-400 py-3 text-white px-2 uppercase font-bold">
              {errors.clientName?.message?.toString()}
            </div>
          )}
        </div>


        <div className="flex flex-col space-y-3">
          <span className="text-xl font-bold">Descripción del proyecto</span>
          <textarea 
            id="descriptionInput" className="px-2 shadow-sm p-1 border-gray border-2" placeholder="Ej: Proyecto"
            { ...register("description", {
              required: "La descripción del proyecto no puede ir vacía"
            } ) }
          />
           {errors.description && (
            <div 
            className="bg-red-400 py-3 px-2 text-white uppercase font-bold">
              {errors.description?.message?.toString()}
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <input 
            type="submit" 
            value="Crear" 
            className="bg-purple-400 text-white uppercase font-bold cursor-pointer hover:bg-purple-500 transition-colors px-20 py-3"/>
        </div>

    </form>
  )
}
