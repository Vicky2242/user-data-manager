import axiosInstance from '../utils/axiosInstance';

export const customFieldAPI = {
  create: async (fieldData) => {
    const response = await axiosInstance.post('/custom-fields', fieldData);
    return response.data.data.field;
  },

  getAll: async (includeInactive = false) => {
    const response = await axiosInstance.get('/custom-fields', {
      params: { includeInactive },
    });
    return response.data.data.fields;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/custom-fields/${id}`);
    return response.data.data.field;
  },

  update: async (id, fieldData) => {
    const response = await axiosInstance.put(`/custom-fields/${id}`, fieldData);
    return response.data.data.field;
  },

  delete: async (id, hardDelete = false) => {
    const response = await axiosInstance.delete(`/custom-fields/${id}`, {
      params: { hardDelete },
    });
    return response.data;
  },

  reorder: async (fieldOrders) => {
    const response = await axiosInstance.post('/custom-fields/reorder', {
      fieldOrders,
    });
    return response.data;
  },

  duplicate: async (id) => {
    const response = await axiosInstance.post(`/custom-fields/${id}/duplicate`);
    return response.data.data.field;
  },

  bulkUpdate: async (fieldIds, isActive) => {
    const response = await axiosInstance.post('/custom-fields/bulk/update', {
      fieldIds,
      isActive,
    });
    return response.data;
  },
};
