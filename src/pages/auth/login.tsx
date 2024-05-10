import { LoginUser } from '@/entities/user';

import { Img } from 'react-image';
import { Link } from 'react-router-dom';

const Login = () => {
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
                    <p className="w-1/2 text-center font-bold">Welcome back!</p>
                    <LoginUser />

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
