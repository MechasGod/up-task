import { Logo } from '@/components/Logo';
import { Outlet } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"

export const AuthLayout = () => {
  return (
    <>
        <div className="bg-gray-800 min-h-screen">

          <div className="py-5 lg:py-15 mx-auto w-[450px]">
            <Logo />
            <div className="mt-10 ">


              <Outlet />
            </div>

          </div>

          <footer className="py-5">
            <p className="text-center text-white">Todos los derechos reservados {new Date().getFullYear()}</p>
          </footer>
          <ToastContainer/>
        </div>
    </>

  )
}
