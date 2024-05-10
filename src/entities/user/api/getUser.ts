import axios from 'axios';
import { API_URL } from '../index';

export async function getUser() {
    const response = await axios.get(`${API_URL}/auth/refreshToken`, {
        withCredentials: true,
    });
    return response.data;
}
