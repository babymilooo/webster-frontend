import { useEffect } from 'react';
import MainLayout from '../MainLayout';
import HomeLayout from './HomeLayout';
import { useUserStore } from '@/entities/user';

const Projects = () => {
    
    const projects = useUserStore((state) => state.projects);
    useEffect(() => {
        console.log(projects);
    }, []);

    return (
        <MainLayout>
            <HomeLayout>
                <div className="flex h-full w-full pl-4 pr-2 pt-4">
                    <div className="h-full w-full rounded-t-lg bg-background">
                        asdasd
                    </div>
                </div>
            </HomeLayout>
        </MainLayout>
    );
};

export default Projects;
