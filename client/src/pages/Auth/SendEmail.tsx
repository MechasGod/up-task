import { useMutation } from '@tanstack/react-query';
import { forgotPasword } from '../../api/AuthAPI';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';


export const SendEmailPage = () => {

  const initialValues: { email: string } = {
    email: '',
  }
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

  const [ isSubmit, setIsSubmit ] = useState(false)

  const { mutate } = useMutation({
    mutationFn: forgotPasword,
    onError: (error) => {
      toast.error("Ha habido un error, intentelo más tarde")
      console.log(error)
    },
    onSuccess: ( data ) => {
      if (data.success) {
        toast.success(data.msg)
        setIsSubmit(true)
      } else toast.error(data.msg)
    }
  })

  if (isSubmit) return ( <div className="p-10 space-y-2 bg-white"> 
    <p className="text-xl text-center">
      Correo enviado correctamente...
    </p>
    <p className="text-gray-400 text-center">
          <Link className="text-purple-400 hover:text-purple-500 transition-colors" to="/auth/login"> Volver al inicio de sesión</Link>
    </p> 
  </div> )

  return (
    <>
      <form
        onSubmit={handleSubmit((data: { email: string }) => mutate(data.email) )}
        className="space-y-7 p-10 bg-white"
        noValidate
      >
        <div className="flex flex-col gap-4">
          <label
            className=" text-xl"
          >Recuperar tu cuenta</label>

          <input
            id="email"
            type="email"
            placeholder="Introduce un correo para recuperar tu cuenta"
            className="w-full p-2 border-gray border-2"
            {...register("email", {
              required: "El correo es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && (
            <div 
            className="bg-red-400 py-3 px-2 text-white uppercase font-bold">
              {errors.email?.message?.toString()}
            </div>
          )}
        </div>

        <input
          type="submit"
          value='Enviar correo'
          className="bg-purple-400 hover:bg-purple-500 w-full p-2 transition-colors text-white font-black text-xl cursor-pointer"
        />

        <p className="text-gray-400 text-center">
          <Link className="text-purple-400 hover:text-purple-500 transition-colors" to="/auth/login"> Volver al inicio de sesión</Link>
        </p>
      </form>
    </>
  )
}
