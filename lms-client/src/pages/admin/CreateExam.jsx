  import React, { useState, useEffect } from 'react';
  import { createExam, getAllCourses } from '../../api/admin';
  import { 
    BookOpen, 
    Plus, 
    Check, 
    X, 
    Save, 
    Eye, 
    EyeOff, 
    Award,
    FileText,
    Hash,
    Edit3,
    Trash2,
    AlertCircle,
    CheckCircle2,
    Target,
    Clock,
    User
  } from 'lucide-react';

  const CreateExam = () => {
    const [formData, setFormData] = useState({
  course: '',
  title: '',
  description: '',
  totalMarks: '',
  examDueDate: '', // ✅ new field
  createdBy: ''
});


    const [questionInput, setQuestionInput] = useState({
      questionText: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0,
      marks: ''
    });

    const [questions, setQuestions] = useState([]);
    const [courses, setCourses] = useState([]);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [showPopup, setShowPopup] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);

    useEffect(() => {
      const fetchCourses = async () => {
        try {
          const courseData = await getAllCourses();
          console.log("Fetched courses:", courseData);
          setCourses(courseData);
        } catch (error) {
          console.error('Failed to load courses:', error);
          setMessage('Failed to load courses');
          setMessageType('error');
        }
      };

      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser?.id) {
        setFormData(prev => ({ ...prev, createdBy: storedUser.id }));
      }

      fetchCourses();
    }, []);

    const handleAddQuestion = () => {
      const { questionText, options, correctOptionIndex, marks } = questionInput;

      const isValid =
        questionText.trim() !== '' &&
        options.every(opt => opt.trim() !== '') &&
        marks !== '' &&
        parseInt(marks) > 0;

      if (!isValid) {
        setMessage('Please fill all question fields correctly and enter marks > 0.');
        setMessageType('error');
        return;
      }

      if (editingQuestion !== null) {
        // Update existing question
        const updatedQuestions = [...questions];
        updatedQuestions[editingQuestion] = {
          ...questionInput,
          correctOptionIndex: parseInt(correctOptionIndex),
          marks: parseInt(marks)
        };
        setQuestions(updatedQuestions);
        setEditingQuestion(null);
        showTemporaryPopup('Question updated successfully!', 'success');
      } else {
        // Add new question
        setQuestions(prev => [
          ...prev,
          {
            ...questionInput,
            correctOptionIndex: parseInt(correctOptionIndex),
            marks: parseInt(marks)
          }
        ]);
        showTemporaryPopup('Question added successfully!', 'success');
      }

      setQuestionInput({
        questionText: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0,
        marks: ''
      });

      setMessage('');
    };

    const handleEditQuestion = (index) => {
      const question = questions[index];
      setQuestionInput(question);
      setEditingQuestion(index);
    };

    const handleDeleteQuestion = (index) => {
      setQuestions(prev => prev.filter((_, i) => i !== index));
      showTemporaryPopup('Question deleted successfully!', 'success');
    };

    const handleCancelEdit = () => {
      setQuestionInput({
        questionText: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0,
        marks: ''
      });
      setEditingQuestion(null);
    };

   const handleSubmit = async (e) => {
  e.preventDefault();

  const totalMarks = parseInt(formData.totalMarks);
const storedUser = JSON.parse(localStorage.getItem('admin_user')); // ✅ correct key

if (
  !formData.course ||
  !formData.title ||
  !formData.examDueDate || // ✅ Make sure this is included!
  !totalMarks ||
  totalMarks <= 0 ||
  questions.length === 0 ||
  !storedUser?.id
) {
  setMessage('Please fill all required fields and add at least one question');
  setMessageType('error');
  return;
}


  setIsSubmitting(true);

 const payload = {
  ...formData,
  createdBy: storedUser.id,
  totalMarks,
  questions,
  createdAt: new Date()
};

  console.log("Submitting payload:", payload);

  try {
    const res = await createExam(payload);
    setMessage(res.message || 'Exam created successfully!');
    setMessageType('success');
    showTemporaryPopup('Exam created successfully!', 'success');
    setFormData({
      course: '',
      title: '',
      description: '',
      totalMarks: '',
      createdBy: storedUser.id // retain creator
    });
    setQuestions([]);
  } catch (err) {
    console.error('Create Exam Error:', err);
    setMessage(err.message || 'Failed to create exam');
    setMessageType('error');
  } finally {
    setIsSubmitting(false);
  }
};


    const showTemporaryPopup = (text, type = 'success') => {
      setShowPopup({ text, type });
      setTimeout(() => {
        setShowPopup('');
      }, 3000);
    };

    const calculateTotalQuestionMarks = () => {
      return questions.reduce((total, q) => total + q.marks, 0);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Success/Error Popup */}
          {showPopup && (
            <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 ${
              showPopup.type === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              {showPopup.type === 'success' ? 
                <CheckCircle2 className="h-5 w-5" /> : 
                <AlertCircle className="h-5 w-5" />
              }
              {showPopup.text}
            </div>
          )}

          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Create New Exam
                </h1>
                <p className="text-gray-600 mt-2">Design and build comprehensive exams for your courses</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-100 p-4 rounded-xl">
                  <BookOpen className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-800">{questions.length}</p>
                  <p className="text-sm text-gray-600">Questions Added</p>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl text-white">
                <div className="flex items-center gap-3">
                  <Hash className="h-6 w-6" />
                  <div>
                    <p className="text-sm opacity-90">Total Questions</p>
                    <p className="text-2xl font-bold">{questions.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-xl text-white">
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6" />
                  <div>
                    <p className="text-sm opacity-90">Question Marks</p>
                    <p className="text-2xl font-bold">{calculateTotalQuestionMarks()}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-xl text-white">
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6" />
                  <div>
                    <p className="text-sm opacity-90">Target Total</p>
                    <p className="text-2xl font-bold">{formData.totalMarks || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Marks Validation Alert */}
            {formData.totalMarks && questions.length > 0 && calculateTotalQuestionMarks() !== parseInt(formData.totalMarks) && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-yellow-800 font-medium">Marks Mismatch</p>
                  <p className="text-yellow-700 text-sm">
                    Question marks ({calculateTotalQuestionMarks()}) don't match total marks ({formData.totalMarks})
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className="space-y-6">
              {/* Basic Information Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Basic Information</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Course *
                    </label>
                    <select
                      className="w-full border border-gray-300 px-4 py-3 rounded-xl bg-white text-black focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      value={formData.course}
                      onChange={e => setFormData({ ...formData, course: e.target.value })}
                      required
                    >
                      <option value="" disabled className="text-gray-700">Choose a course...</option>
                      {Array.isArray(courses) && courses.length > 0 ? (
                        courses.map(course => (
                          <option key={course._id} value={course._id} className="text-black">
                            {course.title || 'Unnamed Course'}
                          </option>
                        ))
                      ) : (
                        <option disabled className="text-red-600">No Courses Available</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Exam Title *
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter exam title..."
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Brief description of the exam..."
                      rows="3"
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Marks *
                    </label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter total marks..."
                      value={formData.totalMarks}
                      onChange={e => setFormData({ ...formData, totalMarks: e.target.value })}
                      required
                    />
                  </div>
              <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Exam Due Date *
  </label>
  <input
    type="datetime-local"
    className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
    value={formData.examDueDate}
    onChange={e => setFormData({ ...formData, examDueDate: e.target.value })}
    required
  />
</div>


                </div>
              </div>

              {/* Add Question Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Plus className="h-5 w-5 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {editingQuestion !== null ? 'Edit Question' : 'Add Question'}
                    </h2>
                  </div>
                  {editingQuestion !== null && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <X className="h-4 w-4" />
                      Cancel Edit
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Text *
                    </label>
                    <textarea
                      className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Enter your question here..."
                      rows="3"
                      value={questionInput.questionText}
                      onChange={e =>
                        setQuestionInput({ ...questionInput, questionText: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Answer Options *
                    </label>
                    <div className="grid gap-3">
                      {questionInput.options.map((opt, index) => (
                        <div key={index} className="relative">
                          <input
                            type="text"
                            className={`w-full border px-4 py-3 pl-12 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                              questionInput.correctOptionIndex === index 
                                ? 'border-green-500 bg-green-50' 
                                : 'border-gray-300'
                            }`}
                            placeholder={`Option ${index + 1}...`}
                            value={opt}
                            onChange={e => {
                              const newOptions = [...questionInput.options];
                              newOptions[index] = e.target.value;
                              setQuestionInput({ ...questionInput, options: newOptions });
                            }}
                          />
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                              questionInput.correctOptionIndex === index 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gray-200 text-gray-600'
                            }`}>
                              {String.fromCharCode(65 + index)}
                            </span>
                          </div>
                          {questionInput.correctOptionIndex === index && (
                            <Check className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Correct Answer *
                      </label>
                      <select
                        className="w-full border border-gray-300 px-4 py-3 rounded-xl text-black bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        value={questionInput.correctOptionIndex}
                        onChange={e =>
                          setQuestionInput({ ...questionInput, correctOptionIndex: parseInt(e.target.value) })
                        }
                      >
                        {questionInput.options.map((opt, index) => (
                          <option key={index} value={index}>
                            Option {String.fromCharCode(65 + index)} {opt && `- ${opt.slice(0, 20)}${opt.length > 20 ? '...' : ''}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Marks *
                      </label>
                      <input
                        type="number"
                        className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="Points..."
                        value={questionInput.marks}
                        onChange={e =>
                          setQuestionInput({ ...questionInput, marks: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200"
                    onClick={handleAddQuestion}
                  >
                    {editingQuestion !== null ? <Save className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    {editingQuestion !== null ? 'Update Question' : 'Add Question'}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Preview */}
            <div className="space-y-6">
              {/* Questions Preview */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Eye className="h-5 w-5 text-purple-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Questions Preview</h2>
                  </div>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {questions.length} Questions
                  </span>
                </div>

                {questions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No questions added yet</p>
                    <p className="text-gray-400 text-sm">Add your first question to see the preview</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {questions.map((q, index) => (
                      <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-lg text-sm font-medium">
                              Q{index + 1}
                            </span>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-lg text-sm font-medium">
                              {q.marks} pts
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditQuestion(index)}
                              className="p-1 text-yellow-600 hover:text-yellow-700 transition-colors"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(index)}
                              className="p-1 text-red-600 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-gray-800 font-medium mb-3">{q.questionText}</p>
                        
                        <div className="grid gap-2">
                          {q.options.map((option, optIdx) => (
                            <div 
                              key={optIdx} 
                              className={`p-2 rounded-lg text-sm flex items-center gap-2 ${
                                optIdx === q.correctOptionIndex 
                                  ? 'bg-green-100 text-green-800 border border-green-200' 
                                  : 'bg-gray-50 text-gray-700'
                              }`}
                            >
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${
                                optIdx === q.correctOptionIndex 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-gray-300 text-gray-600'
                              }`}>
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              {option}
                              {optIdx === q.correctOptionIndex && (
                                <Check className="h-4 w-4 text-green-600 ml-auto" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Ready to Create Exam?</h3>
                <p className="text-gray-600">Review all details before submitting</p>
              </div>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || questions.length === 0}
                className="flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating Exam...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Create Exam
                  </>
                )}
              </button>
            </div>

            {/* Message Display */}
            {message && (
              <div className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${
                messageType === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {messageType === 'success' ? 
                  <CheckCircle2 className="h-5 w-5" /> : 
                  <AlertCircle className="h-5 w-5" />
                }
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  export default CreateExam;


