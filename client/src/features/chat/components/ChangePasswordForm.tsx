import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChangePassword } from "@/hooks/useUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

    const onSubmit = (data: PasswordFormData) => {
        changePassword(data);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
        <div className="space-y-2">
            <Label htmlFor="oldPassword">Old Password</Label>
            <Input
            id="oldPassword"
            type="password"
            {...register("oldPassword")}
            />
            {errors.oldPassword && (
            <p className="text-sm text-destructive">
                {errors.oldPassword.message}
            </p>
            )}
        </div>
        <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" {...register("newPassword")} />
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