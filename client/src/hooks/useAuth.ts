import { useMutation } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';

import { registerUser, loginUser } from '../services/authService';
import { useAuthStore } from '../store/authStore';

export const useRegisterMutation = () => {
    return useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            console.log("Registration successful!", data);
        },
        onError: (error) => {
            console.error("Registration failed:", error);
        }
    });
}

export const useLoginMutation = () => {
    const { setAuth } = useAuthStore();
    return useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            console.log("Login response:", data);
            if(data && data.success && data.accessToken) {
                const decodedToken: { fullName: string } = jwtDecode(data.accessToken);
                setAuth(data.accessToken, { fullName: decodedToken.fullName, email: data.user.email, id: data.user._id, profilePicture: data.user.profilePicture });
            }
        },
        onError: (e) => {
            console.error("Login failed:", e);
        }
    })
}