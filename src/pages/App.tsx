import React from 'react';

const App = () => {
    return (
        <div className="flex h-full flex-col items-center justify-center select-none">
            <div className=" flex animate-fade-right gap-3 text-5xl  font-bold text-foreground animate-duration-[1500ms] animate-ease-out">
                <p className="">Welcome to</p>
                <div className="">
                    ElephArt
                </div>
            </div>
            <p className="animate-fade-right text-2xl text-foreground animate-duration-[1500ms] animate-ease-out">
                create your masterpieces with us!
            </p>
            <div className="font-bold mt-5 bg-gray-400 p-2 px-4 rounded-3xl cursor-pointer">Get Start</div>
        </div>
    );
};

export default App;
