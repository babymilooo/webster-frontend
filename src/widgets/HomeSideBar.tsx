const HomeSideBar = () => {
    return (
        <div className="fixed my-[65px] mb-2 ml-2 h-full w-[300px] rounded-lg bg-background">
            <div className="flex h-[65px] items-center justify-center text-2xl font-bold">
                <p>Home</p>
            </div>
            <div className="flex h-full flex-col items-center">
                <div className="flex h-[200px] w-[200px] items-center justify-center rounded-lg ">
                    <p>Profile Picture</p>
                </div>
                <p className="mt-2 text-lg font-bold">User Name</p>
            </div>
        </div>
    );
};

export default HomeSideBar;
