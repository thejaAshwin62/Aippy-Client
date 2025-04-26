import axios from "axios";

const customFetch = axios.create({
    baseURL: 'https://aipply-springboot.onrender.com/api/v1',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

// Add request interceptor to handle CORS
customFetch.interceptors.request.use(
    (config) => {
        // Add CORS headers to every request
        config.headers['Access-Control-Allow-Origin'] = 'https://aipply-silk.vercel.app';
        config.headers['Access-Control-Allow-Credentials'] = 'true';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default customFetch;