import axios from 'axios';
import { API_URL } from '../index';

export async function signUpGoogle() {
    //`${API_URL}/auth/google`
    const response = await axios.get(`${API_URL}/auth/google`, {
        withCredentials: true,
    });
    console.log(response);
    return response.data;
}


export async function signUpGoogleCallback(code: string) {
    //`${API_URL}/auth/google/callback`
    const response = await axios.get(`${API_URL}/auth/google/callback`, {
        params: {
            code: code 
        },
        withCredentials: true,
    });
    return response;
}