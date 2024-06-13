import { ProjectLeftSidebar } from '@/widgets/project/index';
import { ProjectNavbar } from '@/widgets/project/index';
import { ProjectRightSidebar } from '@/widgets/project/index';
import { ScaleBar } from '@/widgets/project/index';
import { ReactNode } from 'react';

const ProjectLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="h-full w-full pr-[300px] pt-[50px]">
            <ProjectNavbar />
            <ProjectLeftSidebar />
            <ProjectRightSidebar />
            <div className="flex h-full w-full items-center pb-[100px] pt-[100px]">
                {children}
            </div>
            <ScaleBar />
        </div>
    );
};

export default ProjectLayout;
