import { useParams } from 'react-router-dom';
import MainLayout from '../MainLayout';
import { Project } from '@/widgets/Project';
import ProjectLayout from './ProjectLayout';

const ProjectId = () => {
    const { id } = useParams();
    return (
        <MainLayout>
            <ProjectLayout>
                <div
                    className="flex h-full w-full flex-col items-center justify-center bg-neutral-200"
                    id="workingSpace"
                >
                    <p>Project {id}</p>
                    <Project />
                </div>
            </ProjectLayout>
        </MainLayout>
    );
};

export default ProjectId;
