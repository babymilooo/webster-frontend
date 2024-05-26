import $api from '@/app/http/axios';
import { API_URL, useProjectStore } from '@/entities/project';

export async function saveProject(dataJSON: string) {
    try {
        const id = useProjectStore.getState().project?._id;
        await $api.patch(`${API_URL}/project/${id}`, { projectJSON: dataJSON });
    } catch (error) {
        console.error(error);
    }
}
