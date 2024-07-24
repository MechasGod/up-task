import { Link, Outlet, useNavigate } from "react-router-dom"
import { Logo } from '../../components/Logo';
import NavMenu from '@/components/NavMenu';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import { useQuery } from '@tanstack/react-query';
import { getUserData } from '../../api/AuthAPI';

export const MainLayout = () => {

  const navigate = useNavigate()

  const { data: currentUser, isError, isLoading } = useQuery({
    queryKey: [ "currentUser" ],
    queryFn: getUserData,
    retry: 1,
    refetchOnWindowFocus: false,

  })

  if (isLoading) return ( <h1>Cargando...</h1> )
  if (isError) navigate("/auth/login")
  if (currentUser.error) navigate("/auth/login")
  
  return (
    <>
      <header className="bg-gray-800 py-5">
          <div className="justify-between items-center max-w-screen-xl mx-auto flex flex-col lg:flex-row">
            
            <div className="w-64">
              <Link to={`/`}>
                <Logo /> 
              </Link>
            </div>
            <NavMenu name={currentUser.name}/>

          </div>
      
      </header>

      <section className="max-w-screen-xl mx-auto mt-10 p-5">
        <Outlet />
      </section>

      <footer className="py-5">
        <p className="text-center">Todos los derechos reservados {new Date().getFullYear()}</p>
      </footer>

      <ToastContainer/>
    </>

  )
}
