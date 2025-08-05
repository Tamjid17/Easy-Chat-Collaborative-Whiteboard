import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChangePassword } from "@/hooks/useUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
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

    const onSubmit = (data: PasswordFormData) => changePassword(data);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
        <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
            id="currentPassword"
            type="password"
            {...register("currentPassword")}
            />
            {errors.currentPassword && (
            <p className="text-sm text-destructive">
                {errors.currentPassword.message}
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