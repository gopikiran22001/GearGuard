import axiosInstance from './axios';

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'TECHNICIAN' | 'EMPLOYEE';
  department: string;
  maintenanceTeam?: {
    _id: string;
    name: string;
    specialization: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserFilters {
  role?: string;
  department?: string;
  team?: string;
}

export const usersAPI = {
  getAll: async (filters?: UserFilters): Promise<{ success: boolean; users: UserProfile[] }> => {
    const params = new URLSearchParams();
    if (filters?.role) params.append('role', filters.role);
    if (filters?.department) params.append('department', filters.department);
    if (filters?.team) params.append('team', filters.team);

    const response = await axiosInstance.get(`/users?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<{ success: boolean; user: UserProfile }> => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  },

  getTechnicians: async (teamId?: string): Promise<{ success: boolean; technicians: UserProfile[] }> => {
    const params = teamId ? `?team=${teamId}` : '';
    const response = await axiosInstance.get(`/users/technicians${params}`);
    return response.data;
  },

  update: async (id: string, data: Partial<UserProfile>): Promise<{ success: boolean; user: UserProfile }> => {
    const response = await axiosInstance.put(`/users/${id}`, data);
    return response.data;
  }
};