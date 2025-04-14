import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const usegetallusers =(id)=> {

    const {data,isLoading , error} = useQuery({
        queryKey:['productDetail' , id], 
        queryFn:async () => {
           const response = await axios.get('http://localhost:3000/api')
           return response.data
        }
    })

    return{data,isLoading, error}
}

export default usegetallusers