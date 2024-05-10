import { UserCard } from '@/entities/user';
import { Button } from '@/shared/ui/button';
import { Link } from 'react-router-dom';
import {
    FileIcon,
    CardStackIcon,
    HomeIcon,
    GearIcon,
} from '@radix-ui/react-icons';
const HomeSideBar = () => {
    return (
        <div className="fixed my-4 ml-2 h-full w-[250px] rounded-lg bg-background">
            <div className="mx-4 mt-6 flex h-full flex-col">
                <UserCard />
                <div className="mt-4 w-full">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-base"
                    >
                        <HomeIcon className="mr-2 h-5 w-5" />
                        <Link to="/home">Home</Link>
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-base"
                    >
                        <CardStackIcon className="mr-2 h-5 w-5" />
                        <Link to="/projects">Projects</Link>
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-base"
                    >
                        <FileIcon className="mr-2 h-5 w-5" />
                        <Link to="/templates">Templates</Link>
                    </Button>
                </div>
            </div>
            <div className="fixed bottom-0 mx-4 mb-4 w-[220px] border-t pt-4">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-base"
                >
                    <GearIcon className="mr-2 h-5 w-5" />
                    <Link to="/settings">Settings</Link>
                </Button>
            </div>
        </div>
    );
};

export default HomeSideBar;
