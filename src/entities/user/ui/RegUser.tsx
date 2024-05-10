import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { useUserStore } from '@/entities/user/model/userStore';
import { useState } from 'react';
import { redirect } from 'react-router-dom';

export const RegUser = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const registerUser = useUserStore((state) => state.registerUser);

    const handleRegistration = async () => {
        registerUser(email, password);
        return redirect('/home');
    };

    return (
        <>
            <div className="w-1/2">
                <Label className="font-bold">email *</Label>
                <Input
                    placeholder="Email"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="w-1/2">
                <Label className="font-bold">password *</Label>
                <Input
                    placeholder="Password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <span className="mt-2 w-1/2 select-none text-end text-xs  text-background underline">
                Forgot password?
            </span>
            <button
                className=" mt-4 w-1/2 rounded-lg bg-green-600 p-[12px] text-sm text-background text-white"
                onClick={handleRegistration}
            >
                Sign up
            </button>
        </>
    );
};
