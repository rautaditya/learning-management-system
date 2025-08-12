import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllExams } from '../../api/admin'; // Replace with getExamById for optimization

const QuestionPaper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await getAllExams();
        const found = res.exams.find(e => e._id === id);
        setExam(found);
      } catch (error) {
        console.error('Error fetching exam:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-xl font-semibold text-gray-600">
        Loading exam...
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-xl font-semibold text-red-600">
        Exam not found
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Back Button */}
      <button
        onClick={() => navigate('/admin/manageexam')}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
      >
        ← Back to Manage Exams
      </button>

      {/* Exam Title & Description */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{exam.title}</h1>
        <p className="text-gray-500">{exam.description}</p>
      </div>

      {/* Questions List */}
      <div className="grid gap-6">
        {exam.questions.map((q, index) => (
          <div
            key={index}
            className="p-6 bg-white rounded-2xl shadow-md border border-gray-200 transition hover:shadow-lg"
          >
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-800">
                Q{index + 1}: {q.questionText}
              </h3>
            </div>

            <div className="mb-2">
              <p className="text-sm text-gray-700">
                <strong>Options:</strong>
              </p>
              <ul className="list-disc pl-5 text-gray-600">
                {q.options.map((opt, idx) => (
                  <li
                    key={idx}
                    className={idx === q.correctOptionIndex ? 'text-green-600 font-medium' : ''}
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between text-sm text-gray-600 mt-4">
              <span>
                <strong>Correct Answer:</strong>{' '}
                {q.options[q.correctOptionIndex]}
              </span>
              <span>
                <strong>Marks:</strong> {q.marks}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionPaper;
