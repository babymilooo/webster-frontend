import { useInitProjectStore } from '@/entities/project/model/initProjectStore';
import { Card, CardContent } from '@/shared/ui/card';
import Carousel from '@/widgets/Carousel';
import { ChangeEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../MainLayout';
import { PrivateLayout } from '../PrivateLayout';
import HomeLayout from './HomeLayout';
import {
    createProject,
    updatePicture,
    useProjectStore,
} from '@/entities/project';
import { useUserStore } from '@/entities/user';
import $api from '@/app/http/axios';

const Home = () => {
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const backgroundImageInputRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();
    const setProjects = useUserStore((state) => state.setProjects);
    const setProject = useProjectStore((state) => state.setProject);
    const projects = useUserStore((state) => state.projects);
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

    const isLogin = useUserStore((state) => state.isLogin);

    const handleSelectImageForProject = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            let data: any = null;
            if (isLogin) {
                data = await updatePicture(file);
            } else {
                data = e.target?.result;
                if (typeof data !== 'string') return;
            }

            const img = new window.Image();
            img.src = data;
            img.onload = () => {
                resetStore();
                setHeight(img.height);
                setWidth(img.width);
                setStartImage(data);
                setStartBackgroundImage(null);
                navigate('/projects/1');
                img.remove();
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
            let data: any = null;
            if (isLogin) {
                data = await updatePicture(file);
            } else {
                data = e.target?.result;
                if (typeof data !== 'string') return;
            }
            const img = new window.Image();
            img.src = data;
            img.onload = () => {
                resetStore();
                setHeight(img.height);
                setWidth(img.width);
                setStartImage(null);
                setStartBackgroundImage(data);
                navigate('/projects/1');
                img.remove();
            };
        };
        reader.readAsDataURL(file);
    };

    const handleCreate = async () => {
        resetStore();
        const title = 'new';
        setHeight(800);
        setWidth(600);
        const data = await createProject(title);
        if (data) {
            const formatedProjects = projects ? [...projects, data] : [data];
            setProjects(formatedProjects as []);
            setProject(data);
        }

        navigate(`/projects/${data._id}`);
    };

    return (
        <MainLayout>
            <HomeLayout>
                <PrivateLayout>
                    <div className="flex h-full w-full flex-col gap-4 p-4">
                        <div className="phone:h-[250px] p-1 lg:h-[250px] xl:h-[350px]">
                            <Card className="phone:h-[250px] lg:h-[250px] xl:h-[350px]">
                                <CardContent
                                    className="flex h-full select-none items-center rounded-md bg-cover bg-center p-6"
                                    style={{
                                        backgroundImage: `url('../src/public/background.png')`,
                                    }}
                                >
                                    <p className="ipad:text-4xl phone:text-xl font-bold text-white lg:text-5xl xl:text-6xl">
                                        Welcome to ElephArt <br /> create your
                                        masterpieces with us!
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="h-full w-full rounded-t-lg bg-background">
                            <button onClick={handleCreate}>
                                new
                                {/* <Link to="/projects/1">new</Link> */}
                            </button>
                            <div
                                className="flex h-10 w-fit items-center justify-center"
                                onClick={() => imageInputRef.current?.click()}
                            >
                                Create Project with image
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleSelectImageForProject}
                                    className="hidden"
                                    ref={imageInputRef}
                                />
                            </div>
                            <div
                                className="flex h-10 w-fit items-center justify-center"
                                onClick={() =>
                                    backgroundImageInputRef.current?.click()
                                }
                            >
                                Create Project with background image
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={
                                        handleSelectbackgroundImageForProject
                                    }
                                    className="hidden"
                                    ref={backgroundImageInputRef}
                                />
                            </div>
                            <div>
                                {projects?.map((pr) => (
                                    <div
                                        key={pr._id}
                                        onClick={() => {
                                            navigate(`/projects/${pr._id}`);
                                        }}
                                    >
                                        Project {pr.title} {pr._id}
                                    </div>
                                ))}
                            </div>
                            <h2 className="mx-4 my-4 text-left text-xl font-bold">
                                You might want to try...
                            </h2>
                            <Carousel />
                        </div>
                    </div>
                </PrivateLayout>
            </HomeLayout>
        </MainLayout>
    );
};

export default Home;
