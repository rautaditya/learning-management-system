import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import loadScript from '../../utils/loadScript';

const PaymentPage = () => {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/student/courses/${courseId}`);
        setCourse(data);
      } catch (err) {
        alert('Course not found');
        navigate('/');
      }
    };
    fetchCourse();
  }, [courseId, navigate]);

  const handlePayment = async () => {
    const razorpayLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!razorpayLoaded) {
      alert('Failed to load Razorpay SDK');
      return;
    }

    const token = localStorage.getItem('student_token');
    const { data } = await axios.post(
      'http://localhost:5000/api/payments/create-order',
      { amount: course.price, courseId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const options = {
      key: data.key,
      amount: data.amount,
      currency: 'INR',
      name: course.title,
      description: 'Course Enrollment',
      order_id: data.orderId,
      handler: async function (response) {
        try {
          await axios.post(
            'http://localhost:5000/api/payments/verify',
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: data.amount,
              courseId
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          alert('Enrollment successful!');
          navigate('/student/dashboard');
        } catch (err) {
          alert('Payment verified but enrollment failed.');
        }
      },
      theme: { color: '#6366f1' }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (!course) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-4">{course.title}</h2>
      <p className="mb-2 text-gray-700">{course.description}</p>
      <p className="font-semibold mb-4">Price: ₹{course.price}</p>
      <button
        onClick={handlePayment}
        className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
      >
        Pay & Enroll
      </button>
    </div>
  );
};

export default PaymentPage;
