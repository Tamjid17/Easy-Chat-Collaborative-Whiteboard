import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AtSign, ImageIcon, Lock, MessageSquareText, User } from "lucide-react";

type RegisterFormProps = {
  setIsLoginView: (value: boolean) => void;
};

const RegisterForm = ({ setIsLoginView }: RegisterFormProps) => {
  return (
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
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              className="pl-10"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="pl-10"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-10"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="pl-10"
              required
            />
          </div>
        </div>
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
  );
};

export default RegisterForm;