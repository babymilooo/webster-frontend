import { useEffect } from 'react';
import MainLayout from '../MainLayout';
import HomeLayout from './HomeLayout';
import { useUserStore } from '@/entities/user';
import Gallery from '@/widgets/Gallery';

const Projects = () => {
    
    const projects = useUserStore((state) => state.projects);
    // useEffect(() => {
    //     console.log(projects);
    // }, []);

    return (
        <MainLayout>
            <HomeLayout>
                <div className="flex w-full pl-4 pr-2 pt-4">
                    <Gallery />
                </div>
            </HomeLayout>
        </MainLayout>
    );
};

export default Projects;
