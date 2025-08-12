import { useState } from 'react';
import { verifyOtp } from '../../api/student';
const OtpVerification = ({ email }) => {
  const [otp, setOtp] = useState('');

const handleVerify = async () => {
  try {
    const res = await verifyOtp(email, otp);

    // Check if token exists to confirm success
    if (res.data.token) {
      alert('Login successful!');
      // TODO: save token to localStorage/sessionStorage if needed
      // TODO: redirect to student dashboard
    } else {
      alert('Invalid OTP');
    }
  } catch (err) {
    // err.response.data contains the backend error message
    if (err.response && err.response.data && err.response.data.msg) {
      alert(err.response.data.msg);
    } else {
      alert('Verification failed due to server error.');
    }
    console.error(err);
  }
};


  return (
    <div>
      <h2>Enter OTP sent to {email}</h2>
      <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
      <button onClick={handleVerify}>Verify</button>
    </div>
  );
};

export default OtpVerification;
