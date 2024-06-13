import { LayersStack } from '@/widgets/project/index';
import { Preview } from '@/widgets/project/index';

export const ProjectRightSidebar = () => {
    return (
        <div className="fixed right-0 z-10 h-full w-[300px] border bg-background shadow-md">
            <div className="flex h-full flex-col border-t-4 border-dashed">
                <div className="">
                    <Preview />
                </div>
                <LayersStack />
            </div>
        </div>
    );
};
