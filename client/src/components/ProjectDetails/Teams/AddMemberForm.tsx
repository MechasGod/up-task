import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addMember, getUserIdByEmailTEAM } from '../../../api/TeamAPI';
import { toast } from 'react-toastify';

export default function AddMemberForm() {
    const initialValues: { email: string } = {
        email: ''
    }
    const params = useParams()
    const projectId = params.projectId!

    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues })

    const mutation = useMutation({
      mutationFn: getUserIdByEmailTEAM
    })

    const { mutate } = useMutation({
      mutationFn: addMember,
      onError: (error) => {
        toast.error("Ha habido un error, intentelo más tarde")
        console.log(error)
      },
      onSuccess: (  ) => {
          queryClient.invalidateQueries({ queryKey: [ "projectTeam", projectId ] })
          navigate(`/projects/${projectId}/team`)
          toast.success("Miembro añadido correctamente")       
          reset()
      }
    })

    const responseRender = () => {
      if (mutation.data) {
        if (mutation.data.msg) return { found: false }
        return { found: true, data: mutation.data }
      }
    }
        

    const handleSearchUser = async (formData: { email: string }) => mutation.mutate({ projectId, email: formData.email })

    return (
        <>

            <form
                className="mt-10 space-y-5"
                onSubmit={handleSubmit(handleSearchUser)}
                noValidate
            >

                <div className="flex flex-col gap-3">
                    <label
                        className="font-normal text-2xl"
                        htmlFor="name"
                    >E-mail de Usuario</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="E-mail del usuario a Agregar"
                        className="w-full p-3  border-gray-300 border"
                        {...register("email", {
                            required: "El Email es obligatorio",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "E-mail no válido",
                            },
                        })}
                    />
                    {errors.email && (
                        <div 
                        className="bg-red-400 py-3 text-white px-2 uppercase font-bold">
                        {errors.email?.message?.toString()}
                        </div>
                    )}
                </div>

                <input
                    type="submit"
                    className=" bg-purple-400 hover:bg-purple-500 w-full p-3  text-white font-black  text-xl cursor-pointer transition-colors"
                    value='Buscar Usuario'
                />

                
                { 
                  mutation.isSuccess ?

                  mutation.isPending ? (
                    <p className="text-center">Cargando</p>
                  ) : 
                  responseRender()?.found ? (
                    <>
                      <p className="mt-10 text-center font-bold">Resultado:</p>
                      <div className="flex justify-between items-center">
                        <div>
                          <p>{responseRender()?.data.name}</p> 
                          <p className="text-gray-400">{responseRender()?.data.email}</p>
                        </div>
                        <button 
                          onClick={() => mutate({projectId, id: responseRender()?.data._id })}
                          className="text-purple-400 hover:text-purple-500 transition-colors py-3 font-bold cursor-pointer" >
                          Agregar al proyecto
                        </button>
                      </div>
                    </>
                  ) : (<p className="text-center">Usuario no encontrado...</p>)
                  : ""
                } 


            </form>
        </>
    )
}