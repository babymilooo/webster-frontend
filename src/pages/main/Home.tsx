import { useProjectStore } from '@/entities/project';
import { useInitProjectStore } from '@/entities/project/model/initProjectStore';
import { useUserStore } from '@/entities/user';
import { Card, CardContent } from '@/shared/ui/card';
import Carousel from '@/widgets/Carousel';
import CreateProjectModal from '@/widgets/CreateProject';
import { SavedProjectTile } from '@/widgets/SavedProjectTile';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../MainLayout';
import { PrivateLayout } from '../PrivateLayout';
import HomeLayout from './HomeLayout';

const Home = () => {
    const projects = useUserStore((state) => state.projects);

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
                        <div className="h-full w-full rounded-lg bg-background">
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
