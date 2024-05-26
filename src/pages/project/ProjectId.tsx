import MainLayout from '../MainLayout';
import { Project } from '@/widgets/Project';
import ProjectLayout from './ProjectLayout';

const ProjectId = () => {
    return (
        <MainLayout>
            <ProjectLayout>
                <div
                    className="flex h-full w-full flex-col items-center justify-center bg-neutral-200"
                    id="workingSpace"
                >
                    <Project />
                </div>
            </ProjectLayout>
        </MainLayout>
    );
};

export default ProjectId;
