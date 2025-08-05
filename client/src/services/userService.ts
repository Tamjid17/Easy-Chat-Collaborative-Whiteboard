import apiClient from "@/api/apiClient";

export const searchUsers = async (query: string) => {
  const { data } = await apiClient.get("/users/search", {
    params: { query },
  });
  return data;
};

export const updateName = async (fullName: string) => {
    const { data } = await apiClient.put("update-name", { fullName });
    return data;
}

export const updateProfilePicture = async (file: File) => {
    const formData = new FormData();
    formData.append("profilePicture", file);
    const { data } = await apiClient.put("update-picture", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data;
}

export const changePassword = async (currentPassword: string, newPassword: string) => {
    const { data } = await apiClient.put("change-password", { currentPassword, newPassword });
    return data;
};

export const blockUser = async (userId: string) => {
    const { data } = await apiClient.put("block-user", { userId });
    return data;
}

export const unblockUser = async (userId: string) => {
    const { data } = await apiClient.put("unblock-user", { userId });
    return data;
};