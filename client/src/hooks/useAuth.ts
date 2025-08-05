import { useMutation } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';
import { AxiosError } from "axios";

import { registerUser, loginUser } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export const useRegisterMutation = () => {
    return useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            console.log("Registration successful!", data);
            toast.success("Registration Successful!", {
                description: "You can now log in with your new account.",
            });
        },
        onError: (error) => {
            const errorMessage =
                error instanceof AxiosError && error?.response?.data?.message ||
                "An unknown error occurred during registration.";
            toast.error("Registration Failed", {
                description: errorMessage,
            });
            console.error("Registration failed:", error);
        }
    });
}

export const useLoginMutation = () => {
    const { setAuth } = useAuthStore();
    const navigate = useNavigate();
    return useMutation({
      mutationFn: loginUser,
      onSuccess: (data) => {
        console.log("Login response:", data);
        if (data && data.success && data.accessToken && data.user) {
          const decodedToken: { fullName: string } = jwtDecode(
            data.accessToken
          );
          setAuth(data.accessToken, {
            fullName: decodedToken.fullName,
            email: data.user.email,
            _id: data.user._id,
            profilePicture: data.user.profilePicture,
            joinedAt: data.user.joinedAt,
            blockedUsers: data.user.blockedUsers,
            activeStatus: data.user.activeStatus,
          });
          toast.success("Login Successful!", {
            description: `Welcome back, ${decodedToken.fullName}!`,
          });

          navigate("/");
        } else {
          toast.error("Login Failed", {
            description: data.message || "Invalid credentials provided.",
          });
        }
      },
      onError: (e) => {
        const errorMessage =
          (e instanceof AxiosError && e?.response?.data?.message) ||
          "Invalid credentials or server error.";
        toast.error("Login Failed", {
          description: errorMessage,
        });
        console.error("Login failed:", e);
      },
    });
}