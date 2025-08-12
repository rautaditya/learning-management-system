import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Calendar, Users, Book, Award } from 'lucide-react';
import {
  getAllCourses,
  fetchEnrolledCourses,
  getAllExams,
  getCourseCompletionReport,
  getExamCompletionReport
} from '../../api/admin';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A4DE6C', '#D0ED57', '#8884D8'];
const customYAxisTicks = [1, 10, 50, 100, 150, 200, 300, 500];

export default function LMSAdminReport() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('last30');
  const [loading, setLoading] = useState(true);
  const [examsLoading, setExamsLoading] = useState(false);
  const [statsData, setStatsData] = useState([]);
  const [courseEnrollmentData, setCourseEnrollmentData] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [topCourses, setTopCourses] = useState([]);
  const [examsData, setExamsData] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [completionData, setCompletionData] = useState(null);
  const [aggregateCompletion, setAggregateCompletion] = useState(null);
  const [courseCompletionData, setCourseCompletionData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setExamsLoading(true);
      try {
        const [coursesRes, enrollmentsRes, examsRes] = await Promise.all([
          getAllCourses(),
          fetchEnrolledCourses(),
          getAllExams()
        ]);

        const courses = Array.isArray(coursesRes) ? coursesRes : coursesRes.courses || [];
        const enrollments = Array.isArray(enrollmentsRes) ? enrollmentsRes : enrollmentsRes.enrollments || [];
        const exams = Array.isArray(examsRes) ? examsRes : examsRes.exams || [];

        setAllCourses(courses);
        
        // Enhanced exam completion data fetching
        const examCompletionData = await Promise.all(
          exams.map(async exam => {
            try {
              const data = await getExamCompletionReport(exam._id || exam.id);
              return {
                ...data,
                examId: exam._id || exam.id
              };
            } catch (error) {
              console.error(`Error loading completion for exam ${exam._id}:`, error);
              return {
                examId: exam._id || exam.id,
                completedStudents: 0,
                totalEnrolled: 0,
                completionPercentage: 0
              };
            }
          })
        );

        // Robust exam-course matching
        const processedExams = exams.map(exam => {
          // Find course with multiple ID format checks
          const course = courses.find(c => 
            c._id.toString() === (exam.course?._id || exam.course)?.toString()
          ) || {};
          
          const completion = examCompletionData.find(e => 
            e.examId === (exam._id || exam.id)
          );

          return {
            ...exam,
            course: {
              id: exam.course?._id || exam.course,
              title: course.title || course.name || `Course ${(exam.course?._id || exam.course)?.toString().slice(0, 6)}`
            },
            completion: completion?.completionPercentage || 0,
            completedStudents: completion?.completedStudents || 0,
            totalStudents: completion?.totalEnrolled || 0
          };
        });
        setExamsData(processedExams);

        // Stats
        setStatsData([
          { icon: <Users size={20} />, label: 'Total Students', value: enrollments.length },
          { icon: <Book size={20} />, label: 'Active Courses', value: courses.length },
          { icon: <Award size={20} />, label: 'Total Exams', value: exams.length }
        ]);

        // Enrollment Bar Chart
        const enrollmentCountByCourse = {};
        const normalizeCourseId = c => (typeof c === 'string' ? c : c?._id || c?.id || '');
        enrollments.forEach(en => {
          const cid = normalizeCourseId(en.courseId ?? en.course);
          if (!cid) return;
          enrollmentCountByCourse[cid] = (enrollmentCountByCourse[cid] || 0) + 1;
        });

        const courseChart = courses.map(c => ({
          name: c.title || c.name || `Course ${c._id?.slice?.(0, 6)}`,
          students: enrollmentCountByCourse[normalizeCourseId(c._id || c.id)] || 0,
          _id: c._id || c.id
        }));

        const maxStudents = Math.max(...courseChart.map(c => c.students), 1);
        const chartData = courseChart.map(c => ({
          ...c,
          maxStudents
        }));
        setCourseEnrollmentData(chartData);

        // Fetch completion data for all courses
        const completionPromises = courses.map(course => 
          getCourseCompletionReport(course._id || course.id).catch(() => null)
        );
        const allCompletionData = await Promise.all(completionPromises);
        
        const validCompletionData = allCompletionData
          .filter(data => data !== null)
          .map((data, index) => ({
            ...data,
            courseId: courses[index]?._id || courses[index]?.id,
            courseName: courses[index]?.title || courses[index]?.name || `Course ${courses[index]?._id?.slice(0, 6)}`
          }));
        
        setCourseCompletionData(validCompletionData);

        // Calculate aggregate completion data
        const totalEnrolled = enrollments.length;
        const completedStudents = validCompletionData.reduce(
          (sum, data) => sum + (data?.completedStudents || 0),
          0
        );
        
        setAggregateCompletion({
          totalEnrolled,
          completedStudents,
          completionPercentage: totalEnrolled > 0 
            ? (completedStudents / totalEnrolled) * 100 
            : 0
        });

        // Top Courses Table with actual completion data
        const top = courseChart
          .map(c => {
            const courseInfo = courses.find(x => (x._id || x.id) === c._id) || {};
            const completionData = validCompletionData.find(d => 
              d.courseId === (c._id || c.id).toString()
            );
            return {
              id: c._id,
              name: c.name,
              instructor: courseInfo.instructorName || courseInfo.instructor || 'N/A',
              students: c.students,
              completion: completionData?.completionPercentage?.toFixed(1) || '0',
              rating: courseInfo.rating ?? 'N/A'
            };
          })
          .sort((a, b) => b.students - a.students)
          .slice(0, 5);
        setTopCourses(top);

      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
        setExamsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCourse !== 'all') {
      const fetchCompletionData = async () => {
        try {
          const data = await getCourseCompletionReport(selectedCourse);
          setCompletionData(data);
        } catch (err) {
          console.error('Error fetching completion data:', err);
          setCompletionData(null);
        }
      };
      fetchCompletionData();
    } else {
      setCompletionData(null);
    }
  }, [selectedCourse]);

  const renderPieChart = () => {
    if (selectedCourse === 'all') {
      if (courseCompletionData.length === 0) {
        return <div className="text-center text-gray-500 py-12">No completion data available</div>;
      }

      const data = courseCompletionData.map(course => ({
        name: course.courseName,
        value: course.completionPercentage,
        completed: course.completedStudents,
        total: course.totalEnrolled
      }));

      return (
        <div className="flex flex-col items-center h-full">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${percent.toFixed(2)}%`}
                animationDuration={1000}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => [
                  `${props.payload.completed}/${props.payload.total} students`,
                  name
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-gray-600">
            <p>Total Enrolled: {aggregateCompletion?.totalEnrolled || 0}</p>
            <p>Overall Completion: {aggregateCompletion?.completionPercentage?.toFixed(1) || 0}%</p>
          </div>
        </div>
      );
    } else if (completionData) {
      const data = [
        { 
          name: 'Completed', 
          value: completionData.completionPercentage,
          completed: completionData.completedStudents,
          total: completionData.totalEnrolled
        },
        { 
          name: 'In Progress', 
          value: 100 - completionData.completionPercentage,
          completed: completionData.totalEnrolled - completionData.completedStudents,
          total: completionData.totalEnrolled
        }
      ];

      return (
        <div className="flex flex-col items-center h-full">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                <Cell fill="#4ade80" />
                <Cell fill="#facc15" />
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => [
                  `${props.payload.completed}/${props.payload.total} students`,
                  name
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-gray-600">
            <p>Total Enrolled: {completionData.totalEnrolled}</p>
            <p>Completed: {completionData.completedStudents} ({completionData.completionPercentage.toFixed(1)}%)</p>
          </div>
        </div>
      );
    }

    return <div className="text-center text-gray-500 py-12">Loading completion data...</div>;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md">
            <Calendar size={18} className="text-gray-500 mr-2" />
            <select
              className="bg-transparent text-sm text-gray-700 focus:outline-none"
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
            >
              <option value="last7">Last 7 days</option>
              <option value="last30">Last 30 days</option>
              <option value="last90">Last 90 days</option>
              <option value="thisYear">This year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-20">Loading dashboard...</div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {statsData.map((stat, i) => (
                <div key={i} className="bg-white shadow rounded-lg p-4 flex items-center">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                    <span className="text-indigo-600">{stat.icon}</span>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="mt-8 border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {['overview', 'courses', 'assessments'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`${activeTab === tab ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Enrollment Bar Chart */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">Course Enrollment</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={courseEnrollmentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis 
                        domain={[0, 'dataMax']}
                        ticks={customYAxisTicks}
                        scale="sqrt"
                      />
                      <Tooltip />
                      <Bar dataKey="maxStudents" fill="#e5e7eb" />
                      <Bar dataKey="students" fill="#f97316">
                        <LabelList dataKey="students" position="top" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Course Progress Chart */}
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="text-lg font-medium">
                      {selectedCourse === 'all' ? 'All Courses Progress' : 'Course Progress'}
                    </h3>
                    <select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value="all">All Courses</option>
                      {allCourses.map(course => (
                        <option key={course._id || course.id} value={course._id || course.id}>
                          {course.title || course.name || `Course ${course._id?.slice(0, 6)}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  {renderPieChart()}
                </div>
              </div>
            )}

            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <div className="mt-8 bg-white shadow rounded-lg p-6 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Instructor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completion</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {topCourses.map(c => (
                      <tr key={c.id}>
                        <td className="px-6 py-4 text-sm">{c.name}</td>
                        <td className="px-6 py-4 text-sm">{c.instructor}</td>
                        <td className="px-6 py-4 text-sm">{c.students}</td>
                        <td className="px-6 py-4 text-sm">{c.completion}%</td>
                        <td className="px-6 py-4 text-sm">{c.rating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Assessments Tab */}
            {activeTab === 'assessments' && (
              <div className="mt-8 bg-white shadow rounded-lg p-6 overflow-x-auto">
                <h3 className="text-lg font-medium mb-4">Exams List</h3>
                {examsLoading ? (
                  <div className="text-center py-12">Loading exam data...</div>
                ) : examsData.length === 0 ? (
                  <div className="text-center py-12">No exams found</div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Exam Title</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Completion</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {examsData.map((exam, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2 text-sm">{exam.title || 'Untitled Exam'}</td>
                          <td className="px-4 py-2 text-sm">
                            {exam.course?.title || `Course ${exam.course?.id?.slice(0, 6)}`}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            {typeof exam.completion === 'number' ? exam.completion.toFixed(1) : 0}%
                          </td>
                          <td className="px-4 py-2 text-sm">
                            {exam.completedStudents}/{exam.totalStudents}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}