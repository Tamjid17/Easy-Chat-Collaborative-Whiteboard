export interface User {
    _id: string;
    fullName: string;
    email: string;
    profilePicture?: string;
    joinedAt: string; 
    blockedUsers: string[];
    activeStatus: boolean;
}
