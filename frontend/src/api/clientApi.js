import axiosInstance from '../utils/axiosInstance';

export const clientAPI = {
  create: async (clientData) => {
    const response = await axiosInstance.post('/clients', clientData);
    return response.data.data.client;
  },

  getAll: async (page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'desc') => {
    const response = await axiosInstance.get('/clients', {
      params: { page, limit, search, sortBy, sortOrder },
    });
    return response.data.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/clients/${id}`);
    return response.data.data.client;
  },

  update: async (id, clientData) => {
    const response = await axiosInstance.put(`/clients/${id}`, clientData);
    return response.data.data.client;
  },

  delete: async (id, hardDelete = false) => {
    const response = await axiosInstance.delete(`/clients/${id}`, {
      params: { hardDelete },
    });
    return response.data;
  },

  search: async (query, limit = 10) => {
    const response = await axiosInstance.get('/clients/search', {
      params: { query, limit },
    });
    return response.data.data.clients;
  },

  bulkUpdate: async (clientIds, updateData) => {
    const response = await axiosInstance.post('/clients/bulk/update', {
      clientIds,
      updateData,
    });
    return response.data.data;
  },

  uploadDocument: async (clientId, file, documentType) => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', documentType);

    const response = await axiosInstance.post(`/export/clients/${clientId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  getDocuments: async (clientId) => {
    const response = await axiosInstance.get(`/export/clients/${clientId}/documents`);
    return response.data.data.documents;
  },

  deleteDocument: async (clientId, docId) => {
    const response = await axiosInstance.delete(`/export/clients/${clientId}/documents/${docId}`);
    return response.data;
  },

  downloadDocument: async (clientId, docId) => {
    const response = await axiosInstance.get(
      `/export/clients/${clientId}/documents/${docId}/download`,
      { responseType: 'blob' }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `document-${docId}`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  exportCSV: async (clientIds = null) => {
    const params = clientIds ? { clientIds: clientIds.join(',') } : {};
    const response = await axiosInstance.get('/export/csv', {
      params,
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `clients-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  exportPDF: async (clientIds = null) => {
    const params = clientIds ? { clientIds: clientIds.join(',') } : {};
    const response = await axiosInstance.get('/export/pdf', {
      params,
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `clients-export-${new Date().toISOString().split('T')[0]}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
