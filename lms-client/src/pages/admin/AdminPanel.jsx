
import React, { useState } from 'react';
import { Outlet, Routes, Route } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';

import Dashboard from './Dashboard';
import Student from './Student';
import Videocontent from '../../components/commonpages/VideoContent';
import ManageVideo from '../../components/commonpages/ManageVideo';

import CreateExam from './CreateExam';
import ManageExam from './ManageExam';
// import ManageStudents  from '../../components/commonpages/ManageStudents.jsx';
import ManageStudents  from '../../components/commonpages/ManageStudents';
import EnrollmentLogs from '../../components/commonpages/EnrollmentLogs';

import Discussion from './Discussion';
import StudentProgress from './Student Progress';
import Certificates from './Certificates';  
import Instructors from '../../components/commonpages/Instructors';
import Reports from './Reports';
import Settings from './Settings';
import AddCourse from '../../components/commonpages/AddCourse';
import ManageCourse from '../../components/commonpages/ManageCourse';
import ContactData from '../../components/commonpages/ContactData';

import AddAsssignment from './AddAssignment';
import ManageAssignment from './ManageAssignment';
import Coursedetails from './CourseDetail';
import AdminProfile from './AdminProfile';
import EnrolledCourses from './EnrolledCourses';
import AddStudyMaterial from '../../components/commonpages/AddStudyMaterial';
import ManageStudyMaterial from '../../components/commonpages/ManageStudyMaterial';
import QuestionPaper from './QuestionPaper';
import AddCourseCategory from '../../components/commonpages/AddCourseCategory';
//lms

const AdminPanel = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={`transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'} flex-1`}>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />

        <main className="p-6 pt-24">
          {/* Nested Routes */}
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="studentdata" element={<Student />} />
            <Route path="addassignment" element={<AddAsssignment />} />
            <Route path="manageassignment" element={<ManageAssignment />} />
            <Route path="course-category" element={<AddCourseCategory />} />
            
            <Route path="videosection" element={<Videocontent />} />
            <Route path="managevideo" element={<ManageVideo />} />

            <Route path="createexam" element={<CreateExam />} />
            <Route path="manageexam" element={<ManageExam />} />

            {/* <Route path="users" element={<ManageStudents  />} /> */}
            <Route path="users" element={<ManageStudents />} />
            <Route path="enrollments" element={<EnrollmentLogs />} />


            <Route path="discussion" element={<Discussion />} />
           <Route path="studentprogress" element={<StudentProgress />} />
           <Route path="certificates" element={<Certificates />} />
            <Route path="instructors" element={<Instructors />} />
    <Route path="reports" element={<Reports />} />
   <Route path="settings" element={<Settings />} />
    <Route path="/courses/add" element={<AddCourse/>} />
           <Route path="/courses/manage" element={<ManageCourse/>} />
           <Route path="/contactdata" element={<ContactData />} />
           <Route path="/courses/:id" element={<Coursedetails />} />
           <Route path="/profile" element={<AdminProfile />} />
           <Route path="/enrolledcourses" element={<EnrolledCourses />} />
            <Route path="/studymaterial/add" element={<AddStudyMaterial />} />
            <Route path="/studymaterial/manage" element={<ManageStudyMaterial />} />
             <Route path="/questionpaper/:id" element={<QuestionPaper />} />
            {/* <Route path="/logout" element={<Logout />} /> */}
          
            {/* Add more nested routes here */}
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
