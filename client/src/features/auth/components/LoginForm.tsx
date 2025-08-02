import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AtSign, Lock, MessageSquareText, Eye, EyeClosed } from "lucide-react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { useLoginMutation } from "@/hooks/useAuth";
import { AxiosError } from "axios";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
})

type LoginFormData = z.infer<typeof loginSchema>;

type LoginFormProps = {
  setIsLoginView: (value: boolean) => void;
};

const LoginForm = ({ setIsLoginView }: LoginFormProps) => {

  const { mutate, isPending, isError, error } = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const onSubmit = (data: LoginFormData) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full bg-card shadow-lg border-border/40">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <MessageSquareText className="h-10 w-10 text-customPrimary" />
          </div>
          <CardTitle className="text-2xl font-bold text-customPrimary">
            Easy Chat
          </CardTitle>
          <CardTitle className="text-lg font-semibold text-customAccentTwo">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to continue to your chats.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className={cn("pl-10", errors.email && "border-destructive")}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              {isPasswordVisible ? (
                <Eye
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <EyeClosed
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
                  onClick={togglePasswordVisibility}
                />
              )}
              <Input
                id="password"
                type={isPasswordVisible ? "text" : "password"}
                placeholder="••••••••"
                className={cn("pl-10", errors.password && "border-destructive")}
                {...register("password")}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-customPrimary text-primary-foreground hover:cursor-pointer hover:bg-customPrimary/90 font-semibold"
          >
            {isPending ? "Signing In..." : "Sign In"}
          </Button>
          {isError && (
            <p className="text-sm text-destructive">
              {error instanceof AxiosError && error.response?.data?.message
                ? error.response.data.message
                : "An unknown error occurred."}
            </p>
          )}
          <p className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <button
              onClick={() => setIsLoginView(false)}
              className="font-semibold text-customAccentTwo hover:underline focus:outline-none hover:cursor-pointer"
            >
              Create one
            </button>
          </p>
        </CardFooter>
      </Card>
    </form>
  );
};

export default LoginForm;
