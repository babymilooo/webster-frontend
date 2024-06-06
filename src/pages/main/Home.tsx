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
import $api, { API_URL } from '@/app/http/axios';
import { SavedProjectTile } from '@/widgets/SavedProjectTile';
import CreateProjectModal from '@/widgets/CreateProject';

const Home = () => {
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
                            {/* <button onClick={handleCreate}>new</button> */}
                            <CreateProjectModal />
                            <h2 className="mx-4 my-4 text-left text-xl font-bold">
                                You might want to try...
                            </h2>
                            <Carousel />
                            <h2 className="mx-4 my-4 text-left text-xl font-bold">
                                Your Projects
                            </h2>
                            <div className="m-6 flex flex-row flex-wrap gap-4">
                                {projects?.map((pr) => (
                                    <SavedProjectTile
                                        key={pr._id}
                                        project={pr}
                                    />
                                ))}
                                {(!projects || projects.length === 0) && (
                                    <>You have no projects</>
                                )}
                            </div>
                        </div>
                    </div>
                </PrivateLayout>
            </HomeLayout>
        </MainLayout>
    );
};

export default Home;
