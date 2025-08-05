import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChangePassword } from "@/hooks/useUser";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";

const passwordSchema = z.object({
  oldPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .regex(
      /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d)[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
      "Password must be at least 8 characters long and contain at least one number and one special character"
    ),
});
type PasswordFormData = z.infer<typeof passwordSchema>;

const ChangePasswordForm = () => {
    const { mutate: changePassword, isPending } = useChangePassword();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
    });

    const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);

    const toggleOldPasswordVisibility = () => {
        setIsOldPasswordVisible(!isOldPasswordVisible);
    };

    const toggleNewPasswordVisibility = () => {
        setIsNewPasswordVisible(!isNewPasswordVisible);
    };

    const onSubmit = (data: PasswordFormData) => {
        changePassword(data);
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
        <div className="space-y-2">
          <Label htmlFor="oldPassword">Old Password</Label>
          <div className="relative">
            <Input
              id="oldPassword"
              type={isOldPasswordVisible ? "text" : "password"}
              {...register("oldPassword")}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={toggleOldPasswordVisibility}
            >
              {isOldPasswordVisible ? (
                <Eye className="h-5 w-5 text-muted-foreground" />
              ) : (
                <EyeClosed className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
          </div>
          {errors.oldPassword && (
            <p className="text-sm text-destructive">
              {errors.oldPassword.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <div className="relative">
            <Input
              id="newPassword"
              type={isNewPasswordVisible ? "text" : "password"}
              {...register("newPassword")}
            />
            <button
              type="button"
              onClick={toggleNewPasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              {isNewPasswordVisible ? (
                <Eye className="h-5 w-5 text-muted-foreground" />
              ) : (
                <EyeClosed className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-sm text-destructive">
              {errors.newPassword.message}
            </p>
          )}
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Change Password"}
        </Button>
      </form>
    );
};

export default ChangePasswordForm;