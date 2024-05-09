import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Img } from 'react-image';
import { Link } from 'react-router-dom';

const Registration = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="relative grid h-full grid-cols-5">
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
                    <p className="w-1/2 text-center font-bold">Create new account!</p>
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
                    <span className="mt-2 w-1/2 text-end text-xs text-background  underline select-none">
                        Forgot password?
                    </span>
                    <button className=" mt-4 w-1/2 rounded-lg bg-green-600 p-[12px] text-sm text-background text-white">
                        Sign up
                    </button>

                    <p className="mt-8 w-1/2 border-t"></p>
                    <p className="absolute bottom-[384px] mt-4 bg-background px-3 text-xs text-muted-foreground">
                        Or, Login with
                    </p>
                    <button className=" mt-8 flex w-1/2  items-center justify-center gap-2 rounded-lg border bg-white p-[9px] text-sm text-black">
                        <Img
                            src="../src/public/google.svg"
                            alt="My Image"
                            loader={<div>Loading...</div>}
                            unloader={<div>Failed to load image.</div>}
                            className="h-6"
                        />
                        Sign up with google
                    </button>

                    <span className="mt-4 w-1/2 text-center text-xs text-foreground">
                        Already have an account?{' '}
                        <span className="cursor-pointer text-green-600 underline">
                            <Link to="/auth/registration">Sign in</Link>
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Registration;
