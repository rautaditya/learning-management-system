import { Route } from 'react-router-dom';
import AdminPanel from '../pages/admin/AdminPanel';
import Dashboard from '../pages/admin/Dashboard';
import Student from '../pages/admin/Student';
import AddAssignment from '../pages/admin/AddAssignment';
import ManageAssignment from '../pages/admin/ManageAssignment';
import VideoContent from '../components/commonpages/VideoContent';
import ManageVideo from '../components/commonpages/ManageVideo';
import Discussion from '../pages/admin/Discussion';
import StudentProgress from '../pages/admin/Student Progress';
import Certificates from '../pages/admin/Certificates';
import Instructors from '../pages/admin/Instructors';
import Reports from '../pages/admin/Reports';
import Settings from '../pages/admin/Settings';
import AddCourse from '../components/commonpages/AddCourse';
import ManageCourse from '../components/commonpages/ManageCourse';
import ContactData from '../components/commonpages/ContactData';
import Logout from '../components/commonpages/Logout';
import PrivateRoute from '../components/PrivateRoute';
import CreateExam from '../pages/admin/CreateExam';
import ManageExam from '../pages/admin/ManageExam';
import CourseDetails from '../pages/admin/CourseDetail';
import ManageStudents from '../components/commonpages/ManageStudents';
import AdminProfile from '../pages/admin/AdminProfile';
import EnrolledCourses from '../pages/admin/EnrolledCourses';
import EnrollmentLogs from '../components/commonpages/EnrollmentLogs';
import AddStudyMaterial from '../components/commonpages/AddStudyMaterial';
import ManageStudyMaterial from '../components/commonpages/ManageStudyMaterial';
import QuestionPaper from '../pages/admin/QuestionPaper';
import AddCourseCategory from '../components/commonpages/AddCourseCategory';


export  function AdminRoutes() {
  return (
    <Route element={<PrivateRoute allowedRoles={['admin']} />}>
      <Route path="/admin" element={<AdminPanel />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="studentdata" element={<Student />} />
        <Route path="addassignment" element={<AddAssignment />} />
        <Route path="manageassignment" element={<ManageAssignment />} />
        <Route path="videosection" element={<VideoContent />} />
        <Route path="createexam" element={<CreateExam />} />
        <Route path="manageexam" element={<ManageExam />} />
        <Route path="managevideo" element={<ManageVideo />} />
        <Route path="discussion" element={<Discussion />} />
        <Route path="studentprogress" element={<StudentProgress />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="instructors" element={<Instructors />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="courses/add" element={<AddCourse />} />
        <Route path="courses/manage" element={<ManageCourse />} />
        <Route path="contactdata" element={<ContactData />} />
        <Route path="logout" element={<Logout />} />
        <Route path="courses/:id" element={<CourseDetails />} />
        <Route path="users" element={<ManageStudents />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="enrolledcourses" element={<EnrolledCourses />} />
        <Route path="enrollments" element={<EnrollmentLogs />} />
        <Route path="studymaterial/add" element={<AddStudyMaterial />} />
        <Route path="studymaterial/manage" element={<ManageStudyMaterial />} />
        <Route path="questionpaper/:id" element={<QuestionPaper />} />
        <Route path="course-category" element={<AddCourseCategory />} />


      </Route>
    </Route>
  );
}
