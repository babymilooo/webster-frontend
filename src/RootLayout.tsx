import { useUserStore } from '@/entities/user';
import { ReactNode, useEffect } from 'react';

const RootLayout = ({ children }: { children: ReactNode }) => {
    const checkAuth = useUserStore((state) => state.checkAuth);
    const checked = useUserStore((state) => state.checked);
    useEffect(() => {
        const handleCheckAuth = async () => {
            if (checked) return;
            try {
                await checkAuth();
            } catch (error) {
                console.error('Error checking authentication:', error);
                // Handle error if needed
            }
        };

        handleCheckAuth();
    }, [checked]);
    return (
        <div className="min-h-screen bg-muted">
            {checked ? (
                <main className="min-h-screen">{children}</main>
            ) : (
                <div className="flex min-h-screen items-center justify-center">
                    <p className="text-lg text-foreground">
                        Checking authentication...
                    </p>
                </div>
            )}
        </div>
    );
};

export default RootLayout;
