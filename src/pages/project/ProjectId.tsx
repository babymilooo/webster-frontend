import { useParams } from 'react-router-dom';
import MainLayout from '../MainLayout';
import { Project } from '@/widgets/Project';
import ProjectLayout from './ProjectLayout';

const ProjectId = () => {
    let { id } = useParams();
    return (
        <MainLayout>
            <ProjectLayout>
                <div className="h-full w-full flex flex-col items-center justify-center bg-neutral-200">
                    <p>Project {id}</p>
                    <Project />
                </div>
            </ProjectLayout>
        </MainLayout>
    );
};

export default ProjectId;
