import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import loadScript from '../../utils/loadScript';

const PaymentPage = () => {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
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
    setIsProcessing(true);
    
    try {
      const razorpayLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!razorpayLoaded) {
        alert('Failed to load Razorpay SDK');
        setIsProcessing(false);
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
          } finally {
            setIsProcessing(false);
          }
        },
        theme: { color: '#6366f1' },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessing(false);
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center space-y-6">
          <div className="relative flex justify-center">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="w-14 h-14 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin absolute top-3"></div>
            <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin absolute top-6"></div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl text-gray-700 font-bold">Loading Course Details</p>
            <p className="text-gray-500">Preparing your enrollment...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 text-white py-16 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-24 h-24 bg-yellow-300/10 rounded-full animate-bounce delay-100"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-pink-300/10 rounded-full animate-ping delay-200"></div>
          <div className="absolute top-40 left-1/3 w-12 h-12 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rotate-45 animate-spin"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-2 border border-white/20 mb-4">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Secure Payment</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
              Complete Your
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                Enrollment
              </span>
            </h1>
            
            <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed font-light">
              You're just one step away from accessing premium course content
            </p>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-12 text-slate-50">
            <path fill="currentColor" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      {/* Enhanced Payment Card */}
      <div className="max-w-2xl mx-auto px-6 py-16 -mt-6 relative z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 transform hover:scale-105 transition-all duration-500">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 p-8 border-b border-gray-100">
            <div className="flex flex-col items-center space-y-6">
              {/* Enhanced Course Image */}
              <div className="flex justify-center">
                {course.courseImage ? (
                  <div className="relative group">
                    <img
                      src={`http://localhost:5000/${course.courseImage.replace(/\\/g, '/')}`}
                      alt="course"
                      className="h-40 w-40 rounded-3xl object-cover shadow-2xl border-4 border-white/50 group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    {/* Course Type Badge */}
                    <div className="absolute -top-2 -right-2">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        Premium
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-40 w-40 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-3xl flex items-center justify-center border-4 border-white/50 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-20 h-20 text-blue-600/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                  </div>
                )}
              </div>

              <div className="text-center space-y-3">
                <h2 className="text-3xl font-bold text-gray-800 leading-tight">
                  {course.title}
                </h2>
                <div className="inline-flex items-center space-x-2 bg-blue-50 rounded-full px-4 py-2">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-700 font-semibold text-sm">Course Enrollment</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-8 space-y-8">
            {/* Course Description */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Course Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {course.description}
              </p>
            </div>

            {/* Course Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 text-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="font-semibold text-gray-700">Lifetime Access</p>
                <p className="text-sm text-gray-500">Learn at your pace</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="font-semibold text-gray-700">Certificate</p>
                <p className="text-sm text-gray-500">Upon completion</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 text-center">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
                <p className="font-semibold text-gray-700">Expert Support</p>
                <p className="text-sm text-gray-500">24/7 assistance</p>
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white text-center">
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-2xl font-bold">Course Investment</h3>
                </div>
                
                <div className="flex items-center justify-center space-x-4">
                  <div className="text-center">
                    <p className="text-4xl font-black">₹{course.price}</p>
                    <p className="text-sm opacity-90">One-time payment</p>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                  <svg className="w-4 h-4 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>100% Secure Payment via Razorpay</span>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-lg rounded-2xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Pay & Enroll Now</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>

            {/* Security Badges */}
            <div className="flex items-center justify-center space-x-6 pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2 text-gray-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">SSL Secured</span>
              </div>
              
              <div className="flex items-center space-x-2 text-gray-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Trusted Payment</span>
              </div>
              
              <div className="flex items-center space-x-2 text-gray-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">Money Back Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Course Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;