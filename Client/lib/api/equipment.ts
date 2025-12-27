import axiosInstance from './axios';

export interface Equipment {
    _id: string;
    name: string;
    serialNumber: string;
    purchaseDate: string;
    warrantyExpiry: string;
    location: string;
    department: string;
    assignedEmployee?: {
        _id: string;
        name: string;
        email: string;
    };
    maintenanceTeam: {
        _id: string;
        name: string;
        specialization: string;
    };
    status: 'ACTIVE' | 'SCRAPPED';
    specifications?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateEquipmentData {
    name: string;
    serialNumber: string;
    purchaseDate: string;
    warrantyExpiry: string;
    location: string;
    department: string;
    assignedEmployee: string;
    maintenanceTeam: string;
    specifications?: string;
}

export interface UpdateEquipmentData extends Partial<CreateEquipmentData> { }

export interface EquipmentFilters {
    department?: string;
    status?: 'ACTIVE' | 'SCRAPPED';
    assignedEmployee?: string;
}

export const equipmentAPI = {
    // Get all equipment with optional filters
    getAll: async (filters?: EquipmentFilters): Promise<{ success: boolean; equipments: Equipment[] }> => {
        const params = new URLSearchParams();
        if (filters?.department) params.append('department', filters.department);
        if (filters?.status) params.append('status', filters.status);
        if (filters?.assignedEmployee) params.append('assignedEmployee', filters.assignedEmployee);

        const response = await axiosInstance.get(`/equipment?${params.toString()}`);
        return response.data;
    },

    // Get equipment by ID
    getById: async (id: string): Promise<{ success: boolean; equipment: Equipment }> => {
        const response = await axiosInstance.get(`/equipment/${id}`);
        return response.data;
    },

    // Create new equipment
    create: async (data: CreateEquipmentData): Promise<{ success: boolean; equipment: Equipment }> => {
        const response = await axiosInstance.post('/equipment', data);
        return response.data;
    },

    // Update equipment
    update: async (id: string, data: UpdateEquipmentData): Promise<{ success: boolean; equipment: Equipment }> => {
        const response = await axiosInstance.put(`/equipment/${id}`, data);
        return response.data;
    },

    // Delete equipment
    delete: async (id: string): Promise<{ success: boolean; message: string }> => {
        const response = await axiosInstance.delete(`/equipment/${id}`);
        return response.data;
    },

    // Mark equipment as scrapped
    scrap: async (id: string): Promise<{ success: boolean; equipment: Equipment; message: string }> => {
        const response = await axiosInstance.patch(`/equipment/${id}/scrap`);
        return response.data;
    },
};
