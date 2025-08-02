import axios from "axios";

const API_URL = "/api/users";

export const registerUser = async (data: any) => {
    const response = await axios.post(`${API_URL}/create`, data);
    return response.data;
}

export const loginUser = async (data: any) => {
    const response = await axios.post(`${API_URL}/login`, data);
    return response.data;
}