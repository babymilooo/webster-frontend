import { useEffect, useState } from 'react';
import { signUpGoogleCallback } from '@/entities/user/api/signUpGoogle';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();
    
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
                        console.log(response);
                        //toast.success('Successfully authenticated with Google.');
                        return navigate('/home');
                    }
                } catch (error) {
                    console.error(error);
                    //toast.error('Authorization error. Please try again.');
                    return navigate('/auth/login');
                }
            }
        })();
    }, []);

    return (
        <div>Loading...</div>
    );
};

export default Callback;
