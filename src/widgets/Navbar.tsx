import { Img } from 'react-image';
import { Skeleton } from '../shared/ui/skeleton';
import { useUserStore } from '@/entities/user/model/userStore';
import { Button } from '@/shared/ui/button';
import { Link } from 'react-router-dom';
import { UserCard } from '@/entities/user';

const Navbar = () => {
    const isLogin = useUserStore((state) => state.isLogin);
    const isLoading = useUserStore((state) => state.isLoading);
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
                {isLoading && (
                    <div className="flex flex-1 items-center justify-end space-x-2">
                        <div className="flex items-center space-x-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                        </div>
                    </div>
                )}

                {isLogin ? (
                    <div className="flex flex-1 items-center justify-end space-x-2">
                        <UserCard />
                    </div>
                ) : (
                    <div className="flex flex-1 items-center justify-end space-x-2">
                        <Button variant="ghost">
                            <Link to="/auth/login">Login</Link>
                        </Button>
                        <button className=" rounded-3xl bg-green-600 px-6 py-3 text-xs font-bold">
                            <Link to="/auth/registration">Sign up</Link>
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
