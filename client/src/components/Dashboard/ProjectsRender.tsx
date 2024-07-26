import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { Projects } from '@/types/index';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { deleteProject } from "../../api/ProjectAPI";
import { toast } from "react-toastify"
import { useQueryClient } from '@tanstack/react-query';
import { useAuthUser } from '@/hooks/useAuthUser';

export const ProjectsRender = ({ data }: { data: Projects | undefined } ) => {

    const { currentUser } = useAuthUser()

    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: deleteProject,
        onError: (error) => {
            console.log(error)
            toast.error(error.message)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["projects"]})
            toast.success(data)
        }
    })


    return (
        <ul role="list" className="divide-y divide-gray-100 border border-gray-100 mt-10 bg-white shadow-lg">
        { data && data.map((project) => (
        <li key={project._id} className="flex justify-between gap-x-6 px-5 py-10">
            <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto space-y-2">
                    <div className="flex items-center space-x-5">
                        <Link to={`/projects/${project._id}`}
                            className="text-gray-600 cursor-pointer hover:underline text-3xl font-bold"
                            >{project.projectName}</Link>
                            {
                                project.manager === currentUser._id ? (
                                    <p className="bg-red-500 text-red-50 rounded-lg  py-2 px-6 font-bold text-sm">Manager</p>
                                ) : (
                                    <p className="bg-indigo-500 rounded-lg text-indigo-50 py-2 px-6 font-bold text-sm">Colaborador</p>
                                )
                            }
                    </div>
                    <p className="text-sm text-gray-400">
                        Cliente: {project.clientName}
                    </p>
                    <p className="text-sm text-gray-400">
                        {project.description}
                    </p>
                </div>
            </div>
            <div className="flex shrink-0 items-center gap-x-6">
                <Menu as="div" className="relative flex-none">
                    <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                        <span className="sr-only">opciones</span>
                        <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
                    </Menu.Button>
                    <Transition as={Fragment} enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95">
                        <Menu.Items
                            className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
                        >
                                <Menu.Item>
                                    <Link to={`/projects/${project._id}`}
                                        className='block px-3 py-1 text-sm leading-6 text-gray-900'>
                                    Ver Proyecto
                                    </Link>
                                </Menu.Item>
                                <Menu.Item>
                                    { currentUser._id === project.manager ? 
                                    (
                                    <Link to={`/projects/${project._id}/edit`}
                                        className='block px-3 py-1 text-sm leading-6 text-gray-900'>
                                    Editar Proyecto
                                    </Link>

                                    ) : (<></>) }
                                </Menu.Item>
                                <Menu.Item>
                                    { currentUser._id === project.manager ? (
                                    <button 
                                        type='button' 
                                        className='block px-3 py-1 text-sm leading-6 text-red-500'
                                        onClick={() => mutate(project._id)}
                                    >
                                        Eliminar Proyecto
                                    </button>
                                    ) : (<></>)}
                                </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </li>
        ))}
    </ul>
    )
}
