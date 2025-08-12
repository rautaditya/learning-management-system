import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TakeExam = () => {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchExam = async () => {
const res = await axios.get(`http://localhost:5000/api/exam/${examId}`);
      setExam(res.data.exam);
    };
    fetchExam();
  }, [examId]);

  const handleOptionSelect = (qIndex, optIndex) => {
    setAnswers({ ...answers, [qIndex]: optIndex });
  };

 const handleSubmit = async () => {
  let tempScore = 0;
const formattedAnswers = [];

exam.questions.forEach((q, idx) => {
  const selected = answers[idx];
  formattedAnswers.push({
    questionIndex: idx,
    selectedOptionIndex: selected  // ✅ Correct key
  });
});


  setScore(tempScore);
  setSubmitted(true);

  try {
    await axios.post(
  'http://localhost:5000/api/exam/submit',
  {
    examId: exam._id,
    answers: formattedAnswers
  },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('student_token')}` // ✅ EXACT format
    }
  }
);


  } catch (err) {
    console.error('Error submitting exam:', err);
  }
};


  if (!exam) return <div>Loading Exam...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 bg-white shadow-xl rounded-xl mt-10">
      <h2 className="text-2xl font-bold">{exam.title}</h2>
      <p className="text-gray-600">{exam.description}</p>
      <hr />

      {exam.questions.map((q, idx) => (
        <div key={idx} className="mb-6">
          <p className="font-medium">
            Q{idx + 1}. {q.questionText}
          </p>
          <div className="mt-2 space-y-1">
            {q.options.map((opt, optIndex) => (
              <label key={optIndex} className="block">
                <input
                  type="radio"
                  name={`question-${idx}`}
                  checked={answers[idx] === optIndex}
                  onChange={() => handleOptionSelect(idx, optIndex)}
                />{' '}
                {opt}
              </label>
            ))}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Submit Exam
        </button>
      ) : (
        <div className="text-green-600 font-semibold text-lg">
          ✅ You scored {score} out of {exam.totalMarks}
        </div>
      )}
    </div>
  );
};

export default TakeExam;
