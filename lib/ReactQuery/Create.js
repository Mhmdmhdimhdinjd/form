// import { useMutation } from "react-query";
// import axios from "axios";

// const CreatUser = (newUserData) => {

// const {mutate , isLoading} = useMutation({
//     mutationKey :'addUser',
//     mutationFn: async() => {
//         const response = await axios.post(
//             '',
//         newUserData,
//     )
//     return response
//     }
// })

// return {mutate , isLoading}

// }

// export default CreatUser

// src/hooks/useCreateUser.js
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const createUser = async (newUserData) => {
    console.log(newUserData)
  const response = await axios.post('http://localhost:3000/api', newUserData);
  return response.data; // فقط داده رو برگردون
};

const useCreateUser = () => {
  const { mutate, isLoading, isError, error } = useMutation({
    mutationKey: ['addUser'],
    mutationFn: createUser,
    onError: (error) => {
      console.error('Error creating user:', error);
    },
    onSuccess: (data) => {
      console.log('User created successfully:', data);
    },
  });

  return { mutate, isLoading, isError, error };
};

export default useCreateUser;