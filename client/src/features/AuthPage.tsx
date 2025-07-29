import { useState } from "react";
import RegisterForm from "./auth/components/RegisterForm";
import LoginForm from "./auth/components/LoginForm";

export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="font-sans bg-customBackground min-h-screen w-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isLoginView ? (
          <LoginForm setIsLoginView={setIsLoginView} />
        ) : (
          <RegisterForm setIsLoginView={setIsLoginView} />
        )}
      </div>
    </div>
  );
}
