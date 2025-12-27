import axiosInstance from './axios';

export const dashboardAPI = {
  getData: async (): Promise<{ success: boolean; data: any }> => {
    const response = await axiosInstance.get('/dashboard/data');
    return response.data;
  }
};