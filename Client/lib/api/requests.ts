import axiosInstance from './axios';

export interface MaintenanceRequest {
    _id: string;
    subject: string;
    description: string;
    equipment: Array<{
        _id: string;
        name: string;
        serialNumber: string;
    }>;
    maintenanceTeam: {
        _id: string;
        name: string;
        specialization: string;
    };
    assignedTechnician?: {
        _id: string;
        name: string;
        email: string;
    };
    requestType: 'CORRECTIVE' | 'PREVENTIVE';
    status: 'NEW' | 'IN_PROGRESS' | 'REPAIRED' | 'SCRAP';
    scheduledDate?: string;
    completedDate?: string;
    hoursSpent?: number;
    createdBy: {
        _id: string;
        name: string;
        email: string;
    };
    notes?: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    createdAt: string;
    updatedAt: string;
}

export interface CreateRequestData {
    subject: string;
    description: string;
    equipment: string[];
    maintenanceTeam: string;
    requestType: 'CORRECTIVE' | 'PREVENTIVE';
    scheduledDate?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    notes?: string;
}

export interface UpdateStatusData {
    status: 'NEW' | 'IN_PROGRESS' | 'REPAIRED' | 'SCRAP';
    hoursSpent?: number;
    notes?: string;
}

export interface AssignTechnicianData {
    technicianId: string;
}

export interface RequestFilters {
    status?: string;
    requestType?: string;
    maintenanceTeam?: string;
    assignedTechnician?: string;
    priority?: string;
}

export const requestsAPI = {

    getAll: async (filters?: RequestFilters): Promise<{ success: boolean; requests: MaintenanceRequest[] }> => {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.requestType) params.append('requestType', filters.requestType);
        if (filters?.maintenanceTeam) params.append('maintenanceTeam', filters.maintenanceTeam);
        if (filters?.assignedTechnician) params.append('assignedTechnician', filters.assignedTechnician);
        if (filters?.priority) params.append('priority', filters.priority);

        const response = await axiosInstance.get(`/requests?${params.toString()}`);
        return response.data;
    },


    getById: async (id: string): Promise<{ success: boolean; request: MaintenanceRequest }> => {
        const response = await axiosInstance.get(`/requests/${id}`);
        return response.data;
    },


    getByEquipment: async (equipmentId: string): Promise<{ success: boolean; requests: MaintenanceRequest[] }> => {
        const response = await axiosInstance.get(`/requests/equipment/${equipmentId}`);
        return response.data;
    },


    getCalendar: async (month?: number, year?: number): Promise<{ success: boolean; requests: MaintenanceRequest[] }> => {
        const currentDate = new Date();
        const targetMonth = month || (currentDate.getMonth() + 1);
        const targetYear = year || currentDate.getFullYear();

        const response = await axiosInstance.get(`/requests/calendar?month=${targetMonth}&year=${targetYear}`);
        return response.data;
    },


    create: async (data: CreateRequestData): Promise<{ success: boolean; request: MaintenanceRequest }> => {
        const response = await axiosInstance.post('/requests', data);
        return response.data;
    },


    updateStatus: async (id: string, data: UpdateStatusData): Promise<{ success: boolean; request: MaintenanceRequest }> => {
        const response = await axiosInstance.patch(`/requests/${id}/status`, data);
        return response.data;
    },


    assignTechnician: async (id: string, data: AssignTechnicianData): Promise<{ success: boolean; request: MaintenanceRequest }> => {
        const response = await axiosInstance.patch(`/requests/${id}/assign`, data);
        return response.data;
    },
};
