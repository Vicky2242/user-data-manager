import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { Button, LoadingSpinner, Alert, Badge } from '../components/Common/index';
import { clientAPI } from '../api/clientApi';

const ClientsList = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedClients, setSelectedClients] = useState([]);

  useEffect(() => {
    fetchClients();
  }, [page, limit, search]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await clientAPI.getAll(page, limit, search);
      setClients(data.clients);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;

    try {
      await clientAPI.delete(id);
      setClients(clients.filter((c) => c._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete client');
    }
  };

  const handleExportCSV = async () => {
    try {
      if (selectedClients.length > 0) {
        await clientAPI.exportCSV(selectedClients);
      } else {
        await clientAPI.exportCSV();
      }
    } catch (err) {
      setError('Failed to export CSV');
    }
  };

  const handleExportPDF = async () => {
    try {
      if (selectedClients.length > 0) {
        await clientAPI.exportPDF(selectedClients);
      } else {
        await clientAPI.exportPDF();
      }
    } catch (err) {
      setError('Failed to export PDF');
    }
  };

  const toggleClientSelection = (id) => {
    setSelectedClients((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  return (
    <DashboardLayout title="Manage Clients">
      {error && (
        <Alert type="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Header with search and actions */}
      <div className="mb-4 sm:mb-6 md:mb-8 flex flex-col gap-3 sm:gap-4">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        />

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button variant="success" size="sm" onClick={handleExportCSV} className="text-xs sm:text-sm flex-1 sm:flex-none">
            📥 CSV
          </Button>
          <Button variant="success" size="sm" onClick={handleExportPDF} className="text-xs sm:text-sm flex-1 sm:flex-none">
            📄 PDF
          </Button>
          <Button size="sm" onClick={() => navigate('/clients/create')} className="text-xs sm:text-sm flex-1 sm:flex-none">
            ➕ New
          </Button>
        </div>
      </div>

      {/* Clients Table */}
      {loading ? (
        <LoadingSpinner />
      ) : clients.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-500 text-sm sm:text-base md:text-lg mb-4">No clients found</p>
          <Button onClick={() => navigate('/clients/create')}>Create First Client</Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left">
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        setSelectedClients(e.target.checked ? clients.map((c) => c._id) : [])
                      }
                      checked={selectedClients.length === clients.length && clients.length > 0}
                      className="cursor-pointer"
                    />
                  </th>
                  <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden sm:table-cell">Email</th>
                  <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden md:table-cell">Phone</th>
                  <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden lg:table-cell">Business</th>
                  <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {clients.map((client) => (
                  <tr key={client._id} className="hover:bg-gray-50 transition">
                    <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-4">
                      <input
                        type="checkbox"
                        checked={selectedClients.includes(client._id)}
                        onChange={() => toggleClientSelection(client._id)}
                        className="cursor-pointer"
                      />
                    </td>
                    <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 font-medium text-gray-900 text-xs sm:text-sm truncate">
                      <div>
                        <p className="truncate">{client.name}</p>
                        <p className="text-gray-600 text-xs sm:hidden">{client.email}</p>
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 text-gray-600 text-xs sm:text-sm hidden sm:table-cell truncate">{client.email}</td>
                    <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 text-gray-600 text-xs sm:text-sm hidden md:table-cell truncate">{client.phone}</td>
                    <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 hidden lg:table-cell">
                      <Badge variant="blue">{client.businessType || 'N/A'}</Badge>
                    </td>
                    <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 text-center">
                      <div className="flex justify-center gap-1 sm:gap-2">
                        <button
                          onClick={() => navigate(`/clients/${client._id}`)}
                          className="text-blue-600 hover:text-blue-700 font-medium text-base sm:text-lg p-1 hover:bg-blue-50 rounded transition"
                          title="View"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => navigate(`/clients/${client._id}/edit`)}
                          className="text-green-600 hover:text-green-700 font-medium text-base sm:text-lg p-1 hover:bg-green-50 rounded transition"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(client._id)}
                          className="text-red-600 hover:text-red-700 font-medium text-base sm:text-lg p-1 hover:bg-red-50 rounded transition"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <select
              value={limit}
              onChange={(e) => {
                setLimit(parseInt(e.target.value));
                setPage(1);
              }}
              className="px-2 sm:px-3 py-1 sm:py-1.5 border border-gray-300 rounded-lg focus:outline-none text-xs sm:text-sm w-full sm:w-auto"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>

            <div className="flex flex-wrap gap-1 sm:gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <Button
                variant="secondary"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(Math.max(1, page - 1))}
                className="text-xs sm:text-sm"
              >
                ← Prev
              </Button>
              <span className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                {page} of {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                className="text-xs sm:text-sm"
              >
                Next →
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ClientsList;
