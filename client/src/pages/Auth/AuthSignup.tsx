import { useForm } from "react-hook-form";
import { UserSignUp } from "@/types/index";
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createAccount, getUserIdByEmail } from '../../api/AuthAPI';
import { toast } from 'react-toastify';
import { useState } from 'react';

export default function AuthSignupPage() {

  const initialValues: UserSignUp = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  }

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [ isSubmitTriggered, setIsSubmitTriggered ] = useState<boolean>(false)
  
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<UserSignUp>({ defaultValues: initialValues });

  const password = watch('password'); //Permite sacar un campo al bloque global para poder usarlo en otros lados
  //En este codigo se usó para compararlo con el password_confirmation y hacer la validación
  const email = watch("email")

  console.log(email)

  const { data: userId } = useQuery({
    queryKey: [ "userId", email ],
    queryFn: () => getUserIdByEmail(email),
    enabled: isSubmitTriggered,
    retry: false
  })

  
  if (userId) {
    reset()
    setIsSubmitTriggered(false)
    queryClient.invalidateQueries({ queryKey: [ "userId", email ] })
    navigate(`/auth/confirm-account/${userId}`)
  }

  const { mutate: userSignupMutate } = useMutation({
    mutationFn: createAccount,
    onError: (error) => {
      toast.error("Ha habido un error al crear la cuenta, intentelo más tarde")
      console.log(error)
      navigate("/auth/login")
      reset()
    },
    onSuccess: ( data ) => {
      setIsSubmitTriggered(true)
      toast.success(data)
    }
  })

  const handleRegister = (formData: UserSignUp) => userSignupMutate(formData)

  return (
    <>
      <h1 className="text-4xl font-black text-white">Crear Cuenta</h1>
      <p className="text-xl font-light text-white mt-5">
        Llena el formulario para {''}
        <span className=" text-purple-500 font-bold"> crear tu cuenta</span>
      </p>

      <form
        onSubmit={handleSubmit(handleRegister)}
        className="space-y-8 p-10  bg-white mt-10"
        noValidate
      >
        <div className="flex flex-col gap-5">
          <label
            className="font-normal text-xl"
            htmlFor="email"
          >Correo</label>
          <input
            id="email"
            type="email"
            placeholder="Correo de Registro"
            className="w-full p-2 border-gray border-2"
            {...register("email", {
              required: "El correo de registro es obligatorio",
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

        <div className="flex flex-col gap-5">
          <label
            className="font-normal text-xl"
          >Nombre</label>
          <input
            type="name"
            placeholder="Nombre de Registro"
            className="w-full p-2 border-gray border-2"
            {...register("name", {
              required: "El Nombre de usuario es obligatorio",
            })}
          />
          {errors.name && (
            <div 
            className="bg-red-400 py-3 px-2 text-white uppercase font-bold">
              {errors.name?.message?.toString()}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <label
            className="font-normal text-xl"
          >Contraseña</label>

          <input
            type="password"
            placeholder="Password de Registro"
            className="w-full p-2 border-gray border-2"
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: {
                value: 8,
                message: 'La contraseña debe ser mínimo de 8 caracteres'
              }
            })}
          />
          {errors.password && (
            <div 
            className="bg-red-400 py-3 px-2 text-white uppercase font-bold">
              {errors.password?.message?.toString()}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <label
            className="font-normal text-xl"
          >Repetir Contraseña</label>

          <input
            id="password_confirmation"
            type="password"
            placeholder="Repite la contraseña de Registro"
            className="w-full p-2 border-gray border-2"
            {...register("password_confirmation", {
              required: "Repetir la contraseña es obligatorio",
              validate: value => value === password || 'Las contraseñas no coinciden'
            })}
          />

          {errors.password_confirmation && (
            <div 
            className="bg-red-400 py-3 px-2 text-white uppercase font-bold">
              {errors.password_confirmation?.message?.toString()}
            </div>
          )}
        </div>

        <input
          type="submit"
          value='Registrarme'
          className="bg-purple-400 hover:bg-purple-500 w-full p-2 transition-colors text-white font-black text-xl cursor-pointer"
        />

        <p className="text-gray-400 text-center">
          Ya tengo cuenta, <Link className="text-purple-400 hover:text-purple-500 transition-colors" to="/auth/login">
            Ingresar</Link>
        </p>
      </form>
    </>
  )
}