import { ReactNode } from 'react';

const RootLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="h-screen bg-neutral-100">
            <main className="h-full">{children}</main>
        </div>
    );
};

export default RootLayout;
