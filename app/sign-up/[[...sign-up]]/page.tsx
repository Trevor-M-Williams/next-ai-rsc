import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="container h-screen flex items-center justify-center">
      <SignUp />
    </div>
  );
}
