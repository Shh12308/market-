import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-xl border p-8">
        <h1 className="mb-6 text-3xl font-bold">
          Create Account
        </h1>

        <RegisterForm />
      </div>
    </main>
  );
}
