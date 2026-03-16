import { api } from "../config/api.js";

// Assign credits to a user
export const assignCredits = async (userId, credits) => {
    try {
        const res = await api.post(`/admin/assign-credits`, { userId, credits }, { withCredentials: true });
        return res.data;
    } catch (error) {
        console.log(error?.response?.data?.error || "Can't assign credits");
        throw error;
    }
};


// Get admin dashboard statistics
export const getAdminDashboard = async () => {
    try {
        const res = await api.get(`/admin/dashboard`,
            { withCredentials: true }
        );
        return res.data;
    } catch (error) {
        console.log(error?.response?.data?.error || "Can't load admin dashboard");
        throw error;
    }
};

// Get all users with pagination and filtering
export const getAllUsers = async (page = 1, search = '', role = 'all', limit = 10, sortBy = 'createdAt', sortOrder = 'desc') => {
    try {
        const res = await api.get(`/admin/users`, {
            params: { page, search, role, limit, sortBy, sortOrder },
            withCredentials: true
        });
        return res.data;
    } catch (error) {
        console.log(error?.response?.data?.error || "Can't load users");
        throw error;
    }
};

// Update user role (future functionality)
export const updateUserRole = async (userId, newRole) => {
    try {
        const res = await api.patch(`/admin/users/${userId}/role`,
            { role: newRole },
            { withCredentials: true }
        );
        return res.data;
    } catch (error) {
        console.log(error?.response?.data?.error || "Can't update user role");
        throw error;
    }
};

// Delete user (future functionality)
export const deleteUser = async (userId) => {
    try {
        const res = await api.delete(`/admin/users/${userId}`,
            { withCredentials: true }
        );
        return res.data;
    } catch (error) {
        console.log(error?.response?.data?.error || "Can't delete user");
        throw error;
    }
};

// Block/Unblock user
export const toggleUserStatus = async (userId) => {
    try {
        const res = await api.patch(`/admin/users/${userId}/status`,
            {},
            { withCredentials: true }
        );
        return res.data;
    } catch (error) {
        console.log(error?.response?.data?.error || "Can't update user status");
        throw error;
    }
};

// Reset user password
export const resetUserPassword = async (userId, newPassword) => {
    try {
        const res = await api.patch(`/admin/users/${userId}/reset-password`,
            { newPassword },
            { withCredentials: true }
        );
        return res.data;
    } catch (error) {
        console.log(error?.response?.data?.error || "Can't reset password");
        throw error;
    }
};
