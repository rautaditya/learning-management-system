import { useState } from 'react';
import { signupStudent, sendOtp } from '../../api/student';
import OtpVerification from './OtpVerification';

const StudentSignup = ({ defaultEmail }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(defaultEmail || '');
  const [showOtp, setShowOtp] = useState(false);

  const handleSignup = async () => {
    try {
      const joiningDate = new Date().toISOString(); // ISO 8601 format

      await signupStudent({ fullName: name, email, joiningDate });
      await sendOtp(email);
      setShowOtp(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (showOtp) return <OtpVerification email={email} />;

  return (
    <div>
      <h2>Student Signup</h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full Name"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
};

export default StudentSignup;
