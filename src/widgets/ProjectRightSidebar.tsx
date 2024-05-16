import { LayersStack } from './LayersStack';

const ProjectRightSidebar = () => {
    return (
        <div className="fixed right-0 z-30 h-full w-[300px] bg-red-500">
            right
            <LayersStack />
        </div>
    );
};

export default ProjectRightSidebar;
