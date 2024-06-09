import { LayersStack } from './LayersStack';
import Preview from './Preview';

const ProjectRightSidebar = () => {
    return (
        <div className="fixed right-0 z-10 h-full w-[300px] border-t-4 border-dashed bg-background pt-[44px]">
            <div className="flex h-full flex-col border-t-4 border-dashed">
                <div className='h-[500px]'>
                    <Preview />
                </div>
                <LayersStack />
            </div>
        </div>
    );
};

export default ProjectRightSidebar;
