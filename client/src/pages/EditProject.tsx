import { getProjectById, updateProject } from '../api/ProjectAPI';
import { useForm  } from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { Link, useNavigate, useParams } from 'react-router-dom';
import { DraftProject } from '../types';



export const EditProjectPage = () => {

  const { register, formState: { errors }, handleSubmit, reset } = useForm<DraftProject>()
  const mutation = useMutation({
    mutationFn: updateProject,
    onError: (error) => {
      toast.error(error.message)
      navigate("/")
      reset()
    },
    onSuccess: (  ) => {
      toast.success("Editado correctamente!")
      queryClient.invalidateQueries({ queryKey: ["projects"] }) //explicación brutal de esto en el Notion
      queryClient.invalidateQueries({ queryKey: ["projectById", projectId ] })  
      navigate("/")
      reset()
    }
  })
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { projectId } = useParams()

  const { isLoading, isError, data: currentProject } = useQuery({
    queryKey: ["projectById", projectId],
    queryFn: () => getProjectById(projectId!),
  })


  const editProjectHandler = ( draftProject: DraftProject ) => {
    //un dato esque mutate no puede recibir mas de un parametro, por lo que si nuestra mutateFn recibe mas de uno,
    //hay que definirla con el parametro como objeto
    mutation.mutate({id: projectId!, body: draftProject}) 
  }

  if (isLoading) return (<h1 className="text-center font-bold text-3xl">Cargando...</h1>)
  if (isError) return (<h1 className="text-center font-bold text-3xl">Ha habido un error...</h1>)

  return (
    <form 
      className="px-10 bg-white space-y-6 roudned-sm shadow-lg py-5 mx-20"
      onSubmit={handleSubmit(editProjectHandler)}
    >
      <h1 className="text-3xl font-bold text-black-500">Editar tu proyecto</h1>
      <div className="flex flex-col">
        <span className="text-xl text-gray-400 ">Edita los campos de tu proyecto</span>

        <Link to="/" className="bg-purple-400 w-[350px] mt-2 py-2  text-center font-bold hover:bg-purple-500  text-white text-xl fonto-bold cursor-pointer transition-colors">
          Volver a los proyectos
        </Link>
      </div>
  
        <div className="flex flex-col space-y-2">
          <span className="text-xl font-bold">Nombre del proyecto</span>
          <input 
            defaultValue={currentProject?.projectName}
            type="text" id="projectNameInput" className="shadow-sm p-2 border-gray border-2" placeholder="Ej: Administrador de tareas"  
            { ...register("projectName", {
              required: "El nombre del proyecto no puede ir vacío",
              maxLength: { value: 50, message: "El nombre ingresado es muy largo" } 
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
            defaultValue={currentProject?.clientName}
            type="text" id="clientNameInput" className="shadow-sm p-2 border-gray border-2" placeholder="Ej: Spotify"  
            { ...register("clientName", {
              required: "El nombre del cliente no puede ir vacío",
              maxLength: { value: 40, message: "El nombre ingresado es muy largo" }
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
            defaultValue={currentProject?.description}
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
            value="Guardar" 
            className="bg-purple-400 text-white uppercase font-bold cursor-pointer hover:bg-purple-500 transition-colors px-20 py-3"/>
        </div>

    </form>
  )
}
