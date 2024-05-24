import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../MainLayout';
import HomeLayout from './HomeLayout';
import { PrivateLayout } from '../PrivateLayout';
import { ChangeEvent, useRef } from 'react';
import { useInitProjectStore } from '@/entities/project/model/initProjectStore';

const Home = () => {
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const backgroundImageInputRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();

    const [setStartImage, setStartBackgroundImage] = useInitProjectStore(
        (state) => [state.setStartingImage, state.setStartingBackgroundImage],
    );

    const handleSelectImageForProject = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target?.result;

            if (typeof data !== 'string') return;
            setStartImage(data);
            navigate('/projects/1');
        };
        reader.readAsDataURL(file);
    };

    const handleSelectbackgroundImageForProject = (
        e: ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target?.result;

            if (typeof data !== 'string') return;
            setStartBackgroundImage(data);
            navigate('/projects/1');
        };
        reader.readAsDataURL(file);
    };

    return (
        <MainLayout>
            <HomeLayout>
                <PrivateLayout>
                    <div className="flex h-full w-full pl-4 pr-2 pt-4">
                        <div className="h-full w-full rounded-t-lg bg-background">
                            <button>
                                <Link to="/projects/1">new</Link>
                            </button>
                            <div
                                className="flex h-10 w-fit items-center justify-center"
                                onClick={() => imageInputRef.current?.click()}
                            >
                                Create Project with image
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleSelectImageForProject}
                                    className="hidden"
                                    ref={imageInputRef}
                                />
                            </div>
                            <div
                                className="flex h-10 w-fit items-center justify-center"
                                onClick={() =>
                                    backgroundImageInputRef.current?.click()
                                }
                            >
                                Create Project with background image
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={
                                        handleSelectbackgroundImageForProject
                                    }
                                    className="hidden"
                                    ref={backgroundImageInputRef}
                                />
                            </div>
                        </div>
                    </div>
                </PrivateLayout>
            </HomeLayout>
        </MainLayout>
    );
};

export default Home;
