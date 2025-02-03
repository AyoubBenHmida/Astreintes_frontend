import axios from "axios";

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string; 
}

export const login = async (data: LoginData): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>("https://localhost:7056/api/Auth/login", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};