import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../MainLayout';
import HomeLayout from './HomeLayout';
import { PrivateLayout } from '../PrivateLayout';
import Carousel from '@/widgets/Carousel';
import { Card, CardContent } from '@/shared/ui/card';

const Home = () => {
    return (
        <MainLayout>
            <HomeLayout>
                <PrivateLayout>
                    <div className="flex flex-col h-full w-full p-4 gap-4">
                        
                        <div className="p-1 xl:h-[350px] lg:h-[250px] phone:h-[250px]">
                            <Card className="xl:h-[350px] lg:h-[250px] phone:h-[250px]">
                                <CardContent
                                    className="flex p-6 h-full bg-cover bg-center rounded-md items-center select-none"
                                    style={{
                                        backgroundImage: `url('/background.png')`,
                                    }}
                                >
                                    <p className="font-bold xl:text-6xl lg:text-5xl ipad:text-4xl phone:text-xl text-white">
                                        Welcome to ElephArt <br /> create your masterpieces with us!
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="h-full w-full rounded-t-lg bg-background">
                            <h2 className="text-left text-xl font-bold my-4 mx-4">You might want to try...</h2>
                            <Carousel />
                        </div>
                    </div>
                </PrivateLayout>
            </HomeLayout>
        </MainLayout>
    );
};

export default Home;
