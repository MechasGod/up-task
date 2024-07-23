import { Link, useNavigate, useParams } from "react-router-dom";
import { PinInput, PinInputField } from "@chakra-ui/pin-input"
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { confirmAccount } from "../../api/AuthAPI";
import { toast } from 'react-toastify';

export default function AuthConfirmAccPage() {

  const [ input, setInput ] = useState("")

  const navigate = useNavigate()

  const { userId } = useParams()

  const { mutate } = useMutation({
    mutationFn: confirmAccount,
    onError: (error) => {
      toast.error("Ha habido un error, intentelo más tarde")
      console.log(error)
    },
    onSuccess: ( data ) => {
      if (data.auth) {
        navigate("/auth/login")
        toast.success(data.msg)
        
      } else toast.error(data.msg)
    }
  })

  return (
    <>
      <h1 className="text-5xl font-black text-white">Confirma tu Cuenta</h1>
      <p className="text-2xl font-light text-white mt-5">
        Ingresa el código que recibiste {''}
        <span className=" text-fuchsia-500 font-bold"> por e-mail</span>
      </p>
      <form
        className="space-y-8 p-10 bg-white mt-10"
      >
        <label
          className="font-normal text-2xl text-center block"
        >Código de 6 dígitos</label>
        <div className="flex justify-center gap-5">
          <PinInput value={input} onChange={input => setInput(input)} 
            onComplete={token => {
              mutate({ userId: userId!, token: token }) 
            }}>
            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-400 border placeholder-white"/>
            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-400 border placeholder-white"/>
            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-400 border placeholder-white"/>
            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-400 border placeholder-white"/>
            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-400 border placeholder-white"/>
            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-400 border placeholder-white"/>
          </PinInput>

        </div>

      </form>

      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to='/auth/new-code'
          className="text-center text-gray-300 font-normal"
        >
          Solicitar un nuevo Código
        </Link>
      </nav>

    </>
  )
}