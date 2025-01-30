import AuthCard from "@/components/auth/AuthCard";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <main className='h-screen grid grid-cols-auth gap-16 p-4 pr-24'>
      <AuthCard />
      <SignupForm />
    </main>
  );
}
