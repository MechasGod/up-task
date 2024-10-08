import { useQuery } from '@tanstack/react-query';
import { getProjectById } from '../api/ProjectAPI';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AddTaskModal from '@/components/ProjectDetails/AddTaskModal';
import { TaskList } from '@/components/ProjectDetails/TaskList';
import EditTaskModal from '@/components/ProjectDetails/EditTaskModal';
import TaskModalDetails from '@/components/ProjectDetails/TaskModalDetails';
import { useAuthUser } from '@/hooks/useAuthUser';


export const ProjectDetailsPage = () => {

  const { currentUser } = useAuthUser()

  const { projectId } = useParams()
  const navigate = useNavigate()
  const { isLoading, isError, data: currentProject } = useQuery({
    queryKey: ["projectById", projectId],
    queryFn: () => getProjectById(projectId!),
  })

  

  if (isLoading) return (<h1 className="text-center font-bold text-3xl">Cargando...</h1>)
  if (isError) return (<h1 className="text-center font-bold text-3xl">Ha habido un error...</h1>)

  return (
    <>
      <h1 className="font-black text-4xl">{currentProject?.projectName}</h1>
      <p className="text-2xl font-light text-gray-500 mt-5">{currentProject?.description}</p>

      <nav className="my-5 flex gap-3">
        <button
          onClick={() => navigate("?newTask=true")} 
          type="button" 
          className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors">
          Agregar Tarea
        </button>

        {  currentUser._id === currentProject?.manager && (
          <Link 
            to={`/projects/${currentProject?._id}/team`}
            className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
          >Colaboradores</Link>
        ) }

        <Link
          to={`/`}
          className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
        >Volver a los proyectos</Link>

        <TaskModalDetails/>
        <EditTaskModal/>
        <AddTaskModal />
      </nav>
      <TaskList tasks={currentProject!.tasks}/>
    </>
  )
}
