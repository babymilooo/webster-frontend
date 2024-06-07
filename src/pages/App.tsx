import { Link } from 'react-router-dom';
import MainLayout from './MainLayout';
import { Img } from 'react-image';
import { useUserStore } from '@/entities/user';

const App = () => {
    const isLogin = useUserStore((state) => state.isLogin);
    return (
        <MainLayout>
            <div className="flex min-h-screen select-none items-center justify-center bg-white">
                <div className="text-center">
                    <div className=" flex animate-fade-right flex-col text-5xl  font-bold text-foreground animate-duration-[1500ms] animate-ease-out">
                        <p className="">Welcome to ElephArt.</p>
                        Simple way to <br />
                        <span className="text-green-600">
                            create your masterpieces
                        </span>
                    </div>
                    <p className="mt-4 text-gray-600">
                        Unleash Your Imagination. Dream Beyond Limits.
                    </p>
                    <div className="animate-fade animate-delay-[1000ms] animate-duration-[1500ms] animate-once animate-ease-out">
                        <button className="mt-5 animate-jump rounded-3xl border-2 border-foreground px-5 py-3 font-bold animate-delay-[1000ms] animate-duration-[1000ms] animate-once animate-ease-out">
                            {isLogin ? (
                                <Link to="/home">Get Start</Link>
                            ) : (
                                <Link to="/auth/login">Get Start</Link>
                            )}
                        </button>
                    </div>
                </div>
                <Img
                    src="../src/public/main.png"
                    alt="My Image"
                    loader={<div>Loading...</div>}
                    unloader={<div>Failed to load image.</div>}
                    className="h-[500px]"
                />
                {/* <div className=" flex animate-fade-right gap-3 text-5xl  font-bold text-foreground animate-duration-[1500ms] animate-ease-out">
                    <p className="">Welcome to</p>
                    <div className="">ElephArt</div>
                </div>
                <p className="animate-fade-right text-2xl text-foreground animate-duration-[1500ms] animate-ease-out">
                    create your masterpieces with us!
                </p>
                <div className="animate-fade animate-delay-[1000ms] animate-duration-[1500ms] animate-once animate-ease-out">
                    <button className="mt-5 animate-jump rounded-3xl bg-green-600 px-5 py-3 font-bold animate-delay-[1000ms] animate-duration-[1000ms] animate-once animate-ease-out">
                        <Link to="/home">Get Start</Link>
                    </button>
                </div> */}
            </div>
        </MainLayout>
    );
};

export default App;
