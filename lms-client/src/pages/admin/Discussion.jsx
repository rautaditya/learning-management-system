import { useState, useEffect } from 'react';
import { Search, Filter, MessageSquare, User, Calendar, Tags, ArrowUp, ArrowDown, MoreHorizontal } from 'lucide-react';

// Mock data for discussions
const mockDiscussions = [
  {
    id: 1,
    title: "Assignment feedback submission deadline",
    author: "Sarah Johnson",
    authorRole: "Instructor",
    date: "2025-05-02T10:30:00",
    category: "Announcements",
    course: "Advanced Web Development",
    replies: 12,
    views: 145,
    pinned: true,
    unread: false
  },
  {
    id: 2,
    title: "Student grades import issue",
    author: "Michael Chen",
    authorRole: "Teaching Assistant",
    date: "2025-05-01T16:45:00",
    category: "Technical Support",
    course: "Data Structures",
    replies: 8,
    views: 32,
    pinned: false,
    unread: true
  },
  {
    id: 3,
    title: "New feature discussion: Automated attendance",
    author: "Lisa Wong",
    authorRole: "Admin",
    date: "2025-04-30T09:15:00",
    category: "Feature Requests",
    course: "All Courses",
    replies: 24,
    views: 87,
    pinned: true,
    unread: false
  },
  {
    id: 4,
    title: "End-of-term survey template",
    author: "Robert Taylor",
    authorRole: "Instructor",
    date: "2025-04-29T14:20:00",
    category: "Resources",
    course: "Psychology 101",
    replies: 5,
    views: 63,
    pinned: false,
    unread: false
  },
  {
    id: 5,
    title: "Course material copyright question",
    author: "David Miller",
    authorRole: "Instructor",
    date: "2025-04-28T11:05:00",
    category: "Policies",
    course: "Business Ethics",
    replies: 16,
    views: 72,
    pinned: false,
    unread: true
  }
];

// List of categories for filtering
const categories = [
  "All Categories",
  "Announcements",
  "Technical Support",
  "Feature Requests",
  "Resources",
  "Policies",
  "General Discussion"
];

// List of courses for filtering
const courses = [
  "All Courses",
  "Advanced Web Development",
  "Data Structures",
  "Psychology 101",
  "Business Ethics",
  "Machine Learning Fundamentals"
];

export default function DiscussionPage() {
  const [discussions, setDiscussions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedCourse, setSelectedCourse] = useState("All Courses");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  useEffect(() => {
    // In a real application, you would fetch discussions from an API
    setDiscussions(mockDiscussions);
  }, []);

  // Filter and sort discussions
  const filteredDiscussions = discussions
    .filter(discussion => {
      const matchesSearch = discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           discussion.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All Categories" || discussion.category === selectedCategory;
      const matchesCourse = selectedCourse === "All Courses" || discussion.course === selectedCourse;
      return matchesSearch && matchesCategory && matchesCourse;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "desc" 
          ? new Date(b.date) - new Date(a.date)
          : new Date(a.date) - new Date(b.date);
      } else if (sortBy === "replies") {
        return sortOrder === "desc" ? b.replies - a.replies : a.replies - b.replies;
      } else if (sortBy === "views") {
        return sortOrder === "desc" ? b.views - a.views : a.views - b.views;
      }
      return 0;
    });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">Discussions</h1>
      </div>

      {/* Content Area */}
      <div className="flex flex-col px-6 py-4 gap-6">
        {/* Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 w-full h-10 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <button
              className="bg-white border border-gray-300 rounded-md px-4 py-2 flex items-center gap-2 hover:bg-gray-50"
              onClick={() => setFilterMenuOpen(!filterMenuOpen)}
            >
              <Filter className="h-5 w-5" />
              <span>Filter</span>
            </button>
            <button
              className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
            >
              New Discussion
            </button>
          </div>
        </div>

        {/* Filter Menu (conditionally rendered) */}
        {filterMenuOpen && (
          <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                <select
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  {courses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <div className="flex gap-2">
                  <select
                    className="flex-grow border border-gray-300 rounded-md shadow-sm p-2"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="date">Date</option>
                    <option value="replies">Replies</option>
                    <option value="views">Views</option>
                  </select>
                  <button 
                    className="border border-gray-300 rounded-md p-2 flex items-center justify-center w-10"
                    onClick={toggleSortOrder}
                  >
                    {sortOrder === "desc" ? (
                      <ArrowDown className="h-5 w-5" />
                    ) : (
                      <ArrowUp className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Discussions List */}
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 border-b border-gray-200">
            <div className="col-span-8">Topic</div>
            <div className="col-span-1 text-center">Replies</div>
            <div className="col-span-1 text-center">Views</div>
            <div className="col-span-2 text-right">Last Post</div>
          </div>

          {filteredDiscussions.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              No discussions found matching your criteria.
            </div>
          ) : (
            filteredDiscussions.map((discussion) => (
              <div 
                key={discussion.id} 
                className={`grid grid-cols-12 px-4 py-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${discussion.unread ? 'font-medium' : ''}`}
              >
                <div className="col-span-8">
                  <div className="flex items-center gap-1 mb-1">
                    {discussion.pinned && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">Pinned</span>
                    )}
                    {discussion.unread && (
                      <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs">New</span>
                    )}
                    <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs">{discussion.category}</span>
                  </div>
                  <h3 className="text-gray-900 font-medium">{discussion.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{discussion.author}</span>
                      <span className="text-xs bg-gray-100 px-1 rounded">{discussion.authorRole}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Tags className="h-4 w-4" />
                      <span>{discussion.course}</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-1 flex items-center justify-center">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4 text-gray-400" />
                    <span>{discussion.replies}</span>
                  </span>
                </div>
                <div className="col-span-1 flex items-center justify-center text-gray-600">
                  {discussion.views}
                </div>
                <div className="col-span-2 flex items-center justify-end text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(discussion.date)}</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing {filteredDiscussions.length} of {discussions.length} discussions
          </div>
          <div className="flex gap-2">
            <button className="border border-gray-300 rounded-md px-3 py-1 text-sm disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="bg-gray-100 border border-gray-300 rounded-md px-3 py-1 text-sm">
              1
            </button>
            <button className="border border-gray-300 rounded-md px-3 py-1 text-sm">
              2
            </button>
            <button className="border border-gray-300 rounded-md px-3 py-1 text-sm">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}