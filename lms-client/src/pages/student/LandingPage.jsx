import { useState, useEffect } from 'react';
import { 
  Search, 
  BookOpen, 
  Users, 
  Award, 
  Clock, 
  ChevronRight, 
  Play, 
  Star, 
  CheckCircle, 
  TrendingUp,
  Briefcase,
  Monitor,
  Code,
  PenTool,
  Database,
  BarChart2
} from 'lucide-react';

// Import the navbar and footer components

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Animate sections as they come into view
  const [animateSections, setAnimateSections] = useState({
    hero: false,
    features: false,
    categories: false,
    courses: false,
    testimonials: false,
    stats: false,
    cta: false
  });
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      // Check each section and animate when in viewport
      Object.keys(animateSections).forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const isInViewport = rect.top <= window.innerHeight * 0.75;
          
          if (isInViewport && !animateSections[section]) {
            setAnimateSections(prev => ({ ...prev, [section]: true }));
          }
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [animateSections]);
  
  // Featured courses data
  const courses = [
    {
      id: 1,
      title: 'Web Development Masterclass',
      category: 'Development',
      instructor: 'Sarah Johnson',
      rating: 4.9,
      students: '2,345',
      level: 'All Levels',
      image: 'web-dev',
      popular: true
    },
    {
      id: 2,
      title: 'Data Science Fundamentals',
      category: 'Data Science',
      instructor: 'Michael Chen',
      rating: 4.8,
      students: '1,987',
      level: 'Beginner',
      image: 'data-science',
      popular: true
    },
    {
      id: 3,
      title: 'UX/UI Design Principles',
      category: 'Design',
      instructor: 'Alex Rivera',
      rating: 4.7,
      students: '1,456',
      level: 'Intermediate',
      image: 'ux-design',
      popular: false
    },
    {
      id: 4,
      title: 'Business Analytics 101',
      category: 'Business',
      instructor: 'Priya Sharma',
      rating: 4.9,
      students: '2,145',
      level: 'Beginner',
      image: 'business',
      popular: true
    },
    {
      id: 5,
      title: 'Machine Learning Applications',
      category: 'Data Science',
      instructor: 'David Wilson',
      rating: 4.8,
      students: '1,652',
      level: 'Advanced',
      image: 'machine-learning',
      popular: false
    },
    {
      id: 6,
      title: 'Mobile App Development',
      category: 'Development',
      instructor: 'Lisa Chang',
      rating: 4.7,
      students: '1,289',
      level: 'Intermediate',
      image: 'mobile-dev',
      popular: false
    }
  ];
  
  // Course categories
  const categories = [
    { id: 'All', name: 'All Categories', count: courses.length },
    { id: 'Development', name: 'Development', icon: <Code size={18} />, count: courses.filter(c => c.category === 'Development').length },
    { id: 'Design', name: 'Design', icon: <PenTool size={18} />, count: courses.filter(c => c.category === 'Design').length },
    { id: 'Business', name: 'Business', icon: <Briefcase size={18} />, count: courses.filter(c => c.category === 'Business').length },
    { id: 'Data Science', name: 'Data Science', icon: <Database size={18} />, count: courses.filter(c => c.category === 'Data Science').length },
    { id: 'Marketing', name: 'Marketing', icon: <TrendingUp size={18} />, count: 12 },
    { id: 'IT', name: 'IT & Software', icon: <Monitor size={18} />, count: 18 },
    { id: 'Analytics', name: 'Analytics', icon: <BarChart2 size={18} />, count: 9 }
  ];
  
  // Testimonials data
  const testimonials = [
    {
      id: 1,
      content: "Vivaaks LMS completely transformed my learning experience. The interactive courses and supportive community helped me land my dream job in web development!",
      name: "Emily Rodriguez",
      title: "Frontend Developer",
      avatar: "emily"
    },
    {
      id: 2,
      content: "As someone switching careers, I needed structured learning that fit my schedule. The courses here are comprehensive and the instructors are top-notch professionals.",
      name: "Marcus Johnson",
      title: "Data Scientist",
      avatar: "marcus"
    },
    {
      id: 3,
      content: "The certification programs are recognized industry-wide. I've completed three courses and each one significantly advanced my career and skillset.",
      name: "Sophia Chen",
      title: "UX Designer",
      avatar: "sophia"
    }
  ];
  
  // Filter courses based on active category and search term
  const filteredCourses = courses.filter(course => {
    const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // Helper function to generate placeholder images
  const getPlaceholderImg = (name, width = 400, height = 250) => {
    const colors = {
      'web-dev': 'blue',
      'data-science': 'purple',
      'ux-design': 'pink',
      'business': 'green',
      'machine-learning': 'indigo',
      'mobile-dev': 'orange',
      'emily': 'cyan',
      'marcus': 'amber',
      'sophia': 'emerald'
    };
    
    // For actual implementation, you would use real images
    return `/api/placeholder/${width}/${height}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
   
      
      {/* Hero Section */}
      <section 
        id="hero" 
        className={`pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden transition-all duration-1000 ${
          animateSections.hero ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Background animated circles */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 right-1/3 w-56 h-56 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Unlock Your Learning Potential
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8">
                Discover thousands of courses taught by industry experts and enhance your skills with our interactive learning platform.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
                  Get Started
                </button>
                <button className="px-6 py-3 bg-white text-gray-800 font-medium rounded-lg shadow-sm hover:shadow border border-gray-200 hover:border-gray-300 flex items-center justify-center">
                  <Play size={16} className="mr-2 text-blue-600" />
                  Watch Demo
                </button>
              </div>
            </div>
            
            <div className="relative h-64 md:h-auto flex items-center justify-center">
              <img 
                src="/api/placeholder/540/400" 
                alt="Learning platform showcase" 
                className="rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-lg shadow-lg flex items-center animate-bounce-subtle">
                <div className="bg-green-500 h-3 w-3 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-gray-800">5,234 students online</span>
              </div>
            </div>
          </div>
          
          {/* Search bar */}
          <div className="max-w-3xl mx-auto mt-12 relative z-10">
            <div className="bg-white p-2 rounded-xl shadow-lg flex items-center">
              <div className="bg-gray-100 rounded-l-lg px-4 py-3 flex items-center">
                <Search size={20} className="text-gray-500" />
                <span className="hidden md:inline ml-2 text-gray-600 whitespace-nowrap">What do you want to learn?</span>
              </div>
              <input
                type="text"
                placeholder="Search courses, skills, topics..."
                className="flex-1 py-3 px-4 focus:outline-none text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors ml-2">
                Search
              </button>
            </div>
          </div>
          
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-8 mt-16">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-full">
                <CheckCircle size={20} className="text-blue-600" />
              </div>
              <span className="ml-2 text-gray-700">Accredited Courses</span>
            </div>
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-full">
                <CheckCircle size={20} className="text-blue-600" />
              </div>
              <span className="ml-2 text-gray-700">Expert Instructors</span>
            </div>
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-full">
                <CheckCircle size={20} className="text-blue-600" />
              </div>
              <span className="ml-2 text-gray-700">Lifetime Access</span>
            </div>
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-full">
                <CheckCircle size={20} className="text-blue-600" />
              </div>
              <span className="ml-2 text-gray-700">Money Back Guarantee</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section 
        id="features" 
        className={`py-16 md:py-24 bg-white transition-opacity duration-1000 ${
          animateSections.features ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Vivaaks LMS?</h2>
            <p className="mt-4 text-xl text-gray-600">Our platform is designed to provide the best learning experience</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen size={24} className="text-blue-600" />,
                title: "Comprehensive Curriculum",
                description: "Access thousands of courses across various disciplines, designed by industry experts and academics."
              },
              {
                icon: <Users size={24} className="text-indigo-600" />,
                title: "Interactive Community",
                description: "Connect with fellow learners, participate in discussions, and collaborate on projects."
              },
              {
                icon: <Award size={24} className="text-purple-600" />,
                title: "Recognized Certifications",
                description: "Earn certificates that are recognized by leading companies and institutions worldwide."
              },
              {
                icon: <Monitor size={24} className="text-pink-600" />,
                title: "Interactive Learning",
                description: "Engage with interactive content, quizzes, and hands-on projects to reinforce your learning."
              },
              {
                icon: <Clock size={24} className="text-blue-600" />,
                title: "Learn at Your Pace",
                description: "Access content anytime, anywhere. Study at your own pace with lifetime access to courses."
              },
              {
                icon: <TrendingUp size={24} className="text-indigo-600" />,
                title: "Career Advancement",
                description: "Gain skills that are in-demand and advance your career with specialized learning paths."
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className={`bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform ${
                  animateSections.features ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="bg-white inline-block p-4 rounded-lg shadow-sm mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section 
        id="categories" 
        className={`py-16 md:py-24 bg-gray-50 transition-opacity duration-1000 ${
          animateSections.categories ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Explore Course Categories</h2>
            <p className="mt-4 text-xl text-gray-600">Find the perfect course for your learning goals</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`p-5 rounded-xl flex flex-col items-center justify-center transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                    : 'bg-white hover:bg-gray-100 text-gray-800 shadow-sm'
                } ${
                  animateSections.categories ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
                style={{ transitionDelay: `${index * 75}ms` }}
              >
                {category.icon && <div className="mb-3">{category.icon}</div>}
                <h3 className="font-medium text-center">{category.name}</h3>
                <p className={`text-sm mt-1 ${activeCategory === category.id ? 'text-blue-100' : 'text-gray-500'}`}>
                  {category.count} courses
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Courses Section */}
      <section 
        id="courses" 
        className={`py-16 md:py-24 bg-white transition-opacity duration-1000 ${
          animateSections.courses ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Courses</h2>
              <p className="mt-4 text-xl text-gray-600">
                {activeCategory === 'All' ? 'Popular courses across all categories' : `Top ${activeCategory} courses`}
              </p>
            </div>
            <a href="#" className="mt-4 md:mt-0 inline-flex items-center text-blue-600 font-medium hover:text-blue-800">
              View All Courses
              <ChevronRight size={18} className="ml-1" />
            </a>
          </div>
          
          {filteredCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course, index) => (
                <div 
                  key={course.id}
                  className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden transform hover:-translate-y-1 ${
                    animateSections.courses ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="relative">
                    <img 
                      src={getPlaceholderImg(course.image)} 
                      alt={course.title} 
                      className="w-full h-48 object-cover"
                    />
                    {course.popular && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs py-1 px-2 rounded-full font-medium">
                        Popular
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md">
                      <BookOpen size={16} className="text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-indigo-600 bg-indigo-50 py-1 px-2 rounded-full">
                        {course.category}
                      </span>
                      <div className="flex items-center">
                        <Star size={16} className="text-yellow-400" />
                        <span className="ml-1 text-sm font-medium text-gray-800">{course.rating}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">Instructor: {course.instructor}</p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-sm text-gray-500">
                        {course.students} students
                      </span>
                      <span className="text-sm font-medium text-blue-600">
                        {course.level}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No courses found. Try a different search term or category.</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section 
        id="testimonials" 
        className={`py-16 md:py-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 transition-opacity duration-1000 ${
          animateSections.testimonials ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">What Our Students Say</h2>
            <p className="mt-4 text-xl text-gray-600">Join thousands of satisfied learners worldwide</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className={`bg-white p-8 rounded-xl shadow-md relative transform transition-all duration-500 ${
                  animateSections.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="absolute -top-5 left-8 text-5xl text-blue-200">"</div>
                <p className="text-gray-600 italic mb-6 relative z-10">{testimonial.content}</p>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src={getPlaceholderImg(testimonial.avatar, 100, 100)} 
                      alt={testimonial.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section 
        id="cta" 
        className={`py-16 md:py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white transition-opacity duration-1000 ${
          animateSections.cta ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Learning Journey?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
            Join thousands of students already learning on Vivaaks LMS. Get unlimited access to all courses.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-4 bg-white text-blue-600 font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all text-lg">
              Get Started For Free
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors text-lg">
              Explore Courses
            </button>
          </div>
          <p className="mt-6 text-sm text-blue-200">No credit card required for free courses</p>
        </div>
      </section>
      
      {/* Footer */}
 
      
      {/* Floating "Back to top" button - appears when scrolled */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 p-3 rounded-full bg-white shadow-lg text-blue-600 hover:bg-blue-50 transition-all transform ${
          isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <ChevronRight size={24} className="transform rotate-270" />
      </button>
      
      {/* Custom animations */}
     
    </div>
  );
}