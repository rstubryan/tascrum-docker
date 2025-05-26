import RegisterForm from "@/components/organisms/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-sm px-4 sm:px-0">
        <RegisterForm />
      </div>
    </div>
  );
}
