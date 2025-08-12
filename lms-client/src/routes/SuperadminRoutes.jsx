import { Route } from 'react-router-dom';
import SuperAdminPanel from '../pages/superadmin/SuperadminPanel';
import Sdashboard from '../pages/superadmin/Sdashboard';
import AddAdmin from '../pages/superadmin/AddAdmin';
import ManageAdmins from '../pages/superadmin/ManageAdmins';
import InstituteList from '../pages/superadmin/InstituteList';
import Sreports from '../pages/superadmin/Sreports';
import Ssettings from '../pages/superadmin/Ssettings';
import ManageAllCourses from '../pages/superadmin/ManageAllCourses';
import CourseDetails from '../pages/superadmin/CourseDetails';
import AddCourse from '../components/commonpages/AddCourse';
import ContactData from '../components/commonpages/ContactData';
import Logout from '../components/commonpages/Logout';
import PrivateRoute from '../components/PrivateRoute';
import AddVideo from '../pages/superadmin/AddVideo';
import ManageVideo from '../pages/superadmin/ManageVideo';
import SuperadminProfile from '../pages/superadmin/SuperadminProfile';
import AddStudyMaterial from '../components/commonpages/AddStudyMaterial';
import ManageStudyMaterial from '../components/commonpages/ManageStudyMaterial';
import AddCourseCategory from '../components/commonpages/AddCourseCategory';
export function SuperadminRoutes() {
  return (
    <Route element={<PrivateRoute allowedRoles={['superadmin']} />}>
      <Route path="/superadmin/*" element={<SuperAdminPanel />}>
        <Route path="dashboard" element={<Sdashboard />} />
        <Route path="addadmin" element={<AddAdmin />} />
        <Route path="admins" element={<ManageAdmins />} />
        <Route path="courses/add" element={<AddCourse />} />
        <Route path="courses/manage" element={<ManageAllCourses />} />
        <Route path="addvideo" element={<AddVideo />} />
        <Route path="managevideo" element={<ManageVideo />} />
        <Route path="institutes" element={<InstituteList />} />
        <Route path="reports" element={<Sreports />} />
        <Route path="contactdata" element={<ContactData />} />
        <Route path="settings" element={<Ssettings />} />
        <Route path="logout" element={<Logout />} />
        <Route path="profile" element={<SuperadminProfile />} />
         <Route path="course-category" element={<AddCourseCategory />} />
        <Route path="studymaterial/add" element={<AddStudyMaterial />} />
        <Route path="studymaterial/manage" element={<ManageStudyMaterial />} />
      </Route>

      {/* this one is fine as it's outside nested layout */}
      <Route path="/superadmin/courses/:id" element={<CourseDetails />} />
    </Route>
  );
}
