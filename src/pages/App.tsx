import { Link } from 'react-router-dom';
import MainLayout from './MainLayout';

const App = () => {
    return (
        <MainLayout>
            <div className="flex min-h-screen select-none flex-col items-center justify-center">
                <div className=" flex animate-fade-right gap-3 text-5xl  font-bold text-foreground animate-duration-[1500ms] animate-ease-out">
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
                </div>
            </div>
        </MainLayout>
    );
};

export default App;
