import ProjectLeftSidebar from '@/widgets/ProjectLeftSidebar';
import { ProjectNavbar } from '@/widgets/ProjectNavbar';
import ProjectRightSidebar from '@/widgets/ProjectRightSidebar';
import { ReactNode } from 'react';

const ProjectLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="h-full w-full pt-[50px]">
            <ProjectNavbar />
            <ProjectLeftSidebar />
            <ProjectRightSidebar />
            <div className="h-full w-full pl-[80px] pr-[300px]">{children}</div>
        </div>
    );
};

export default ProjectLayout;
