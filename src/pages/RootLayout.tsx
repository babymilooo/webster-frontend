import Navbar from '@/components/main/Navbar';
import { ReactNode } from 'react';

const RootLayout = ({children} : { children: ReactNode }) => {
    return (
        <div className='bg-neutral-100 h-screen'>
            <Navbar />
            <main className='h-full pt-[50px]'>{children}</main>
        </div>
    );
};

export default RootLayout;