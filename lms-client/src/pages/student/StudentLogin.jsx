// 2. Main Student Authentication Component (StudentLogin.jsx)
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
        >
          ×
        </button>

        {/* Email Input Step */}
        {step === 'email' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Student Login
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                onKeyPress={(e) => e.key === 'Enter' && handleEmailCheck()}
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">
                {error}
              </p>
            )}
            <button
              onClick={handleEmailCheck}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Checking...' : 'Continue'}
            </button>
          </div>
        )}

        {/* Signup Step */}
        {step === 'signup' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Create Account
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">
                {error}
              </p>
            )}
            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
            <button
              onClick={() => setStep('email')}
              className="w-full mt-2 text-blue-600 hover:text-blue-700 py-2 text-sm"
            >
              ← Back to email
            </button>
          </div>
        )}

        {/* OTP Verification Step */}
        {step === 'otp' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              Verify OTP
            </h2>
            <p className="text-gray-600 text-center mb-6">
              We've sent a 6-digit code to<br />
              <strong>{email}</strong>
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                placeholder="000000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-xl font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                onKeyPress={(e) => e.key === 'Enter' && handleOtpVerify()}
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">
                {error}
              </p>
            )}
            <button
              onClick={handleOtpVerify}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <div className="flex justify-between items-center text-sm">
              <button
                onClick={() => setStep('email')}
                className="text-blue-600 hover:text-blue-700"
              >
                ← Change email
              </button>
              <button
                onClick={handleResendOtp}
                disabled={loading}
                className="text-blue-600 hover:text-blue-700 disabled:opacity-50"
              >
                Resend OTP
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentLogin