import $api from '@/app/http/axios';
import { LoginUser } from '@/entities/user';
import SignUpGoogle from '@/entities/user/ui/SignUpGoogle';
import { Button } from '@/shared/ui/button';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { FC, useState } from 'react';

import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <div className="relative grid min-h-screen  grid-cols-5">
            {/* Псевдоэлемент для фонового изображения */}
            <div
                className="absolute inset-0 col-span-5 scale-x-[-1] transform bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('../src/public/bg-2.jpg')`,
                }}
            ></div>

            <div className="col-span-3"></div>
            <div className="z-10 col-span-2 m-2 rounded-lg border bg-background shadow-lg">
                <div className="flex h-full w-full flex-col items-center justify-center text-2xl">
                    <p className="w-1/2 text-center font-bold">Welcome back!</p>
                    <LoginUser />

                    <div className="mt-4 flex w-1/2 items-center text-sm">
                        <hr className="flex-grow border-t border-gray-300" />
                        <span className="mx-2 text-xs text-muted-foreground">
                            Or, Login with
                        </span>
                        <hr className="flex-grow border-t border-gray-300" />
                    </div>

                    <SignUpGoogle />
                    <RestorePasswordEmailModal />
                    <span className="mt-4 w-1/2 text-center text-xs text-foreground">
                        Don't have an account?{' '}
                        <span className="cursor-pointer text-green-600 underline">
                            <Link to="/auth/registration">Sign up</Link>
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Login;

const RestorePasswordEmailModal: FC = () => {
    const [email, setEmail] = useState('');
    const [isSent, setIsSent] = useState(false);

    const handleClick = () => {
        const sendData = async () => {
            if (!email || email.trim().length === 0) return;
            await $api.post('/auth/password-reset/send-email', {
                email: email.trim(),
            });
            setIsSent(true);
        };
        sendData();
    };

    return (
        <Dialog>
            <DialogTrigger>
                <span className="mt-4 w-1/2 cursor-pointer text-center text-xs text-foreground text-green-600 underline">
                    Forgot your password?
                </span>
            </DialogTrigger>
            <DialogContent className="max-w-[600px]">
                <DialogTitle>Enter Your Email</DialogTitle>
                <div className="m-4 flex flex-row">
                    <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="text"
                        autoComplete="email"
                        placeholder="Account Email"
                    />
                    <Button className="mx-2" onClick={handleClick}>
                        Send
                    </Button>
                </div>
                {isSent && (
                    <div className="m-auto text-center">
                        Email was sent to your address
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
