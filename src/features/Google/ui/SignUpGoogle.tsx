import { Img } from 'react-image';

const SignUpGoogle = () => {
    return (
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
    );
};

export default SignUpGoogle;
