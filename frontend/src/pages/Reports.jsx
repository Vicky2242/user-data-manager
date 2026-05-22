import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Button, LoadingSpinner, Alert, Badge } from '../components/Common/index';
import { clientAPI } from '../api/clientApi';
import { customFieldAPI } from '../api/customFieldApi';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    inactiveClients: 0,
    customFields: 0,
    totalDocuments: 0,
  });
  const [clients, setClients] = useState([]);
  const [fields, setFields] = useState([]);
  const [selectedReport, setSelectedReport] = useState('overview');

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [clientsData, fieldsData] = await Promise.all([
        clientAPI.getAll(1, 10000),
        customFieldAPI.getAll(true),
      ]);

      setClients(clientsData.clients || []);
      setFields(fieldsData || []);

      const activeCount = clientsData.clients?.filter(c => c.isActive).length || 0;
      const inactiveCount = (clientsData.clients?.length || 0) - activeCount;
      const totalDocs = clientsData.clients?.reduce((sum, c) => sum + (c.documents?.length || 0), 0) || 0;

      setStats({
        totalClients: clientsData.clients?.length || 0,
        activeClients: activeCount,
        inactiveClients: inactiveCount,
        customFields: fieldsData?.length || 0,
        totalDocuments: totalDocs,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async (format) => {
    try {
      const activeClients = clients.filter(c => c.isActive);
      if (format === 'csv') {
        await clientAPI.exportCSV(activeClients.map(c => c._id));
      } else {
        await clientAPI.exportPDF(activeClients.map(c => c._id));
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to export ${format.toUpperCase()}`);
    }
  };

  const StatCard = ({ title, value, icon, color = 'blue' }) => {
    const colorClass = {
      blue: 'bg-blue-50 border-blue-200',
      green: 'bg-green-50 border-green-200',
      yellow: 'bg-yellow-50 border-yellow-200',
      red: 'bg-red-50 border-red-200',
    }[color];

    const iconColorClass = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      yellow: 'text-yellow-600',
      red: 'text-red-600',
    }[color];

    return (
      <div className={`${colorClass} border rounded-lg p-4 sm:p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
          </div>
          <span className={`text-3xl sm:text-4xl ${iconColorClass}`}>{icon}</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <DashboardLayout title="Reports">
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Reports & Analytics">
      {error && <Alert type="error" onClose={() => setError(null)}>{error}</Alert>}

      {/* Report Type Selector */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button
          onClick={() => setSelectedReport('overview')}
          variant={selectedReport === 'overview' ? 'primary' : 'secondary'}
          className="text-xs sm:text-sm"
        >
          📊 Overview
        </Button>
        <Button
          onClick={() => setSelectedReport('clients')}
          variant={selectedReport === 'clients' ? 'primary' : 'secondary'}
          className="text-xs sm:text-sm"
        >
          👥 Clients
        </Button>
        <Button
          onClick={() => setSelectedReport('fields')}
          variant={selectedReport === 'fields' ? 'primary' : 'secondary'}
          className="text-xs sm:text-sm"
        >
          ⚙️ Custom Fields
        </Button>
        <Button
          onClick={() => setSelectedReport('export')}
          variant={selectedReport === 'export' ? 'primary' : 'secondary'}
          className="text-xs sm:text-sm"
        >
          📥 Export
        </Button>
      </div>

      {/* Overview Report */}
      {selectedReport === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard title="Total Clients" value={stats.totalClients} icon="👥" color="blue" />
            <StatCard title="Active Clients" value={stats.activeClients} icon="✓" color="green" />
            <StatCard title="Inactive Clients" value={stats.inactiveClients} icon="○" color="yellow" />
            <StatCard title="Custom Fields" value={stats.customFields} icon="⚙️" color="blue" />
            <StatCard title="Total Documents" value={stats.totalDocuments} icon="📄" color="blue" />
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">Quick Summary</h3>
            <div className="space-y-3 text-sm sm:text-base text-gray-700">
              <p>
                <strong>Active Rate:</strong> {stats.totalClients > 0 ? ((stats.activeClients / stats.totalClients) * 100).toFixed(1) : 0}% of clients are active
              </p>
              <p>
                <strong>Avg Documents per Client:</strong> {stats.totalClients > 0 ? (stats.totalDocuments / stats.totalClients).toFixed(1) : 0}
              </p>
              <p>
                <strong>System Status:</strong> <Badge variant="green">Operational</Badge>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Clients Report */}
      {selectedReport === 'clients' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 sm:p-6 border-b">
              <h3 className="text-lg sm:text-xl font-semibold">All Clients</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold">Name</th>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold hidden sm:table-cell">Email</th>
                    <th className="px-4 py-3 text-center text-xs sm:text-sm font-semibold">Status</th>
                    <th className="px-4 py-3 text-center text-xs sm:text-sm font-semibold hidden md:table-cell">Docs</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {clients.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-gray-500 text-sm">
                        No clients found
                      </td>
                    </tr>
                  ) : (
                    clients.map((client) => (
                      <tr key={client._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-xs sm:text-sm text-gray-900 font-medium">{client.name}</td>
                        <td className="px-4 py-3 text-xs sm:text-sm text-gray-600 hidden sm:table-cell">{client.email}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant={client.isActive ? 'green' : 'gray'}>
                            {client.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center text-xs sm:text-sm text-gray-600 hidden md:table-cell">
                          {client.documents?.length || 0}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Custom Fields Report */}
      {selectedReport === 'fields' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 sm:p-6 border-b">
              <h3 className="text-lg sm:text-xl font-semibold">Custom Fields Configuration</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold">Field Name</th>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold hidden sm:table-cell">Type</th>
                    <th className="px-4 py-3 text-center text-xs sm:text-sm font-semibold">Required</th>
                    <th className="px-4 py-3 text-center text-xs sm:text-sm font-semibold hidden md:table-cell">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {fields.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-gray-500 text-sm">
                        No custom fields found
                      </td>
                    </tr>
                  ) : (
                    fields.map((field) => (
                      <tr key={field._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-xs sm:text-sm text-gray-900 font-medium">{field.name}</td>
                        <td className="px-4 py-3 text-xs sm:text-sm text-gray-600 hidden sm:table-cell">
                          <Badge variant="blue">{field.fieldType}</Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant={field.isRequired ? 'yellow' : 'gray'}>
                            {field.isRequired ? 'Yes' : 'No'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center hidden md:table-cell">
                          <Badge variant={field.isActive ? 'green' : 'gray'}>
                            {field.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Export Report */}
      {selectedReport === 'export' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">Export Data</h3>
            <p className="text-sm sm:text-base text-gray-700 mb-6">
              Export all active client data in your preferred format. The report includes all client information, documents, and custom field values.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => handleExportReport('csv')}
                className="text-xs sm:text-sm flex items-center gap-2"
              >
                📊 Export to CSV
              </Button>
              <Button
                onClick={() => handleExportReport('pdf')}
                className="text-xs sm:text-sm flex items-center gap-2"
              >
                📄 Export to PDF
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="font-semibold text-blue-900 mb-2">CSV Format</p>
              <p className="text-sm text-blue-800">
                Best for spreadsheets and data analysis. Includes all fields and is easy to import into Excel.
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="font-semibold text-green-900 mb-2">PDF Format</p>
              <p className="text-sm text-green-800">
                Best for reports and sharing. Formatted for printing and professional presentation.
              </p>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Reports;
