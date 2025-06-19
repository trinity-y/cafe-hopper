import axios from "axios";
const apiUrl = process.env.REACT_APP_ISLOCAL ? process.env.REACT_APP_LOCAL_API_URL : process.env.REACT_APP_PROD_API_URL;
const client = axios.create({ baseURL: apiUrl });

export default client;