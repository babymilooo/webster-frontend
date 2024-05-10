import HomeSideBar from '@/widgets/HomeSideBar';
import { ReactNode } from 'react';

const HomeLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="h-full">
            <HomeSideBar />
            <main className="h-full pl-[300px] flex">{children}</main>
        </div>
    );
};

export default HomeLayout;
