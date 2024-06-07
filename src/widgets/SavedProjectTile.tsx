import { API_URL } from '@/app/http/axios';
import { IProject } from '@/entities/user/model/userStore';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

export const SavedProjectTile: FC<{ project: IProject }> = ({ project }) => {
    const navigate = useNavigate();

    return (
        // <div
        //     className="flex h-60 w-52 flex-col items-center justify-between rounded border p-2"
        //     onClick={() => navigate(`/projects/${project._id}`)}
        // >
        //     <div className=" text-nowrap  p-2 text-center">{project.title}</div>
        //     <img
        //         className=" max-h-[200px] max-w-[200px] rounded border"
        //         src={`${API_URL}/project/${project._id}/thumbnail`}
        //         alt={`Preview ${project.title}`}
        //     />
        // </div>
        <div className="flex flex-col items-center justify-between rounded p-2">
            <div
                className="border-[3px] border-orange-950 p-2 shadow-lg"
                onClick={() => navigate(`/projects/${project._id}`)}
            >
                <img
                    className=" border"
                    src={`${API_URL}/project/${project._id}/thumbnail`}
                    alt={`Preview ${project.title}`}
                />
            </div>

            <div className=" text-nowrap  p-2 text-center">{project.title}</div>
        </div>
    );
};
