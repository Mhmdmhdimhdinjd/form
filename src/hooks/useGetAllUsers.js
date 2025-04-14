// src/hooks/useGetAllUsers.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useGetAllUsers = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3000/api');
      return response.data.data;
    },
  });

  return { data, isLoading, isError, error, refetch };
};

export default useGetAllUsers;