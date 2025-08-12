import { useState } from 'react';
import { 
  Building, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  ArrowUpDown, 
  Check, 
  X,
  Users,
  Calendar,
  BarChart
} from 'lucide-react';

// Sample institute data
const initialInstitutes = [
  {
    id: 1,
    name: 'Riverdale Tech University',
    type: 'University',
    location: 'New York, USA',
    admin: 'Dr. Sarah Johnson',
    email: 'admin@riverdale.edu',
    students: 12540,
    staff: 842,
    status: 'Active',
    joined: '2022-03-15'
  },
  {
    id: 2,
    name: 'Cambridge Institute of Technology',
    type: 'College',
    location: 'London, UK',
    admin: 'Prof. James Wilson',
    email: 'jwilson@cambridge-tech.edu',
    students: 8320,
    staff: 615,
    status: 'Active',
    joined: '2022-05-22'
  },
  {
    id: 3,
    name: 'Peking Academy of Sciences',
    type: 'Academy',
    location: 'Beijing, China',
    admin: 'Dr. Li Wei',
    email: 'li.wei@pekingacademy.cn',
    students: 15670,
    staff: 1204,
    status: 'Active',
    joined: '2022-09-10'
  },
  {
    id: 4,
    name: 'Sydney Technical College',
    type: 'College',
    location: 'Sydney, Australia',
    admin: 'Dr. Emily Taylor',
    email: 'etaylor@sydneytech.edu.au',
    students: 5890,
    staff: 410,
    status: 'Active',
    joined: '2023-01-30'
  },
  {
    id: 5,
    name: 'Berlin Digital School',
    type: 'School',
    location: 'Berlin, Germany',
    admin: 'Herr Klaus Schmidt',
    email: 'k.schmidt@berlin-digital.de',
    students: 3240,
    staff: 215,
    status: 'Inactive',
    joined: '2023-04-05'
  },
  {
    id: 6,
    name: 'Osaka Institute of Innovation',
    type: 'Institute',
    location: 'Osaka, Japan',
    admin: 'Takeshi Yamamoto',
    email: 't.yamamoto@osaka-innovation.jp',
    students: 7820,
    staff: 530,
    status: 'Active',
    joined: '2023-07-18'
  },
  {
    id: 7,
    name: 'Toronto Business Academy',
    type: 'Academy',
    location: 'Toronto, Canada',
    admin: 'Prof. Michael Chen',
    email: 'mchen@torontobusiness.ca',
    students: 4950,
    staff: 312,
    status: 'Pending',
    joined: '2025-04-28'
  }
];

// Institute type filter options
const instituteTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'University', label: 'University' },
  { value: 'College', label: 'College' },
  { value: 'Academy', label: 'Academy' },
  { value: 'School', label: 'School' },
  { value: 'Institute', label: 'Institute' }
];

// Status filter options
const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
  { value: 'Pending', label: 'Pending' }
];

