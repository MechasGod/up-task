import { useForm } from "react-hook-form";
import { UserLoginForm } from "../../types/index";
import { Link } from 'react-router-dom';

export default function AuthLoginPage() {

  const initialValues: UserLoginForm = {
    email: '',
    password: '',
  }
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

  const handleLogin = (formData: UserLoginForm) => { }

  return (
    <>
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="space-y-7 p-10 bg-white"
        noValidate
      >
        <div className="flex flex-col gap-4">
          <label
            className=" text-xl"
          >Correo</label>

          <input
            id="email"
            type="email"
            placeholder="Correo de Registro"
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

        <div className="flex flex-col gap-5">
          <label
            className=" text-xl"
          >Contraseña</label>

          <input
            type="password"
            placeholder="Contraseña de Registro"
            className="w-full p-2 border-gray border-2"
            {...register("password", {
              required: "La contraseña es obligatoria",
            })}
          />
          {errors.password && (
            <div 
            className="bg-red-400 py-3 px-2 text-white uppercase font-bold">
              {errors.password?.message?.toString()}
            </div>
          )}
        </div>

        <input
          type="submit"
          value='Iniciar Sesión'
          className="bg-purple-400 hover:bg-purple-500 w-full p-2 transition-colors text-white font-black text-xl cursor-pointer"
        />

        <p className="text-gray-400 text-center">
          ¿No tienes cuenta?   
          <Link className="text-purple-400 hover:text-purple-500 transition-colors" to="/auth/signup"> Creala aqui</Link>
        </p>
      </form>
    </>
  )
}