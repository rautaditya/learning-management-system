// // 2. Main Student Authentication Component (StudentLogin.jsx)
// import { useState } from 'react';
// import { checkStudentEmail, sendOtp, verifyOtp, signupStudent } from '../../api/student';

// const StudentLogin = ({ onClose, onSuccess }) => {
//   const [step, setStep] = useState('email'); // email, signup, otp
//   const [email, setEmail] = useState('');
//   const [name, setName] = useState('');
//   const [otp, setOtp] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [isNewUser, setIsNewUser] = useState(false);

//   const handleEmailCheck = async () => {
//     if (!email || !/\S+@\S+\.\S+/.test(email)) {
//       setError('Please enter a valid email address');
//       return;
//     }

//     setLoading(true);
//     setError('');
    
//     try {
//       const res = await checkStudentEmail(email);
      
//       if (res.data.exists) {
//         // Existing user - send OTP for login
//         await sendOtp(email);
//         setIsNewUser(false);
//         setStep('otp');
//       } else {
//         // New user - show signup form
//         setIsNewUser(true);
//         setStep('signup');
//       }
//     } catch (err) {
//       setError(err.response?.data?.msg || 'Something went wrong. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSignup = async () => {
//     if (!name.trim()) {
//       setError('Please enter your full name');
//       return;
//     }

//     setLoading(true);
//     setError('');
    
//     try {
//       await signupStudent({ fullName: name, email });
//       setStep('otp');
//     } catch (err) {
//       setError(err.response?.data?.msg || 'Signup failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//  const handleOtpVerify = async () => {
//   if (!otp || otp.length !== 6) {
//     setError('Please enter a valid 6-digit OTP');
//     return;
//   }

//   setLoading(true);
//   setError('');

//   try {
//     const res = await verifyOtp(email, otp);

//     if (res.data.token) {
//       // ✅ Clear any existing admin session before setting student login
//       localStorage.removeItem('admin_token');
//       localStorage.removeItem('admin_role');
//       localStorage.removeItem('admin_user');

//       // ✅ Set student session
//       localStorage.setItem('student_token', res.data.token);
//       localStorage.setItem('student_role', 'student');
//       localStorage.setItem('student_user', JSON.stringify(res.data.user));

//       if (onSuccess) onSuccess();
//       onClose();
//       window.location.href = '/';
//     } else {
//       setError('Invalid OTP. Please try again.');
//     }
//   } catch (err) {
//     setError(err.response?.data?.msg || 'Verification failed. Please try again.');
//   } finally {
//     setLoading(false);
//   }
// };


//   const handleResendOtp = async () => {
//     setLoading(true);
//     setError('');
    
//     try {
//       await sendOtp(email);
//       setError(''); // Clear any previous errors
//       // You might want to show a success message here
//     } catch (err) {
//       setError('Failed to resend OTP. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md relative">
//         <button 
//           onClick={onClose} 
//           className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
//         >
//           ×
//         </button>

//         {/* Email Input Step */}
//         {step === 'email' && (
//           <div>
//             <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
//               Student Login
//             </h2>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Enter your email"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                 onKeyPress={(e) => e.key === 'Enter' && handleEmailCheck()}
//               />
//             </div>
//             {error && (
//               <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">
//                 {error}
//               </p>
//             )}
//             <button
//               onClick={handleEmailCheck}
//               disabled={loading}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? 'Checking...' : 'Continue'}
//             </button>
//           </div>
//         )}

//         {/* Signup Step */}
//         {step === 'signup' && (
//           <div>
//             <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
//               Create Account
//             </h2>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Full Name
//               </label>
//               <input
//                 type="text"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 placeholder="Enter your full name"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 value={email}
//                 readOnly
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
//               />
//             </div>
//             {error && (
//               <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">
//                 {error}
//               </p>
//             )}
//             <button
//               onClick={handleSignup}
//               disabled={loading}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? 'Creating Account...' : 'Create Account'}
//             </button>
//             <button
//               onClick={() => setStep('email')}
//               className="w-full mt-2 text-blue-600 hover:text-blue-700 py-2 text-sm"
//             >
//               ← Back to email
//             </button>
//           </div>
//         )}

//         {/* OTP Verification Step */}
//         {step === 'otp' && (
//           <div>
//             <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
//               Verify OTP
//             </h2>
//             <p className="text-gray-600 text-center mb-6">
//               We've sent a 6-digit code to<br />
//               <strong>{email}</strong>
//             </p>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Enter OTP
//               </label>
//               <input
//                 type="text"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
//                 maxLength={6}
//                 placeholder="000000"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-xl font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                 onKeyPress={(e) => e.key === 'Enter' && handleOtpVerify()}
//               />
//             </div>
//             {error && (
//               <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">
//                 {error}
//               </p>
//             )}
//             <button
//               onClick={handleOtpVerify}
//               disabled={loading}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3"
//             >
//               {loading ? 'Verifying...' : 'Verify OTP'}
//             </button>
//             <div className="flex justify-between items-center text-sm">
//               <button
//                 onClick={() => setStep('email')}
//                 className="text-blue-600 hover:text-blue-700"
//               >
//                 ← Change email
//               </button>
//               <button
//                 onClick={handleResendOtp}
//                 disabled={loading}
//                 className="text-blue-600 hover:text-blue-700 disabled:opacity-50"
//               >
//                 Resend OTP
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudentLogin

