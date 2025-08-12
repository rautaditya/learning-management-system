import React from 'react';
import { useParams } from 'react-router-dom';

const EnrollPage = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Enroll in Course</h1>
      <p>Course ID: {id}</p>
      {/* Enrollment form or payment integration here */}
    </div>
  );
};

export default EnrollPage;