export default function SuperadminInstitutes() {
  const [institutes, setInstitutes] = useState(initialInstitutes);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [showModal, setShowModal] = useState(false);
  const [currentInstitute, setCurrentInstitute] = useState(null);

  // Handle sort functionality
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    
    const sortedInstitutes = [...institutes].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    setInstitutes(sortedInstitutes);
  };

  // Filter institutes based on search, type and status
  const filteredInstitutes = institutes.filter(institute => {
    const matchesSearch = institute.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          institute.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          institute.admin.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || institute.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || institute.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Open modal with institute data for editing
  const openEditModal = (institute) => {
    setCurrentInstitute({...institute});
    setShowModal(true);
  };

  // Open modal with empty form for adding new institute
  const openAddModal = () => {
    setCurrentInstitute({
      name: '',
      type: 'University',
      location: '',
      admin: '',
      email: '',
      students: 0,
      staff: 0,
      status: 'Pending',
      joined: new Date().toISOString().slice(0, 10)
    });
    setShowModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentInstitute({
      ...currentInstitute,
      [name]: name === 'students' || name === 'staff' ? parseInt(value) : value
    });
  };

  // Handle form submission (add or update)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (currentInstitute.id) {
      // Update existing institute
      setInstitutes(institutes.map(inst => 
        inst.id === currentInstitute.id ? currentInstitute : inst
      ));
    } else {
      // Add new institute
      const newInstitute = {
        ...currentInstitute,
        id: Math.max(...institutes.map(i => i.id)) + 1
      };
      setInstitutes([...institutes, newInstitute]);
    }
    
    setShowModal(false);
  };

  // Handle delete institute
  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this institute? This action cannot be undone.')) {
      setInstitutes(institutes.filter(institute => institute.id !== id));
    }
  };

  // Handle status toggle
  const handleStatusToggle = (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    setInstitutes(institutes.map(institute => 
      institute.id === id ? {...institute, status: newStatus} : institute
    ));
  };

  return (
    <div className="p-6 ml-20 md:ml-64">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Institutes Management</h1>
        <p className="text-gray-600">Add, edit and manage registered educational institutes</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Institutes</p>
              <p className="text-2xl font-bold text-gray-800">{institutes.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Building size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Institutes</p>
              <p className="text-2xl font-bold text-gray-800">
                {institutes.filter(i => i.status === 'Active').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Check size={24} className="text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Students</p>
              <p className="text-2xl font-bold text-gray-800">
                {institutes.reduce((sum, inst) => sum + inst.students, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Staff</p>
              <p className="text-2xl font-bold text-gray-800">
                {institutes.reduce((sum, inst) => sum + inst.staff, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Users size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and search */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Search institutes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {instituteTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>
        
        <button
          onClick={openAddModal}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          <Plus size={18} />
          Add Institute
        </button>
      </div>

      {/* Institutes table */}
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
                    Institute Name
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
                    onClick={() => handleSort('location')}
                  >
                    Location
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center gap-1 focus:outline-none" 
                    onClick={() => handleSort('students')}
                  >
                    Students
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center gap-1 focus:outline-none" 
                    onClick={() => handleSort('status')}
                  >
                    Status
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInstitutes.length > 0 ? (
                filteredInstitutes.map((institute) => (
                  <tr key={institute.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building size={18} className="text-purple-500 mr-2" />
                        <div className="text-sm font-medium text-gray-900">{institute.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        {institute.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {institute.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{institute.admin}</div>
                      <div className="text-sm text-gray-500">{institute.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {institute.students.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleStatusToggle(institute.id, institute.status)}
                        className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                          institute.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : institute.status === 'Inactive'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {institute.status === 'Active' && <Check size={12} className="mr-1" />}
                        {institute.status === 'Inactive' && <X size={12} className="mr-1" />}
                        {institute.status === 'Pending' && <Calendar size={12} className="mr-1" />}
                        {institute.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => alert(`View details for ${institute.name}`)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openEditModal(institute)}
                          className="text-yellow-600 hover:text-yellow-900 p-1"
                          title="Edit institute"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(institute.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete institute"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    No institutes found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Institute add/edit modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {currentInstitute.id ? 'Edit Institute' : 'Add New Institute'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institute Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={currentInstitute.name}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    name="type"
                    value={currentInstitute.type}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {instituteTypes.filter(t => t.value !== 'all').map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={currentInstitute.location}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Name
                  </label>
                  <input
                    type="text"
                    name="admin"
                    value={currentInstitute.admin}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={currentInstitute.email}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Students Count
                  </label>
                  <input
                    type="number"
                    name="students"
                    value={currentInstitute.students}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Staff Count
                  </label>
                  <input
                    type="number"
                    name="staff"
                    value={currentInstitute.staff}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={currentInstitute.status}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {statusOptions.filter(s => s.value !== 'all').map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Join Date
                  </label>
                  <input
                    type="date"
                    name="joined"
                    value={currentInstitute.joined}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {currentInstitute.id ? 'Update Institute' : 'Add Institute'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}