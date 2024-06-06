import { API_URL } from '@/entities/project';
import $api from '@/app/http/axios';

export async function deleteBg(src: string) {
    console.log('src', src);
    try {
        const response = await $api.post(
            `${API_URL}/project/remove-background`,
            { imageUrl: src },
        );
        return response.data;
    } catch (e) {
        console.error(e);
    }
}
