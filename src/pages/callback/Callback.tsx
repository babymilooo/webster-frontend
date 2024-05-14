import { useEffect, useState } from 'react';
import { signUpGoogleCallback } from '@/entities/user/api/signUpGoogle';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/entities/user';

const Callback = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();
    const setUser = useUserStore((state) => state.setUser);

    useEffect(() => {
        (async () => {
            const queryParams =
                typeof window !== 'undefined'
                    ? new URLSearchParams(window.location.search)
                    : null;
            const code = queryParams ? queryParams.get('code') : null;
            console.log(code);
            if (code && !isProcessing) {
                setIsProcessing(true);
                try {
                    const response = await signUpGoogleCallback(code);
                    if (response?.status === 200) {
                        setUser(response.data);
                        return navigate('/home');
                    }
                } catch (error) {
                    console.error(error);
                    return navigate('/auth/login');
                }
            }
        })();
    }, []);

    return <div>Loading...</div>;
};

export default Callback;
