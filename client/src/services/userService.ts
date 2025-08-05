import apiClient from "@/api/apiClient";

export const searchUsers = async (query: string) => {
  const { data } = await apiClient.get("users/search", {
    params: { query },
  });
  return data;
};

export const updateName = async (fullName: string) => {
    const { data } = await apiClient.put("users/update-name", { fullName });
    return data;
}

export const updateProfilePicture = async (file: File) => {
    const formData = new FormData();
    formData.append("profilePicture", file);
    const { data } = await apiClient.put("users/update-picture", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data;
}

export const changePassword = async (oldPassword: string, newPassword: string) => {
    const { data } = await apiClient.put("users/change-password", { oldPassword, newPassword });
    return data;
};

export const blockUser = async (userId: string) => {
    const { data } = await apiClient.put("users/block-user", { userId });
    return data;
}

export const unblockUser = async (userId: string) => {
    const { data } = await apiClient.put("users/unblock-user", { userId });
    return data;
};