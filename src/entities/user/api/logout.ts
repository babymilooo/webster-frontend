import $api from '@/app/http/axios';
import { API_URL } from '../index';

export async function logout() {
    const response = await $api.post(`${API_URL}/auth/logout`, {
        withCredentials: true,
    });
    return response.data;
}