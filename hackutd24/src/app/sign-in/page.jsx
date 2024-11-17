import { SignIn } from '@clerk/nextjs';

const SignInPage = () => {
  return <div className="h-screen w-full flex justify-center items-center bg-custom-background">
    <SignIn />
    </div>;
};

export default SignInPage;