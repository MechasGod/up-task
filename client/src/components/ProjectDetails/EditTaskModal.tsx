import { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { DraftTask } from '@/types/index';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getTaskById, updateTask } from '../../api/TaskAPI';
import { toast } from 'react-toastify';

export default function EditTaskModal() {

    const navigate = useNavigate()
    const { register, formState: { errors }, handleSubmit, reset } = useForm<DraftTask>()
    
    const queryClient = useQueryClient()

    const { projectId } = useParams()

    const { search } = useLocation()
    const queryParams = new URLSearchParams(search)
    const editTaskParam = queryParams.get("taskId")
    const editTask = editTaskParam ? true : false


    const { data: currentTask } = useQuery({
        queryKey: ["taskId", editTaskParam],
        queryFn: () => getTaskById(projectId!, editTaskParam!),
        enabled: !!editTaskParam 
        //enabled ejecuta el query si recibe true, en caso contrario no lo ejecuta
        //!! en JS convierte a true si un string tiene algo. Si esta vacio ("") regresa false
    }) 

    console.log(currentTask)

    const { mutate } = useMutation({
        mutationFn: updateTask,
        onError: (error) => {
            console.log(error)
            toast.error("Ha habido un error, intentelo más tarde")
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["projectById", projectId] })
            toast.success(data)
            navigate(`/projects/${projectId}`)
            reset()
        }
    }) 

    useEffect(() => {
        // Esto establecerá el valor predeterminado de los inputs cuando `currentTask` cambie
        reset({
          name: currentTask?.name,
          description: currentTask?.description
        });
      }, [currentTask, reset]);

    const updateTaskHandler = (draftTask: DraftTask) => mutate({ projectId: projectId!, taskId: editTaskParam!, draftTask })

    return (
        <>
            <Transition appear show={editTask} as={Fragment}>
                {/* Pasarle "" como parametro a navigate hace que se quede en la misma url actual */}
                <Dialog as="div" className="relative z-10" onClose={() => {
                
                    navigate("", {replace: true}) 
                }
                    
                    }> 
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                                    <Dialog.Title
                                        as="h3"
                                        className="font-black text-4xl  my-5"
                                    >
                                        Editar tarea
                                    </Dialog.Title>

                                    <p className="text-xl font-bold">Llena el formulario y edita  {''}
                                        <span className="text-fuchsia-600">tu tarea</span>
                                    </p>
                                    <form 
                                        className=" space-y-6 py-5"
                                        onSubmit={handleSubmit(updateTaskHandler)}
                                        >
                                                                        
                                            <div className="flex flex-col space-y-2">
                                            <span className="text-xl font-bold">Nombre de la tarea</span>
                                            <input 
                                                defaultValue={currentTask?.name}
                                                type="text" id="taskNameInput" 
                                                className="shadow-sm p-2 border-gray border-2" placeholder="Ej: Administrador de tareas"  
                                                { ...register("name", {
                                                required: "El nombre de la tarea no puede ir vacío",
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
                                            <span className="text-xl font-bold">Descripción de la tarea</span>
                                            <textarea 
                                                defaultValue={currentTask?.description}
                                                id="descriptionInput" className="px-2 shadow-sm p-1 border-gray border-2" placeholder="Ej: Proyecto"
                                                { ...register("description", {
                                                required: "La descripción de la tarea no puede ir vacía"
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

                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}