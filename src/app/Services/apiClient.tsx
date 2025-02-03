import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://localhost:7056", 
  headers: {
    "Content-Type": "application/json",
  },
});

// Ajouter un interceptor pour inclure le token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken"); // Récupération du token depuis localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log(localStorage.getItem("jwtToken"))
    return Promise.reject(error);
  }
);

export default apiClient;