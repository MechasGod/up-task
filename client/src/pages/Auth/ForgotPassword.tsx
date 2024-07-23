import { useMutation } from '@tanstack/react-query';
import { restorePassword } from '../../api/AuthAPI';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

interface FormData {
  password: string,
  confirm_password: string
}

export const ForgotPasswordPage = () => {

  const initialValues: FormData = {
    password: '',
    confirm_password: '',
  }

  const { userId } = useParams()
  
  const { search } = useLocation()
  const searchParams = new URLSearchParams(search)
  const token = searchParams.get("token")

  const navigate = useNavigate()
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm({ defaultValues: initialValues })
  const password = watch("password")

  const { mutate } = useMutation({
    mutationFn: restorePassword,
    onError: (error) => {
      toast.error("Ha habido un error, intentelo más tarde")
      console.log(error)
    },
    onSuccess: ( data ) => {
      if (data.success) {
        navigate("/auth/login")
        toast.success(data.msg)
        
      } else toast.error(data.msg)
    }
  })

  const handleSend = ( formData: FormData ) => mutate({ 
    userId: userId!,
    token: token!,
    password: formData.password,
    confirm_password: formData.confirm_password
   })

  return (
    <>
      <form
        onSubmit={handleSubmit(handleSend)}
        className="space-y-7 p-10 bg-white"
        noValidate
      >
        <div className="flex flex-col gap-4">
          <label
            className=" text-xl"
          >Nueva contraseña</label>

          <input
            id="password"
            type="password"
            placeholder="Nueva contraseña"
            className="w-full p-2 border-gray border-2"
            {...register("password", {
              required: "La nueva contraseña es obligatoria",
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
            className=" text-xl"
          >Repetir contraseña</label>

          <input
            type="password"
            placeholder="Repita su contraseña"
            className="w-full p-2 border-gray border-2"
            {...register("confirm_password", {
              required: "Repetir la contraseña es obligatorio",
              validate: value => value === password || "Las contraseñas no coinciden"
            })}
          />
          {errors.confirm_password && (
            <div 
            className="bg-red-400 py-3 px-2 text-white uppercase font-bold">
              {errors.confirm_password?.message?.toString()}
            </div>
          )}
        </div>

        <input
          type="submit"
          value='Restablecer contraseña'
          className="bg-purple-400 hover:bg-purple-500 w-full p-2 transition-colors text-white font-black text-xl cursor-pointer"
        />

        {/* <p className="text-gray-400 text-center">
          ¿No tienes cuenta?   
          <Link className="text-purple-400 hover:text-purple-500 transition-colors" to="/auth/signup"> Creala aqui</Link>
        </p> */}
      </form>
    </>
  )
}
