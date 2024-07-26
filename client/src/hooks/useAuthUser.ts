import { useQuery } from '@tanstack/react-query';
import { getUserData } from '../api/AuthAPI';


export const useAuthUser = () => {
  const { data: currentUser, isError, isLoading } = useQuery({
    queryKey: [ "currentUser" ],
    queryFn: getUserData,
    retry: 1,
    refetchOnWindowFocus: false,
  })

  return { currentUser, isError, isLoading }
  
} 
