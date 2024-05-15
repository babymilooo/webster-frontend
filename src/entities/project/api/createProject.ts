import axios from 'axios';

export const createProject = async (
    title: string,
    width: number,
    height: number,
) => {
    const response = await axios.post('/api/project/create', {
        title,
        width,
        height,
    });
    return response.data;
};
