import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAllProjects } from '../api/ProjectAPI';
import { ProjectsRender } from '@/components/Dashboard/ProjectsRender';

export const DashboardPage = () => {

  const { data, isError, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getAllProjects
  })

  if (isLoading) return (<h1 className="text-center font-bold text-3xl">Cargando...</h1>)
  if (isError) return (<h1 className="text-center font-bold text-3xl">Ha habido un error...</h1>)

  return (
    <>
      <h1 className="text-5xl font-black">Mis proyectos</h1>
      <p className="text-2xl font-light text-gray-500 mt-5">Maneja y administra tus proyectos</p>

      <ProjectsRender data={data} />

      <nav className="my-5">
        <Link 
          className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl fonto-bold cursor-pointer transition-colors"
          to="/projects/create"  
        >Nuevo Proyecto</Link>
      </nav>
    </>
  )
}
