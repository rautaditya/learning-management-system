import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, Award, Calendar, User, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import {
  getCertificateTemplates,
  createCertificateTemplate,
  updateCertificateTemplate,
  deleteCertificateTemplate,
  setCourseTemplate,
  getCourseList,
  getIssuedCertificates,generateCertificate
} from '../../api/common';
import axios from 'axios';
export default function CertificateAdminPanel() {
  const [activeTab, setActiveTab] = useState('templates');
  const [certificateTemplates, setCertificateTemplates] = useState([]);
  const [issuedCertificates, setIssuedCertificates] = useState([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    fetchTemplates();
    fetchCourses();
  }, []);

  useEffect(() => {
    if (activeTab === 'certificates') {
      fetchIssued();
    }
  }, [activeTab]);

  const fetchTemplates = async () => {
    try {
      const data = await getCertificateTemplates();
      setCertificateTemplates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching templates:', err);
    }
  };

  const fetchCourses = async () => {
    try {
      const data = await getCourseList();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const fetchIssued = async () => {
    try {
      const data = await getIssuedCertificates();
      setIssuedCertificates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching issued certificates:', err);
    }
  };

  const openCreateModal = () => {
    setEditingTemplate(null);
    setName('');
    setDescription('');
    setFile(null);
    setSelectedCourse('');
    setShowTemplateModal(true);
  };

  const openEditModal = (template) => {
    setEditingTemplate(template);
    setName(template.name || '');
    setDescription(template.description || '');
    setSelectedCourse(template.course?._id || '');
    setFile(null);
    setShowTemplateModal(true);
  };
const handleGenerateCertificate = async (courseId, studentId) => {
  try {
    const data = await generateCertificate(courseId, studentId);
    alert('Certificate generated successfully!');
    console.log(data);
  } catch (error) {
    alert('Failed to generate certificate.');
    console.error(error);
  }
};


  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleCreateOrUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description || '');
      if (file) formData.append('image', file);
      if (selectedCourse) formData.append('course', selectedCourse);

      if (editingTemplate) {
        await updateCertificateTemplate(editingTemplate._id, formData);
        alert('Template updated');
      } else {
        await createCertificateTemplate(formData);
        alert('Template created');
      }
      setShowTemplateModal(false);
      fetchTemplates();
    } catch (err) {
      console.error('Error saving template:', err);
      alert('Failed to save template');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this template?')) return;
    try {
      await deleteCertificateTemplate(id);
      fetchTemplates();
    } catch (err) {
      console.error('Error deleting template:', err);
      alert('Failed to delete');
    }
  };

  const handleLinkCourse = async (courseId, templateId) => {
    try {
      await setCourseTemplate(courseId, templateId);
      alert('Course template set');
      fetchTemplates();
    } catch (err) {
      console.error('Error linking course template:', err);
      alert('Failed to link course template');
    }
  };

  // ✅ Updated function to open in a new tab
  const handleViewCertificate = (certificateId) => {
    window.open(`/api/certificates/${certificateId}/view`, '_blank', 'noopener,noreferrer');
  };

  const downloadCertificatePDF = () => {
    if (!selectedCertificate) return;
    const doc = new jsPDF({ orientation: 'landscape' });
    const imgUrl = selectedCertificate.templateImageUrl || '/api/placeholder/800/600';
    doc.addImage(imgUrl, 'PNG', 0, 0, 297, 210);
    doc.setFontSize(24);
    doc.text(selectedCertificate.student?.name || '', 148, 140, { align: 'center' });
    doc.text(selectedCertificate.course?.title || '', 148, 155, { align: 'center' });
    doc.save(`${selectedCertificate.student?.name || 'certificate'}.pdf`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Certificate Manager</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('templates')}
              className={`${activeTab === 'templates' ? 'border-indigo-500 text-indigo-600' : 'text-gray-500'} py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Certificate Templates
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`${activeTab === 'certificates' ? 'border-indigo-500 text-indigo-600' : 'text-gray-500'} py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Issued Certificates
            </button>
          </nav>

          <div className="mt-6">
            {activeTab === 'templates' ? (
              <>
                {/* Templates Tab */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Certificate Templates</h2>
                  <div className="flex space-x-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        className="pl-10 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Search templates"
                      />
                    </div>
                    <button
                      onClick={openCreateModal}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Plus className="h-5 w-5 mr-2" /> New Template
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {certificateTemplates.map((template) => (
                    <div key={template._id} className="bg-white shadow rounded-lg overflow-hidden">
                      <div className="relative">
                        <img
                          src={template.imageUrl || '/api/placeholder/640/360'}
                          alt={template.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                          <h3 className="text-lg font-medium text-white">{template.name}</h3>
                        </div>
                      </div>
                      <div className="px-4 py-4">
                        <div className="flex justify-between text-sm text-gray-500">
                          <Award className="mr-1.5 h-5 w-5 text-gray-400" />
                          <div className="flex items-center">
                            <Calendar className="mr-1.5 h-5 w-5 text-gray-400" />
                            {new Date(template.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end space-x-3">
                          <button title="View" className="p-2 text-gray-500 hover:text-indigo-600">
                            <Eye className="h-5 w-5" />
                          </button>
                          <button onClick={() => openEditModal(template)} title="Edit" className="p-2 text-gray-500 hover:text-indigo-600">
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button onClick={() => handleDelete(template._id)} title="Delete" className="p-2 text-gray-500 hover:text-red-600">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Issued Certificates Tab */}
               {/* Issued Certificates Tab */}
<h2 className="text-xl font-semibold mb-4">Issued Certificates</h2>

{issuedCertificates.length === 0 ? (
  <p>No certificates issued yet.</p>
) : (
  <div className="overflow-x-auto bg-white shadow rounded-lg">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Student</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Email</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Course</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Issued Date</th>
          <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">Actions</th>
        </tr>
      </thead>
    <tbody className="divide-y divide-gray-200">
  {issuedCertificates.map(cert => (
    <tr key={cert._id}>
      <td className="px-4 py-2">{cert.student?.name || 'Unknown'}</td>
      <td className="px-4 py-2">{cert.student?.email || 'N/A'}</td>
      <td className="px-4 py-2">{cert.course?.title || 'Unknown'}</td>
      <td className="px-4 py-2">
        {cert.issuedDate ? new Date(cert.issuedDate).toLocaleDateString() : 'Not issued'}
      </td>
      <td className="px-4 py-2 flex gap-2 justify-center">
        <button
          onClick={() => handleGenerateCertificate(cert.course?._id, cert.student?._id)}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Generate Certificate
        </button>

        <button
          onClick={() => window.open(`http://localhost:5000/api/certificates/${cert._id}/view`, '_blank')}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          View
        </button>
      </td>
    </tr>
  ))}
</tbody>

    </table>
  </div>
)}

              </>
            )}
          </div>
        </div>
      </main>

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed z-10 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
            <h3 className="text-lg font-medium mb-4">{editingTemplate ? 'Edit Template' : 'Create New Template'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Template Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium">Upload Image</label>
                <input type="file" onChange={handleFileChange} accept="image/*" />
              </div>
              <div>
                <label className="block mb-2">Link to Course (optional)</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                >
                  <option value="">-- Select a Course --</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>{course.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={handleCreateOrUpdate} className="px-4 py-2 bg-indigo-600 text-white rounded-md">
                {editingTemplate ? 'Update Template' : 'Create Template'}
              </button>
              <button onClick={() => setShowTemplateModal(false)} className="px-4 py-2 border rounded-md">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
