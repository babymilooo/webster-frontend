import MainLayout from '../MainLayout';
import HomeLayout from './HomeLayout';

const Home = () => {
    return (
        <MainLayout>
            <HomeLayout>
            <div className="flex h-full items-center justify-center">
                <h1 className="text-center text-4xl font-bold">Home Page</h1>
            </div>
            </HomeLayout>
        </MainLayout>
    );
};

export default Home;
