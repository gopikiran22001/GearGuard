import axiosInstance from './axios';

export interface Equipment {
    _id: string;
    name: string;
    serialNumber: string;
    category: 'MACHINERY' | 'VEHICLE' | 'COMPUTER' | 'TOOL' | 'OTHER';
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
    defaultTechnician?: {
        _id: string;
        name: string;
        email: string;
    };
    status: 'ACTIVE' | 'SCRAPPED';
    scrapReason?: string;
    scrapDate?: string;
    specifications?: string;
    openRequestsCount?: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateEquipmentData {
    name: string;
    serialNumber: string;
    category: 'MACHINERY' | 'VEHICLE' | 'COMPUTER' | 'TOOL' | 'OTHER';
    purchaseDate: string;
    warrantyExpiry: string;
    location: string;
    department: string;
    assignedEmployee: string;
    maintenanceTeam: string;
    defaultTechnician?: string;
    specifications?: string;
}

export interface UpdateEquipmentData extends Partial<CreateEquipmentData> { }

export interface EquipmentFilters {
    department?: string;
    status?: 'ACTIVE' | 'SCRAPPED';
    assignedEmployee?: string;
    category?: string;
}

export const equipmentAPI = {

    getAll: async (filters?: EquipmentFilters): Promise<{ success: boolean; equipments: Equipment[] }> => {
        const params = new URLSearchParams();
        if (filters?.department) params.append('department', filters.department);
        if (filters?.status) params.append('status', filters.status);
        if (filters?.assignedEmployee) params.append('assignedEmployee', filters.assignedEmployee);

        const response = await axiosInstance.get(`/equipment?${params.toString()}`);
        return response.data;
    },


    getById: async (id: string): Promise<{ success: boolean; equipment: Equipment }> => {
        const response = await axiosInstance.get(`/equipment/${id}`);
        return response.data;
    },


    create: async (data: CreateEquipmentData): Promise<{ success: boolean; equipment: Equipment }> => {
        const response = await axiosInstance.post('/equipment', data);
        return response.data;
    },


    update: async (id: string, data: UpdateEquipmentData): Promise<{ success: boolean; equipment: Equipment }> => {
        const response = await axiosInstance.put(`/equipment/${id}`, data);
        return response.data;
    },


    delete: async (id: string): Promise<{ success: boolean; message: string }> => {
        const response = await axiosInstance.delete(`/equipment/${id}`);
        return response.data;
    },


    scrap: async (id: string, reason?: string): Promise<{ success: boolean; equipment: Equipment; message: string }> => {
        const response = await axiosInstance.patch(`/equipment/${id}/scrap`, { reason });
        return response.data;
    },
};
