import $api from '@/app/http/axios';
export const updateProject = async (title: string, id: string) => {
    const data = { title };

    const response = await $api.patch(`/project/${id}`, {
        data,
    });
    return response.data;
};
