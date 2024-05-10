import MainLayout from '../MainLayout';
import HomeLayout from './HomeLayout';

const Templates = () => {
    return (
        <MainLayout>
            <HomeLayout>
                <div className="flex h-full w-full pl-4 pr-2 pt-4">
                    <div className="h-full w-full rounded-t-lg bg-background"></div>
                </div>
            </HomeLayout>
        </MainLayout>
    );
};

export default Templates;
