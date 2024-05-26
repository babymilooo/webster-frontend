import axios from 'axios';
import { API_URL, useProjectStore } from '@/entities/project';

export async function updatePicture(picture: any) {
    const id = useProjectStore.getState().project?._id;
    const formData = new FormData();
    formData.append('image', picture);
    try {
        const response = await axios.post(
            `${API_URL}/project/${id}/upload-image`,
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
