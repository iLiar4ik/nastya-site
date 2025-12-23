import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold">
            Репетитор по математике
          </Link>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}


