import LoginForm from "@/components/organisms/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-sm px-4 sm:px-0">
        <LoginForm />
      </div>
    </div>
  );
}
