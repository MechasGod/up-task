import { useForm  } from "react-hook-form"


interface DraftProject {
  name: string,
  description: string
}

export const CreateProjectPage = () => {

  const { register, formState: { errors }, handleSubmit, reset } = useForm<DraftProject>()

  const createProjectHandler = ( draftProject: DraftProject ) => {

    reset()
  }

  return (
    <form 
      className="px-10 space-y-6"
      onSubmit={handleSubmit(createProjectHandler)}
    >
        <h1 className="text-2xl font-bold text-black-500 mt-5">Crea tu proyecto</h1>

        <div className="flex flex-col space-y-2">
          <span className="text-xl font-bold">Nombre del proyecto</span>
          <input 
            type="text" id="projectNameInput" className="shadow-sm p-2" placeholder="Ej: Administrador de tareas"  
            { ...register("name", {
              required: "El nombre del proyecto no puede ir vacío",
              maxLength: { value: 40, message: "El nombre ingresado es muy largo" }
            } ) }
          />
          {errors.name && (
            <div 
            className="bg-red-400 py-3 text-white px-2 uppercase font-bold">
              {errors.name?.message?.toString()}
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-3">
          <span className="text-xl font-bold">Descripción del proyecto</span>
          <textarea 
            id="projectNameInput" className="px-2 shadow-sm p-1" placeholder="Ej: Proyecto"
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
