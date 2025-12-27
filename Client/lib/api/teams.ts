import axiosInstance from './axios';

export interface Technician {
    _id: string;
    name: string;
    email: string;
    role: string;
    department: string;
}

export interface MaintenanceTeam {
    _id: string;
    name: string;
    description?: string;
    specialization: 'MECHANICAL' | 'ELECTRICAL' | 'IT' | 'HVAC' | 'GENERAL';
    technicians: Technician[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTeamData {
    name: string;
    description?: string;
    specialization: 'MECHANICAL' | 'ELECTRICAL' | 'IT' | 'HVAC' | 'GENERAL';
}

export interface UpdateTeamData extends Partial<CreateTeamData> { }

export const teamsAPI = {
    // Get all teams
    getAll: async (): Promise<{ success: boolean; teams: MaintenanceTeam[] }> => {
        const response = await axiosInstance.get('/teams');
        return response.data;
    },

    // Get team by ID
    getById: async (id: string): Promise<{ success: boolean; team: MaintenanceTeam }> => {
        const response = await axiosInstance.get(`/teams/${id}`);
        return response.data;
    },

    // Create new team
    create: async (data: CreateTeamData): Promise<{ success: boolean; team: MaintenanceTeam }> => {
        const response = await axiosInstance.post('/teams', data);
        return response.data;
    },

    // Update team
    update: async (id: string, data: UpdateTeamData): Promise<{ success: boolean; team: MaintenanceTeam }> => {
        const response = await axiosInstance.put(`/teams/${id}`, data);
        return response.data;
    },

    // Delete team
    delete: async (id: string): Promise<{ success: boolean; message: string }> => {
        const response = await axiosInstance.delete(`/teams/${id}`);
        return response.data;
    },

    // Add technician to team
    addTechnician: async (teamId: string, technicianId: string): Promise<{ success: boolean; team: MaintenanceTeam }> => {
        const response = await axiosInstance.post(`/teams/${teamId}/technicians`, { technicianId });
        return response.data;
    },

    // Remove technician from team
    removeTechnician: async (teamId: string, technicianId: string): Promise<{ success: boolean; team: MaintenanceTeam }> => {
        const response = await axiosInstance.delete(`/teams/${teamId}/technicians/${technicianId}`);
        return response.data;
    },
};
