import { Img } from 'react-image';
import { Skeleton } from '../components/ui/skeleton';

const Navbar = () => {
    return (
        <header className="fixed top-0 z-50 w-full bg-background">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <div className="flex">
                    <div className="flex cursor-pointer items-center text-xl text-foreground">
                        <Img
                            src="../src/public/logo.png"
                            alt="My Image"
                            loader={<div>Loading...</div>}
                            unloader={<div>Failed to load image.</div>}
                            className="h-12"
                        />
                    </div>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-2">
                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
