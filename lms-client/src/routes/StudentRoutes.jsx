// routes/StudentRoutes.jsx
import { Routes, Route, useLocation } from 'react-router-dom';
import StudentLayout from '../components/student/StudentLayout';
import Home from '../pages/student/Home';
import Contact from '../pages/student/Contact';
import Course from '../pages/student/Course';
import Achievement from '../pages/student/Achievement';
import About from '../pages/student/About';
import CourseDetails from '../pages/student/CourseDetails';
import EnrollPage from '../pages/student/EnrollPage';
import Profile from '../pages/student/Profile';
import PaymentPage from '../pages/student/PaymentPage';
import MyLearning from '../components/student/MyLearning';
import Classroom from '../components/student/Classroom';
import TakeExam from '../components/student/TakeExam';
import Exam from '../components/student/Exam';
import Assignments from '../components/student/Assignments';
import StudentStudyMaterials from '../pages/student/StudentStudyMaterials';
import Mypurchase from '../pages/student/Mypurchase';

export function StudentRoutes() {
  const location = useLocation();
  const state = location.state || {};

  return (
   <>
      <Route element={<StudentLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/courses" element={<Course />} />
        <Route path="/achievements" element={<Achievement />} />
        <Route path="/aboutus" element={<About />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/enroll/:id" element={<PaymentPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/learning" element={<MyLearning />} />
        <Route path="/enroll" element={<EnrollPage />} />
        <Route path="/course/:id" element={<Classroom />} />
        <Route path="/exam" element={<Exam />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/studymaterials" element={<StudentStudyMaterials />} />
      </Route>
      <Route path="/exam/:examId/take" element={<TakeExam />} />
      <Route path="/mypurchase" element={<Mypurchase />} />
    </>


  );
}
