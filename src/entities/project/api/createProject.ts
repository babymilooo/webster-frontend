import $api from '@/app/http/axios';
export const createProject = async (
    title: string,
    width: number,
    height: number,
) => {
    const response = await $api.post('/api/project/create', {
        title,
        width,
        height,
    });
    return response.data;
};
