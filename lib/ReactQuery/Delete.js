import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const DeleteUser = async (id) => {
  const response = await axios.delete(`http://localhost:3000/api?id=${id}`);
  return response // فقط داده رو برگردون
};

const useDeleteUser = () => {
  const { mutate, isLoading, isError, error } = useMutation({
    mutationKey: ['DeleteUser'],
    mutationFn: DeleteUser,
    onError: (error) => {
      console.error('Error Deletting user:', error);
    },
    onSuccess: (data) => {
      console.log('User deleted successfully:', data);
    },
  });

  return { mutate, isLoading, isError, error };
};

export default useDeleteUser;