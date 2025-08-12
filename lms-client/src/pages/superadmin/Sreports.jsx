import { useState } from 'react';
import { FileBarChart, Download, ArrowUpDown, Search } from 'lucide-react';

// Sample report data
const initialReports = [
  { 
    id: 1, 
    name: 'Monthly Institute Activity', 
    type: 'analytics', 
    date: '2025-05-01', 
    downloads: 127,
    status: 'Available'
  },
  { 
    id: 2, 
    name: 'User Registration Trends', 
    type: 'users', 
    date: '2025-05-02', 
    downloads: 89,
    status: 'Available'
  },
  { 
    id: 3, 
    name: 'System Performance Metrics', 
    type: 'system', 
    date: '2025-05-03', 
    downloads: 62,
    status: 'Available'
  },
  { 
    id: 4, 
    name: 'Admin Activity Logs', 
    type: 'security', 
    date: '2025-05-04', 
    downloads: 45,
    status: 'Available'
  },
  { 
    id: 5, 
    name: 'Institute Comparison Summary', 
    type: 'analytics', 
    date: '2025-05-05', 
    downloads: 113,
    status: 'Available'
  },
  { 
    id: 6, 
    name: 'Security Incident Report', 
    type: 'security', 
    date: '2025-04-28', 
    downloads: 201,
    status: 'Available'
  },
  { 
    id: 7, 
    name: 'Q2 Financial Summary', 
    type: 'finance', 
    date: '2025-05-06', 
    downloads: 0,
    status: 'Processing'
  },
];

// Report type options for filter
const reportTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'users', label: 'Users' },
  { value: 'system', label: 'System' },
  { value: 'security', label: 'Security' },
  { value: 'finance', label: 'Finance' },
];

export default function SuperadminReports() {
  const [reports, setReports] = useState(initialReports);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  // Handle sort
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    
    const sortedReports = [...reports].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    setReports(sortedReports);
  };

  // Filter reports based on search and type
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || report.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Handle download simulation
  const handleDownload = (id) => {
    // In a real application, this would trigger an API call to download the report
    alert(`Downloading report #${id}`);
  };

  return (
    <div className="p-6 ml-20 md:ml-64">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Reports</h1>
        <p className="text-gray-600">Access and download system reports and analytics</p>
      </div>

      {/* Filters and search */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          {reportTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      {/* Reports table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center gap-1 focus:outline-none" 
                    onClick={() => handleSort('name')}
                  >
                    Report Name
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center gap-1 focus:outline-none" 
                    onClick={() => handleSort('type')}
                  >
                    Type
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center gap-1 focus:outline-none" 
                    onClick={() => handleSort('date')}
                  >
                    Date
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center gap-1 focus:outline-none" 
                    onClick={() => handleSort('downloads')}
                  >
                    Downloads
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileBarChart size={18} className="text-purple-500 mr-2" />
                        <div className="text-sm font-medium text-gray-900">{report.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(report.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        report.status === 'Available' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.downloads.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDownload(report.id)}
                        disabled={report.status !== 'Available'}
                        className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white ${
                          report.status === 'Available'
                            ? 'bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Download size={14} className="mr-1" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No reports found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Reports</p>
              <p className="text-2xl font-bold text-gray-800">{reports.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FileBarChart size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Available Reports</p>
              <p className="text-2xl font-bold text-gray-800">
                {reports.filter(r => r.status === 'Available').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Download size={24} className="text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Downloads</p>
              <p className="text-2xl font-bold text-gray-800">
                {reports.reduce((sum, report) => sum + report.downloads, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <ArrowUpDown size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}