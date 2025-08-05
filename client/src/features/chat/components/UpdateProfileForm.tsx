import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateName, useUpdateProfilePicture } from "@/hooks/useUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { useForm } from "react-hook-form";
import { z } from "zod";

const nameSchema = z.object({
  fullName: z.string().min(3, "Name is required"),
});
type NameFormData = z.infer<typeof nameSchema>;

const UpdateProfileForm = () => {
    const { mutate: updateName, isPending: isUpdatingName } = useUpdateName();
    const { mutate: updatePicture, isPending: isUpdatingPicture } =
        useUpdateProfilePicture();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<NameFormData>({
        resolver: zodResolver(nameSchema),
    });

    const onNameSubmit = (data: NameFormData) => updateName(data.fullName);

    const handlePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
        updatePicture(file);
        }
    };

    return (
        <div className="space-y-6 py-4">
        {/* Update Name Form */}
        <form onSubmit={handleSubmit(onNameSubmit)} className="space-y-4">
            <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" {...register("fullName")} />
            {errors.fullName && (
                <p className="text-sm text-destructive">
                {errors.fullName.message}
                </p>
            )}
            </div>
            <Button type="submit" disabled={isUpdatingName}>
            {isUpdatingName ? "Saving..." : "Save Name"}
            </Button>
        </form>

        {/* Update Profile Picture Form */}
        <div className="space-y-2">
            <Label htmlFor="profilePicture">Update Profile Picture</Label>
            <Input
            id="profilePicture"
            type="file"
            onChange={handlePictureChange}
            disabled={isUpdatingPicture}
            />
            {isUpdatingPicture && (
            <p className="text-sm text-muted-foreground">Uploading...</p>
            )}
        </div>
        </div>
    );
};

export default UpdateProfileForm;