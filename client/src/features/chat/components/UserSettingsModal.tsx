import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import UpdateProfileForm from "./UpdateProfileForm";
import ChangePasswordForm from "./ChangePasswordForm";


const UserSettingsModal = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
            <Button variant="outline">Settings</Button>
            </DialogTrigger>
            <DialogContent>
            <DialogHeader>
                <DialogTitle>User Settings</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="profile">
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                    <UpdateProfileForm />
                    </TabsContent>
                    <TabsContent value="password">
                        <ChangePasswordForm />
                </TabsContent>
            </Tabs>
            </DialogContent>
        </Dialog>
    );
};

export default UserSettingsModal;