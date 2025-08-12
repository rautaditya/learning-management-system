import { useState } from "react";
import { Trophy, Medal, Sparkles, Users, BookOpen, CheckCircle, Star, Award, BarChart, Globe, Clock, Zap } from "lucide-react";

export default function Achievement() {
  // Testimonial carousel state
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  // Platform statistics data
  const platformStats = [
    {
      value: "250,000+",
      label: "Active Students",
      icon: <Users className="text-blue-500" size={24} />,
      description: "Students actively learning on our platform"
    },
    {
      value: "15,000+",
      label: "Courses Offered",
      icon: <BookOpen className="text-green-500" size={24} />,
      description: "High-quality courses across various domains"
    },
    {
      value: "98.7%",
      label: "Completion Rate",
      icon: <CheckCircle className="text-purple-500" size={24} />,
      description: "Students completing their enrolled courses"
    },
    {
      value: "4.8/5",
      label: "User Satisfaction",
      icon: <Star className="text-amber-500" size={24} />,
      description: "Average rating from our students"
    }
  ];
  
  // Awards and recognitions
  const awards = [
    {
      year: "2025",
      title: "Best Educational Platform",
      organization: "EdTech Excellence Awards",
      icon: <Trophy className="text-yellow-500" size={36} />
    },
    {
      year: "2024",
      title: "Most Innovative LMS",
      organization: "Global Learning Technology",
      icon: <Sparkles className="text-blue-500" size={36} />
    },
    {
      year: "2024",
      title: "Top User Experience",
      organization: "UX Design Awards",
      icon: <Medal className="text-purple-500" size={36} />
    },
    {
      year: "2023",
      title: "Best Learning Analytics",
      organization: "Education Innovation Summit",
      icon: <BarChart className="text-green-500" size={36} />
    }
  ];
  
  // Key features that set the platform apart
  const keyFeatures = [
    {
      title: "Adaptive Learning Paths",
      description: "AI-powered personalized learning journeys that adapt to each student's pace and style",
      icon: <Zap className="text-indigo-500" size={28} />
    },
    {
      title: "Real-time Collaboration",
      description: "Seamless peer-to-peer and student-instructor collaboration tools built directly into the platform",
      icon: <Users className="text-blue-500" size={28} />
    },
    {
      title: "Enterprise-grade Analytics",
      description: "Comprehensive insights into student performance with actionable reports for instructors",
      icon: <BarChart className="text-green-500" size={28} />
    },
    {
      title: "Global Learning Community",
      description: "Connect with learners worldwide and participate in international learning projects",
      icon: <Globe className="text-amber-500" size={28} />
    },
    {
      title: "Microlearning Modules",
      description: "Bite-sized content optimized for retention and engagement, perfect for busy schedules",
      icon: <Clock className="text-purple-500" size={28} />
    },
    {
      title: "Industry-recognized Certifications",
      description: "Blockchain-verified credentials valued by top employers worldwide",
      icon: <Award className="text-red-500" size={28} />
    }
  ];
  
  // Testimonials data
  const testimonials = [
    {
      quote: "This LMS transformed how our university delivers online education. The analytics and student engagement tools are unmatched.",
      author: "Dr. Sarah Johnson",
      position: "Dean of Digital Learning",
      organization: "Westfield University"
    },
    {
      quote: "The adaptive learning technology helped us increase course completion rates by 45% and improve student satisfaction scores.",
      author: "Michael Chen",
      position: "Chief Learning Officer",
      organization: "TechCorp Industries"
    },
    {
      quote: "We evaluated over 20 LMS platforms before choosing this one. Three years later, it remains the best decision we've made for our online training program.",
      author: "Priya Sharma",
      position: "Head of Corporate Training",
      organization: "Global Finance Group"
    }
  ];
  
  // Impact metrics
  const impactMetrics = [
    {
      value: "87%",
      description: "Average improvement in student engagement"
    },
    {
      value: "42%",
      description: "Increase in knowledge retention"
    },
    {
      value: "120+",
      description: "Countries with active users"
    },
    {
      value: "65%",
      description: "Faster course completion time"
    }
  ];

  // Navigation for testimonial carousel
  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => 
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };
  
  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  return (
    <div>
 
      <div className="min-h-screen bg-gray-50 ">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 mt-10">Platform Achievements</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Discover why our learning management system is the preferred choice of educational institutions and corporate training programs worldwide.
          </p>
          <div className="flex justify-center mt-8">
            <button className="bg-white text-blue-700 font-medium px-6 py-3 rounded-lg shadow-lg hover:bg-blue-50 transition-colors">
              Request a Demo
            </button>
            <button className="ml-4 border border-white text-white font-medium px-6 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
              View Case Studies
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Impact in Numbers</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We've built a platform that delivers real results for students and institutions alike.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {platformStats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center hover:shadow-lg transition-shadow">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
              <p className="font-medium text-gray-700 mb-2">{stat.label}</p>
              <p className="text-gray-500 text-sm">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Awards Section */}
      <div className="bg-indigo-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Awards & Recognition</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our commitment to excellence has been recognized by leading organizations in the education and technology sectors.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {awards.map((award, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  {award.icon}
                  <span className="ml-2 text-lg font-bold text-gray-700">{award.year}</span>
                </div>
                <h3 className="font-semibold text-lg mb-1">{award.title}</h3>
                <p className="text-gray-500">{award.organization}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="max-w-6xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">What Sets Us Apart</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our innovative features create an unparalleled learning experience for students and administrators.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {keyFeatures.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">What Our Clients Say</h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Hear from educators and organizations that have transformed their learning environments with our platform.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 relative">
            <div className="absolute -top-5 left-10 bg-yellow-400 rounded-full p-3">
              <Star className="text-white" size={24} />
            </div>
            <div className="mb-8">
              <p className="text-xl md:text-2xl font-medium text-gray-700 italic">
                "{testimonials[currentTestimonial].quote}"
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-800">{testimonials[currentTestimonial].author}</p>
                <p className="text-gray-600">{testimonials[currentTestimonial].position}</p>
                <p className="text-gray-500">{testimonials[currentTestimonial].organization}</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={prevTestimonial}
                  className="bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                </button>
                <button 
                  onClick={nextTestimonial}
                  className="bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Metrics */}
      <div className="max-w-6xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Measurable Results</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform delivers concrete improvements in key educational metrics.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {impactMetrics.map((metric, index) => (
            <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl text-center">
              <p className="text-4xl font-bold text-blue-700 mb-3">{metric.value}</p>
              <p className="text-gray-700">{metric.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Learning Experience?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of institutions that have elevated their educational offerings with our platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-4 rounded-lg transition-colors">
              Schedule a Demo
            </button>
            <button className="bg-transparent border border-white text-white hover:bg-white hover:text-gray-900 font-medium px-8 py-4 rounded-lg transition-colors">
              View Pricing Plans
            </button>
          </div>
        </div>
      </div>
     
    </div>
    </div>
  );
}