import { useState } from 'react';
import { checkStudentEmail, sendOtp, verifyOtp, signupStudent } from '../../api/student';

const StudentLogin = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState('email'); // email, signup, otp
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);

  const handleEmailCheck = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const res = await checkStudentEmail(email);
      
      if (res.data.exists) {
        // Existing user - send OTP for login
        await sendOtp(email);
        setIsNewUser(false);
        setStep('otp');
      } else {
        // New user - show signup form
        setIsNewUser(true);
        setStep('signup');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await signupStudent({ fullName: name, email });
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.msg || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await verifyOtp(email, otp);

      if (res.data.token) {
        // ✅ Clear any existing admin session before setting student login
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_role');
        localStorage.removeItem('admin_user');

        // ✅ Set student session
        localStorage.setItem('student_token', res.data.token);
        localStorage.setItem('student_role', 'student');
        localStorage.setItem('student_user', JSON.stringify(res.data.user));

        if (onSuccess) onSuccess();
        onClose();
        window.location.href = '/';
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError('');
    
    try {
      await sendOtp(email);
      setError(''); // Clear any previous errors
      // You might want to show a success message here
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900/50 via-purple-900/50 to-indigo-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md relative border border-white/20 transform transition-all duration-300 hover:shadow-3xl">
        {/* Decorative gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl opacity-50"></div>
        
        {/* Close button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-3xl font-light z-10 transition-all duration-200 hover:rotate-90 hover:scale-110"
        >
          ×
        </button>

        {/* Email Input Step */}
        {step === 'email' && (
          <div className="relative z-10 animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome Back
              </h2>
              <p className="text-gray-600 mt-2">Enter your email to continue your learning journey</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Email Address
              </label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-gray-300"
                  onKeyPress={(e) => e.key === 'Enter' && handleEmailCheck()}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-shake">
                <p className="text-red-700 text-sm font-medium flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              </div>
            )}
            
            <button
              onClick={handleEmailCheck}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-xl active:scale-95 relative overflow-hidden"
            >
              <span className="relative z-10">
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Checking...
                  </div>
                ) : 'Continue'}
              </span>
            </button>
          </div>
        )}

        {/* Signup Step */}
        {step === 'signup' && (
          <div className="relative z-10 animate-slide-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Join Our Community
              </h2>
              <p className="text-gray-600 mt-2">Create your account to get started</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Full Name
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-gray-300"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl bg-gray-100/80 text-gray-600 cursor-not-allowed"
                />
              </div>
            </div>
            
            {error && (
              <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-shake">
                <p className="text-red-700 text-sm font-medium flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              </div>
            )}
            
            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full mt-8 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-xl active:scale-95"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </div>
              ) : 'Create Account'}
            </button>
            
            <button
              onClick={() => setStep('email')}
              className="w-full mt-3 text-blue-600 hover:text-blue-700 py-3 text-sm font-medium transition-colors hover:bg-blue-50 rounded-lg"
            >
              ← Back to email
            </button>
          </div>
        )}

        {/* OTP Verification Step */}
        {step === 'otp' && (
          <div className="relative z-10 animate-slide-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Verify Your Email
              </h2>
              <p className="text-gray-600 mt-2">We've sent a secure code to</p>
              <p className="font-semibold text-gray-800 bg-gray-100 px-4 py-2 rounded-lg mt-2 break-all">
                {email}
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Enter 6-Digit Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  placeholder="000000"
                  className="w-full px-6 py-6 border-2 border-gray-200 rounded-xl text-center text-2xl font-mono tracking-widest focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm hover:border-gray-300"
                  onKeyPress={(e) => e.key === 'Enter' && handleOtpVerify()}
                />
              </div>
              <div className="flex justify-center mt-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={`w-3 h-3 rounded-full mx-1 transition-all duration-200 ${i < otp.length ? 'bg-purple-500 scale-110' : 'bg-gray-200'}`}></div>
                ))}
              </div>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-shake">
                <p className="text-red-700 text-sm font-medium flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              </div>
            )}
            
            <button
              onClick={handleOtpVerify}
              disabled={loading || otp.length !== 6}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-xl active:scale-95 mb-4"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </div>
              ) : 'Verify & Continue'}
            </button>
            
            <div className="flex justify-between items-center">
              <button
                onClick={() => setStep('email')}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-blue-50"
              >
                ← Change email
              </button>
              <button
                onClick={handleResendOtp}
                disabled={loading}
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors disabled:opacity-50 px-4 py-2 rounded-lg hover:bg-purple-50"
              >
                Resend Code
              </button>
            </div>
          </div>
        )}

        {/* Add custom animations */}
        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slide-in {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          .animate-fade-in { animation: fade-in 0.3s ease-out; }
          .animate-slide-in { animation: slide-in 0.3s ease-out; }
          .animate-shake { animation: shake 0.3s ease-in-out; }
        `}</style>
      </div>
    </div>
  );
};

export default StudentLogin;