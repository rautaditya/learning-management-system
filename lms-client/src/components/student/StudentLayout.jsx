// import { Outlet } from 'react-router-dom';
// import Navbar from './Navbar';
// import Footer from './Footer';  // Import your Footer component
// import StudentLogin from '../../pages/student/StudentLogin';
// import { useState } from 'react';

// const StudentLayout = () => {
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [navbarUpdateCallback, setNavbarUpdateCallback] = useState(null);

//   const handleLoginClick = (updateCallback) => {
//     setNavbarUpdateCallback(() => updateCallback);
//     setShowLoginModal(true);
//   };

//   const handleLoginSuccess = () => {
//     if (navbarUpdateCallback) {
//       navbarUpdateCallback();
//     }
//   };
//   return (
//     <>
//       <Navbar onLoginClick={handleLoginClick} />
      
//       {showLoginModal && (
//         <StudentLogin
//           onClose={() => setShowLoginModal(false)}
//           onSuccess={handleLoginSuccess}
//         />
//       )}
//       <Outlet />
//       <Footer />  {/* Add Footer component here */}
//     </>
//   );
// };

// export default StudentLayout;
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import StudentLogin from '../../pages/student/StudentLogin';
import Chatbot from '../../components/student/Chatbot'; // Import Chatbot
import { useState } from 'react';

const StudentLayout = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [navbarUpdateCallback, setNavbarUpdateCallback] = useState(null);

  const handleLoginClick = (updateCallback) => {
    setNavbarUpdateCallback(() => updateCallback);
    setShowLoginModal(true);
  };

  const handleLoginSuccess = () => {
    if (navbarUpdateCallback) {
      navbarUpdateCallback();
    }
  };

  return (
    <>
      <Navbar onLoginClick={handleLoginClick} />
      
      {showLoginModal && (
        <StudentLogin
          onClose={() => setShowLoginModal(false)}
          onSuccess={handleLoginSuccess}
        />
      )}

      <Outlet />
      <Footer />

      {/* Floating Chatbot */}
      <Chatbot />
    </>
  );
};

export default StudentLayout;
