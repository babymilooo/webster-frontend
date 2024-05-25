import axios from 'axios';
import { API_URL } from '@/entities/project';

export async function updatePicture(picture: any) {
    const formData = new FormData();
    formData.append('image', picture);
    try {
        const response = await axios.post(
            `${API_URL}/project/image-project`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            },
        );
        return response.data;
    } catch (e) {
        console.error(e);
    }
}
