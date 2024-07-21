import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getTaskById, updateTaskStatus } from '../../api/TaskAPI';
import { formatDate } from '../../utilities/utils';
import { statusTranslations } from './TaskList';
import { toast } from 'react-toastify';


export default function TaskModalDetails() {
  
    const navigate = useNavigate()

    const { projectId } = useParams()

    const queryClient = useQueryClient()

    const { search } = useLocation()
    const queryParams = new URLSearchParams(search)
    const taskId = queryParams.get("viewTask")
    const task = taskId ? true : false

    const { data: currentTask } = useQuery({
        queryKey: ["taskId", taskId],
        queryFn: () => getTaskById(projectId!, taskId!),
        enabled: !!taskId,
        retry: false
    })

    const { mutate } = useMutation({
        mutationFn: updateTaskStatus,
        onError: (error) => {
            console.log(error)
            toast.error("Ha habido un error, intentelo más tarde")
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["projectById", projectId] })
            queryClient.invalidateQueries({ queryKey: ["taskId", taskId] })
            console.log(data)
            navigate(`/projects/${projectId}`)
        }
    })


    return (
        <>
            <Transition appear show={task} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => navigate("", { replace: true })}>
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
                                {currentTask && (
                                    <>
                                        <p className='text-sm text-slate-400'>Agregada el: {formatDate(currentTask.createdAt)}</p>
                                        <p className='text-sm text-slate-400'>Última actualización: {formatDate(currentTask.updatedAt)}</p>
                                        <Dialog.Title
                                            as="h3"
                                            className="font-black text-4xl text-slate-600 my-5"
                                        >{currentTask.name}
                                        </Dialog.Title>
                                        <p className='text-lg text-slate-500 mb-2'>Descripción: {currentTask.description}</p>
                                        <div className='my-5 space-y-3'>
                                            <label className='font-bold'>Estado Actual: </label>
                                            <select className="w-full p-3 bg-white border border-gray-300"
                                                defaultValue={currentTask.status}
                                                onChange={e => {
                                                    
                                                    mutate({ projectId: projectId!, taskId: taskId!, status: e.target.value })
                                                }}
                                            >
                                                {
                                                   Object.entries(statusTranslations).map(([key, value]) => (
                                                    <option key={key} value={key}>{value}</option>
                                                   )) 
                                                }
                                            </select>
                                        </div>
                                    </>
                                    )}
                                    </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}