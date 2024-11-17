import { useClerk } from '@clerk/clerk-react';

const SignOutButton = () => {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <button className="text-white" onClick={handleSignOut}>
      Sign Out
    </button>
  );
};

export default SignOutButton;