import { API_URL } from '@/app/http/axios';
import { IProject, useUserStore } from '@/entities/user/model/userStore';
import { CheckIcon, Cross1Icon } from '@radix-ui/react-icons';
import { PenIcon } from 'lucide-react';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SavedProjectTileProps {
    project: IProject;
    isMenuVisible: boolean;
    onMenuToggle: () => void;
    onTitleUpdate: (id: string, title: string) => void;
}

export const SavedProjectTile: FC<SavedProjectTileProps> = ({
    project,
    isMenuVisible,
    onMenuToggle,
    onTitleUpdate,
}) => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(project.title);
    const deleteProject = useUserStore((state) => state.deleteProject);

    const handleEdit = () => {
        setIsEditing(true);
        onMenuToggle(); // Hide menu after action
    };

    const handleDelete = () => {
        // Handle delete logic here
        deleteProject(project._id);
        onMenuToggle(); // Hide menu after action
    };

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewTitle(event.target.value);
    };

    const handleTitleSave = () => {
        onTitleUpdate(project._id, newTitle);
        setIsEditing(false);
    };

    const handleTitleBlur = () => {
        setIsEditing(false);
        setNewTitle(project.title);
    };

    return (
        <div className="flex max-h-[300px] flex-col items-center justify-between rounded p-2">
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

            <div className="relative w-full p-2 text-center">
                <div className="group relative flex items-center justify-center">
                    {isEditing ? (
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={newTitle}
                                onChange={handleTitleChange}
                                // onBlur={handleTitleBlur}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleTitleSave();
                                    } else if (e.key === 'Escape') {
                                        handleTitleBlur();
                                    }
                                }}
                                className="w-[100px] text-center"
                                autoFocus
                            />
                            <CheckIcon
                                className="absolute right-0 h-5 w-5"
                                onClick={handleTitleSave}
                            />
                            <Cross1Icon
                                className="absolute right-[-20px] h-3 w-3"
                                onClick={handleTitleBlur}
                            />
                        </div>
                    ) : (
                        <span className="text-nowrap">{project.title}</span>
                    )}
                    <div className="absolute right-0 ml-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="cursor-pointer" onClick={onMenuToggle}>
                            {isEditing ? null : ( // Hide edit icon when editing
                                <PenIcon className="h-3 w-3" />
                            )}
                        </div>
                        {isMenuVisible && (
                            <div
                                className="w-21 absolute right-0 top-full z-10  rounded-lg border bg-background text-sm text-foreground
                            shadow-md "
                            >
                                <button
                                    className="block w-full p-2 text-left hover:bg-secondary"
                                    onClick={handleEdit}
                                >
                                    Edit
                                </button>
                                <button
                                    className="block w-full p-2 py-2 text-left  hover:bg-secondary"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
