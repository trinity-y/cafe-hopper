import axios from "axios";

const isLocal = process.env.REACT_APP_ISLOCAL === 'true';

const client = axios.create({
    baseURL: isLocal ? process.env.REACT_APP_LOCAL_API_URL : process.env.REACT_APP_PROD_API_URL
});

const backendClient = axios.create({
    baseURL: isLocal ? process.env.REACT_APP_LOCAL_BACKEND_URL : process.env.REACT_APP_PROD_BACKEND_URL
});

export { client, backendClient };