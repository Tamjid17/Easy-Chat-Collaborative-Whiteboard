import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AtSign, ImageIcon, Lock, MessageSquareText, User, Eye, EyeClosed } from "lucide-react";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";

const registrationSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().regex(
    /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d)[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
    "Password must be at least 8 characters long and contain at least one number and one special character"
  ),
  confirmPassword: z.string().regex(
    /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d)[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
    "Password must be at least 8 characters long and contain at least one number and one special character"
  ),
  profilePicture: z.instanceof(File).optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type RegistrationFormData = z.infer<typeof registrationSchema>;

type RegisterFormProps = {
  setIsLoginView: (value: boolean) => void;
};

const RegisterForm = ({ setIsLoginView }: RegisterFormProps) => {

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
  });

  const onSubmit = (data: RegistrationFormData) => {
    console.log("Submitted Data:", data);
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
            Create an Account
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Join and enjoy seamless chatting experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Full Name field */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                className={cn("pl-10", errors.fullName && "border-destructive")}
                {...register("fullName")}
              />
            </div>
            {errors.fullName && (
              <p className="text-sm text-destructive">{errors.fullName.message}</p>
            )}
          </div>

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

          {/* Confirm Password field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
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
                id="confirmPassword"
                type={isPasswordVisible ? "text" : "password"}
                placeholder="••••••••"
                className={cn(
                  "pl-10",
                  errors.confirmPassword && "border-destructive"
                )}
                {...register("confirmPassword")}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Profile Picture field */}
          <div className="space-y-2">
            <Label htmlFor="profilePicture">Profile Picture (Optional)</Label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="profilePicture"
                type="file"
                className="pl-10 file:text-sm file:font-medium file:text-customAccentOne"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full bg-customPrimary text-primary-foreground hover:cursor-pointer hover:bg-customPrimary/90 font-semibold">
            Create Account
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={() => setIsLoginView(true)}
              className="font-semibold text-customAccentTwo hover:underline focus:outline-none hover:cursor-pointer"
            >
              Sign In
            </button>
          </p>
        </CardFooter>
      </Card>
    </form>
  );
};

export default RegisterForm;