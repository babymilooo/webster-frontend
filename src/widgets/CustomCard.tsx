import React, { ChangeEvent, useRef, useState } from 'react';
import {
    Card as ShadCard,
    CardContent as ShadCardContent,
} from '@/shared/ui/card';
import './CustomCard.css';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/entities/user';
import {
    createProject,
    updatePicture,
    useProjectStore,
} from '@/entities/project';
import { useInitProjectStore } from '@/entities/project/model/initProjectStore';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { DialogClose } from '@radix-ui/react-dialog';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';

const CustomCard = ({
    imageSrc,
    caption,
    dimensions,
    height,
    width,
}: {
    imageSrc: string;
    caption: string;
    dimensions: string;
    height: number;
    width: number;
}) => {
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const backgroundImageInputRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();
    const setProjects = useUserStore((state) => state.setProjects);
    const setProject = useProjectStore((state) => state.setProject);
    const projects = useUserStore((state) => state.projects);
    const isLogin = useUserStore((state) => state.isLogin);

    const [
        setStartImage,
        setStartBackgroundImage,
        setStartJSON,
        setWidth,
        setHeight,
        resetStore,
    ] = useInitProjectStore((state) => [
        state.setStartingImage,
        state.setStartingBackgroundImage,
        state.setSerializedJSON,
        state.setWidth,
        state.setHeight,
        state.resetStore,
    ]);

    const [initWidth, initHeight] = useInitProjectStore((state) => [
        state.width,
        state.height,
    ]);

    const [title, setTitle] = useState('');

    const handleSelectImageForProject = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            if (!title || title.trim().length == 0) return;
            const projData = await createProject(title);
            // console.log(projData);

            let data: any = null;
            if (isLogin) {
                data = (await updatePicture(file, projData._id)).image;
            } else {
                data = e.target?.result;
                if (typeof data !== 'string') return;
            }
            // console.log(data);

            const img = new window.Image();
            img.src = data;
            img.onload = async () => {
                resetStore();
                setHeight(img.height);
                setWidth(img.width);
                setStartImage(data);
                setStartBackgroundImage(null);
                img.remove();
                if (!isLogin) {
                    navigate('/projects/tmp');
                    return;
                }
                if (projData) {
                    const formatedProjects = projects
                        ? [...projects, projData]
                        : [projData];
                    setProjects(formatedProjects as []);
                    setProject(projData);
                }

                navigate(`/projects/${projData._id}`);
            };
        };
        reader.readAsDataURL(file);
    };

    const handleSelectbackgroundImageForProject = (
        e: ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            if (!title || title.trim().length == 0) return;
            const projData = await createProject(title);
            let data: any = null;
            if (isLogin) {
                data = (await updatePicture(file, projData._id)).image;
            } else {
                data = e.target?.result;
                if (typeof data !== 'string') return;
            }
            const img = new window.Image();
            img.src = data;
            img.onload = async () => {
                resetStore();
                setHeight(img.height);
                setWidth(img.width);
                setStartImage(null);
                setStartBackgroundImage(data);
                img.remove();
                if (!isLogin) {
                    navigate('/projects/tmp');
                    return;
                }
                if (projData) {
                    const formatedProjects = projects
                        ? [...projects, projData]
                        : [projData];
                    setProjects(formatedProjects as []);
                    setProject(projData);
                }

                navigate(`/projects/${projData._id}`);
            };
        };
        reader.readAsDataURL(file);
    };

    const handleCreate = async () => {
        // resetStore();
        if (!isLogin) {
            navigate('/projects/tmp');
            return;
        }
        if (!title || title.trim().length == 0) return;
        const data = await createProject(title);
        if (data) {
            const formatedProjects = projects ? [...projects, data] : [data];
            setProjects(formatedProjects as []);
            setProject(data);
        }

        navigate(`/projects/${data._id}`);
    };
    return (
        <Dialog>
            <DialogTrigger
                onClick={() => {
                    setWidth(width);
                    setHeight(height);
                }}
            >
                <div className="custom-card p-1">
                    <ShadCard className="relative h-full w-full overflow-hidden">
                        <ShadCardContent className="gradient-background relative flex h-full w-full items-center justify-center p-6">
                            <div className="w-full text-center">
                                <div className="image-container">
                                    <img
                                        src={imageSrc}
                                        alt={caption}
                                        className="image"
                                    />
                                </div>
                                <div className="mt-2 text-sm">{caption}</div>
                                <div className="text-xs text-gray-500">
                                    {dimensions}
                                </div>
                            </div>
                            <div className="overlay absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center bg-black bg-opacity-60 opacity-0 transition-opacity duration-300">
                                <span className="text-white">Create blank</span>
                                <span className="mt-1 text-sm text-white">
                                    {dimensions}
                                </span>
                            </div>
                        </ShadCardContent>
                    </ShadCard>
                </div>
            </DialogTrigger>
            <DialogContent className="w-3/5">
                <DialogTitle>Create Project</DialogTitle>
                <div className="flex flex-col gap-4">
                    <Input
                        value={title}
                        required
                        type="text"
                        placeholder="Project Title"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <Label>Width</Label>
                    <Input
                        value={initWidth}
                        required
                        type="number"
                        placeholder="Project Width"
                        onChange={(e) => setWidth(Number(e.target.value))}
                    />
                    <Label>Height</Label>
                    <Input
                        value={initHeight}
                        required
                        type="number"
                        placeholder="Project Height"
                        onChange={(e) => setHeight(Number(e.target.value))}
                    />
                    <button
                        className="rounded-lg px-4 py-2 text-center hover:bg-secondary disabled:text-gray-500"
                        onClick={handleCreate}
                        disabled={!title || title.trim().length == 0}
                    >
                        Create New Project
                    </button>

                    <button
                        className="rounded-lg px-4 py-2 text-center hover:bg-secondary disabled:text-gray-500"
                        onClick={() => imageInputRef.current?.click()}
                        disabled={!title || title.trim().length == 0}
                    >
                        Create Project with image
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleSelectImageForProject}
                        className="hidden"
                        ref={imageInputRef}
                    />
                    <button
                        className="rounded-lg px-4 py-2 text-center hover:bg-secondary disabled:text-gray-500"
                        onClick={() => backgroundImageInputRef.current?.click()}
                        disabled={!title || title.trim().length == 0}
                    >
                        Create Project with background image
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleSelectbackgroundImageForProject}
                        className="hidden"
                        ref={backgroundImageInputRef}
                    />
                </div>
                <DialogClose>
                    <Button>Close</Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
};

export default CustomCard;
