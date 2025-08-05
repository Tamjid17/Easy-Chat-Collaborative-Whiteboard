import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

import * as userService from "../services/userService";
import { useAuthStore } from "@/store/authStore";


export const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: ["users", "search", query],
    queryFn: () => userService.searchUsers(query),
    enabled: !!query && query.length > 2,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateName = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);
  const token = useAuthStore((state) => state.token);

  return useMutation({
    mutationFn: userService.updateName,
    onSuccess: (data: any) => {
      toast.success("Name Updated!", {
        description: `Your name has been changed to ${data.user.fullName}.`,
      });

      if (token && data.user) {
        setAuth(token, data.user);
      }

      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error) => {
      const errorMessage =
        (error instanceof AxiosError && error.response?.data?.message) ||
        "Failed to update name.";
      toast.error("Update Failed", { description: errorMessage });
    },
  });
};

export const useUpdateProfilePicture = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);
  const token = useAuthStore((state) => state.token);

  return useMutation({
    mutationFn: userService.updateProfilePicture,
    onSuccess: (data: any) => {
      toast.success("Profile Picture Updated!", {
        description: "Your new picture has been saved.",
      });

      if (token && data.user) {
        setAuth(token, data.user);
      }

      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error) => {
      const errorMessage =
        (error instanceof AxiosError && error.response?.data?.message) ||
        "Failed to upload picture.";
      toast.error("Upload Failed", { description: errorMessage });
    },
  });
};

export const useChangePassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { oldPassword: string; newPassword: string }) =>
      userService.changePassword(
        variables.oldPassword,
        variables.newPassword
      ),
    onSuccess: () => {
      toast.success("Password Changed Successfully!");

      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error) => {
      const errorMessage =
        (error instanceof AxiosError && error.response?.data?.message) ||
        "Failed to change password.";
      toast.error("Update Failed", { description: errorMessage });
    },
  });
};

export const useBlockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.blockUser,
    onSuccess: () => {
      toast.success("User Blocked");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error) => {
      const errorMessage =
        (error instanceof AxiosError && error.response?.data?.message) ||
        "Failed to block user.";
      toast.error("Action Failed", { description: errorMessage });
    },
  });
};

export const useUnblockUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: userService.unblockUser,
        onSuccess: () => {
            toast.success("User Unblocked");
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
        },
        onError: (error) => {
        const errorMessage =
            (error instanceof AxiosError && error.response?.data?.message) ||
            "Failed to unblock user.";
        toast.error("Action Failed", { description: errorMessage });
        },
    });
};