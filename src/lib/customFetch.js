import axios from "axios";

const customFetch = axios.create({
    baseURL: 'https://aipply-springboot.onrender.com/api/v1',
    withCredentials: true
})

export default customFetch;