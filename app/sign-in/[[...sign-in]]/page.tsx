import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="container h-screen flex items-center justify-center">
      <SignIn />
    </div>
  );
}
