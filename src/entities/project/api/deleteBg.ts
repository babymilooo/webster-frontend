import { API_URL, useProjectStore } from '@/entities/project';
import $api from '@/app/http/axios';

export async function deleteBg(src: string) {
    const id = useProjectStore.getState().project?._id;
    try {
        const response = await $api.post(
            `${API_URL}/project/${id}/upload-image`,
            src,
        );
        return response.data;
    } catch (e) {
        console.error(e);
    }
}
