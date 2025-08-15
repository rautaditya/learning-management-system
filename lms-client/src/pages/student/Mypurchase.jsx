import React, { useEffect, useState } from 'react';
import { getEnrollmentsByStudent } from '../../api/student';
import { Loader2, CreditCard, Calendar, BookOpen, IndianRupee, X, ShoppingBag } from 'lucide-react';

export default function Mypurchase({ onClose }) {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getEnrollmentsByStudent();
        setEnrollments(data);
      } catch (err) {
        console.error('Error loading purchases:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/40 via-black/50 to-black/60 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] relative transform transition-all duration-300 scale-100">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">My Purchases</h2>
                <p className="text-blue-100 text-sm">View all your enrolled courses</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-2 transition-all duration-200 hover:scale-105"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6">
            {loading ? (
              <div className="flex flex-col justify-center items-center h-60">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-4 mb-4">
                  <Loader2 className="animate-spin w-8 h-8 text-white" />
                </div>
                <p className="text-gray-600 font-medium">Loading your purchases...</p>
                <p className="text-gray-400 text-sm mt-1">This won't take long</p>
              </div>
            ) : enrollments.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No purchases yet</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  You haven't purchased any courses yet. Start exploring our amazing course catalog!
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-gray-600">
                    You have <span className="font-semibold text-blue-600">{enrollments.length}</span> course{enrollments.length !== 1 ? 's' : ''} enrolled
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {enrollments.map((enroll, index) => (
                    <div
                      key={enroll._id}
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: 'fadeInUp 0.6s ease-out forwards'
                      }}
                    >
                      {/* Course header with gradient */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-blue-100">
                        <div className="flex items-start gap-3">
                          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg">
                            <BookOpen className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-200 leading-tight">
                              {enroll.courseId?.title || 'Untitled Course'}
                            </h3>
                          </div>
                        </div>
                      </div>

                      {/* Course details */}
                      <div className="p-4 space-y-3">
                        {/* Price */}
                        <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                          <div className="bg-green-500 p-1.5 rounded-md">
                            <IndianRupee className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-green-700 font-medium">Amount Paid</p>
                            <p className="font-bold text-green-800">
                              ₹{(enroll.courseId?.price || enroll.paymentInfo?.amount / 100).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Payment Mode */}
                        <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                          <div className="bg-blue-500 p-1.5 rounded-md">
                            <CreditCard className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-blue-700 font-medium">Payment Method</p>
                            <p className="font-semibold text-blue-800">
                              {enroll.paymentInfo?.method || 'N/A'}
                            </p>
                          </div>
                        </div>

                        {/* Enrollment Date */}
                        <div className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg">
                          <div className="bg-purple-500 p-1.5 rounded-md">
                            <Calendar className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-purple-700 font-medium">Enrolled On</p>
                            <p className="font-semibold text-purple-800">
                              {new Date(enroll.enrolledAt).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Hover effect border */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-indigo-500/5 transition-all duration-300 pointer-events-none rounded-2xl"></div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}