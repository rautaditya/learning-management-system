import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../../components/superadmin/Sidebar';
import Header from '../../components/superadmin/Header';
import AddAdmin from './AddAdmin.jsx'; 
import Sdashboard from './Sdashboard';
import ManageAdmins from './ManageAdmins';

import ManageAllCourses from './ManageAllCourses.jsx';
import AddAssignment from './AddAssignment.jsx';
import ManageAssignment from './ManageAssignment.jsx';
import ManageStudents  from '../../components/commonpages/ManageStudents.jsx';
import AddVideo from './AddVideo';
import ManageVideo from './ManageVideo';
import InstituteList from './InstituteList';
import Sreports from './Sreports';
import Ssettings from './Ssettings';
import ContactData from '../../components/commonpages/ContactData.jsx';
import AddCourse from '../../components/commonpages/AddCourse';
import CourseDetails from './CourseDetails';
import SuperadminProfile from './SuperadminProfile.jsx';
import EnrollmentLogs from '../../components/commonpages/EnrollmentLogs';

import AddStudyMaterial from '../../components/commonpages/AddStudyMaterial';
import ManageStudyMaterial from '../../components/commonpages/ManageStudyMaterial';
import AddCourseCategory from '../../components/commonpages/AddCourseCategory';
const SuperAdminPanel = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={`transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'} flex-1`}>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />

        <main className="p-6 pt-24">
          <Routes>
            <Route path="dashboard" element={<Sdashboard />} />
            <Route path="addadmin" element={<AddAdmin />} />
            <Route path="admins" element={<ManageAdmins />} />
            <Route path="courses/add" element={<AddCourse/>} />
            <Route path="courses/manage" element={<ManageAllCourses />} />
            <Route path="courses/:id" element={<CourseDetails />} />
            {/* <Route path="ManageCourses" element={<ManageCourses />} /> */}
            <Route path="addassignment" element={<AddAssignment />} />
            <Route path="assignment" element={<ManageAssignment />} />
            <Route path="users" element={<ManageStudents />} />
            <Route path="enrollments" element={<EnrollmentLogs />} />
            <Route path="AddVideo" element={<AddVideo />} />
            <Route path="ManageVideo" element={<ManageVideo />} />
            <Route path="course-category" element={<AddCourseCategory />} />
            <Route path="institutes" element={<InstituteList />} />
            <Route path="contactdata" element={<ContactData />} />
            <Route path="reports" element={<Sreports />} />
            <Route path="settings" element={<Ssettings />} />
            <Route path="profile" element={<SuperadminProfile />} />

            <Route path='studymaterial/add' element={<AddStudyMaterial />} />
            <Route path='studymaterial/manage' element={<ManageStudyMaterial />} />

          </Routes>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminPanel;
