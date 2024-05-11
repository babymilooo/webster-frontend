import { Link } from 'react-router-dom';
import MainLayout from '../MainLayout';
import HomeLayout from './HomeLayout';
import { PrivateLayout } from '../PrivateLayout';

const Home = () => {
    return (
        <MainLayout>
            <HomeLayout>
                <PrivateLayout>
                    <div className="flex h-full w-full pl-4 pr-2 pt-4">
                        <div className="h-full w-full rounded-t-lg bg-background">
                            <button>
                                <Link to="/projects/1">new</Link>
                            </button>
                        </div>
                    </div>
                </PrivateLayout>
            </HomeLayout>
        </MainLayout>
    );
};

export default Home;
