import axios from 'axios';
import { API_URL } from '../index';

export async function updateInfo(userName: string) {
    const response = await axios.post(
        `${API_URL}/user/edit-profile`,
        { userName },
        {
            withCredentials: true,
        },
    );
    console.log(response);
    return response.data;
}

export async function changePassword(
    currentPassword: string,
    newPassword: string,
) {
    const response = await axios.patch(
        `${API_URL}/user/edit-password`,
        {
            currentPassword,
            newPassword,
        },
        {
            withCredentials: true,
        },
    );
    return response;
}


export async function updateProfilePicture(imageFile: any) {
    const formData = new FormData();
    formData.append('profilePicture', imageFile);
    
    return true;
    // const response = await axios.patch(`${API_URL}/user/update-profile-picture`, formData, {
    //     headers: {
    //         'Content-Type': 'multipart/form-data',
    //     },
    //     withCredentials: true,
    // });

    // return response.data;
}
