import axios from 'axios';
import { API_URL } from '../index';

export async function logout() {
    const response = await axios.post(`${API_URL}/auth/logout`, {
        withCredentials: true,
    });
    console.log(response);
    return response.data;
}