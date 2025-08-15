
import React, { useState, useEffect } from 'react';
import { getContactData } from '../../api/common';
import { ChevronDown, ChevronUp, Mail, User, MessageSquare, Briefcase, Calendar } from 'lucide-react';

const ContactData = () => {
  const [contactData, setContactData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        setLoading(true);
        const data = await getContactData();
        setContactData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching contact data:', error);
        setError('Failed to load contact submissions. Please try again later.');
        setLoading(false);
      }
    };
    fetchContactData();
  }, []);

  const toggleExpand = (index) => {
    if (expandedItem === index) {
      setExpandedItem(null);
    } else {
      setExpandedItem(index);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleSortOrderToggle = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDepartmentColor = (department) => {
    const colors = {
      'sales': 'bg-blue-100 text-blue-800',
      'support': 'bg-green-100 text-green-800',
      'technical': 'bg-purple-100 text-purple-800',
      'billing': 'bg-yellow-100 text-yellow-800',
      'general': 'bg-gray-100 text-gray-800'
    };
    
    return colors[department?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  // Filter data
  const filteredData = contactData.filter(item => {
    if (filter === 'all') return true;
    return item.department?.toLowerCase() === filter;
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.submittedAt || 0);
      const dateB = new Date(b.submittedAt || 0);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortBy === 'name') {
      const nameA = a.name || '';
      const nameB = b.name || '';
      return sortOrder === 'asc' 
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    }
    return 0;
  });

  // Extract unique departments for filter dropdown
  const departments = [...new Set(contactData.map(item => 
    item.department?.toLowerCase() || 'unknown'
  ))];

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0 animate-fade-in">
          Contact Submissions
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Filter */}
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 transition duration-300 ease-in-out hover:bg-gray-200">
            <label htmlFor="filter" className="text-gray-600 mr-2 whitespace-nowrap">Filter by:</label>
            <select 
              id="filter" 
              value={filter}
              onChange={handleFilterChange}
              className="bg-transparent border-none focus:outline-none text-gray-800"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept.charAt(0).toUpperCase() + dept.slice(1)}</option>
              ))}
            </select>
          </div>
          
          {/* Sort */}
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 transition duration-300 ease-in-out hover:bg-gray-200">
            <label htmlFor="sort" className="text-gray-600 mr-2 whitespace-nowrap">Sort by:</label>
            <select 
              id="sort" 
              value={sortBy}
              onChange={handleSortChange}
              className="bg-transparent border-none focus:outline-none text-gray-800"
            >
              <option value="date">Date</option>
              <option value="name">Name</option>
            </select>
            <button 
              onClick={handleSortOrderToggle} 
              className="ml-2 focus:outline-none text-gray-600 hover:text-gray-800 transition duration-200"
            >
              {sortOrder === 'asc' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Status messages */}
      {loading && (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <p className="ml-3 text-gray-600">Loading submissions...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded animate-fade-in">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && sortedData.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center animate-fade-in">
          <div className="flex justify-center mb-4">
            <MessageSquare size={48} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No submissions found</h3>
          <p className="text-gray-500">There are no contact form submissions that match your criteria.</p>
        </div>
      )}

      {!loading && !error && sortedData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-0 animate-fade-in">
          {sortedData.map((item, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all duration-300 ease-in-out hover:shadow-md transform hover:-translate-y-1"
            >
              {/* Header */}
              <div 
                className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-200"
                onClick={() => toggleExpand(index)}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User size={20} className="text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{item.name || 'Anonymous'}</h3>
                    <p className="text-sm text-gray-500">{item.email || 'No email provided'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium mr-2 ${getDepartmentColor(item.department)}`}>
                    {item.department || 'General'}
                  </span>
                  <button className="text-gray-500 focus:outline-none hover:text-gray-700 transition duration-200">
                    {expandedItem === index ? 
                      <ChevronUp size={20} className="transition-transform duration-300 ease-in-out" /> : 
                      <ChevronDown size={20} className="transition-transform duration-300 ease-in-out" />
                    }
                  </button>
                </div>
              </div>
              
              {/* Content */}
              {expandedItem === index && (
                <div className="p-4 border-t border-gray-200 animate-fade-in-down">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Subject</h4>
                    <p className="text-gray-800 font-medium">{item.subject || 'No subject'}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Message</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{item.message || 'No message content'}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar size={16} className="mr-1" />
                      <span>Submitted: {formatDate(item.submittedAt)}</span>
                    </div>
                    
                    <div className="flex">
                      <button className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm py-1 px-3 rounded-md flex items-center mr-2 transition duration-200">
                        <Mail size={14} className="mr-1" />
                        Reply
                      </button>
                      <button className="bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm py-1 px-3 rounded-md flex items-center transition duration-200">
                        <Briefcase size={14} className="mr-1" />
                        Archive
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add animation classes to Tailwind config */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInDown {
          from { 
            opacity: 0;
            transform: translateY(-10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-fade-in-down {
          animation: fadeInDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ContactData;