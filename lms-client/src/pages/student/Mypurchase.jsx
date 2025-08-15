import React, { useEffect, useState } from 'react';
import { getEnrollmentsByStudent } from '../../api/student';
import { Loader2, CreditCard, Calendar, BookOpen, IndianRupee, X } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg overflow-y-auto max-h-[90vh] relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6">My Purchases</h2>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="animate-spin w-8 h-8 text-gray-600" />
            </div>
          ) : enrollments.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              You haven’t purchased any courses yet.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {enrollments.map((enroll) => (
                <div
                  key={enroll._id}
                  className="bg-white rounded-xl shadow p-5 border border-gray-100"
                >
                  {/* Course Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <BookOpen className="w-6 h-6 text-blue-500" />
                    <h3 className="text-lg font-semibold">
                      {enroll.courseId?.title || 'Untitled Course'}
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 text-gray-700">
                    <IndianRupee className="w-5 h-5" />
                    <span>{enroll.courseId?.price || enroll.paymentInfo?.amount / 100}</span>
                  </div>

                  {/* Payment Mode */}
                  <div className="flex items-center gap-2 text-gray-700 mt-1">
                    <CreditCard className="w-5 h-5" />
                    <span>{enroll.paymentInfo?.method || 'N/A'}</span>
                  </div>

                  {/* Enrollment Date */}
                  <div className="flex items-center gap-2 text-gray-700 mt-1">
                    <Calendar className="w-5 h-5" />
                    <span>
                      {new Date(enroll.enrolledAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
