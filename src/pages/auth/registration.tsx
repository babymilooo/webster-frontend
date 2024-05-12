import { RegUser } from '@/entities/user';
import SignUpGoogle from '@/features/Google/ui/SignUpGoogle';
import { Img } from 'react-image';
import { Link } from 'react-router-dom';

const Registration = () => {
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
                    <p className="w-1/2 text-center font-bold">
                        Create new account!
                    </p>
                    <RegUser />

                    <p className="mt-8 w-1/2 border-t"></p>
                    <p className="absolute bottom-[384px] mt-4 bg-background px-3 text-xs text-muted-foreground">
                        Or, Login with
                    </p>
                    <SignUpGoogle />

                    <span className="mt-4 w-1/2 text-center text-xs text-foreground">
                        Already have an account?{' '}
                        <span className="cursor-pointer text-green-600 underline">
                            <Link to="/auth/login">Sign in</Link>
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Registration;
