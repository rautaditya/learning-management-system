import React, { useEffect, useState } from "react";
import { Users, BookOpen, Award, ChevronRight, Sparkles, GraduationCap, Code, ArrowRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';
export default function About() {
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    setAnimate(true);
  }, []);

  const stats = [
    { icon: <Users />, value: "10,000+", label: "Active Students" },
    { icon: <BookOpen />, value: "500+", label: "Courses" },
    { icon: <Award />, value: "98%", label: "Satisfaction Rate" }
  ];

  const teamMembers = [
    { name: "Vaishali Suryavanshi", role: "Founder & CEO", image: "/api/placeholder/400/400" },
    { name: "Vaishali Suryavanshi", role: "Founder & CEO", image: "/api/placeholder/400/400" },
    { name: "Vaishali Suryavanshi", role: "Founder & CEO", image: "/api/placeholder/400/400" }
  ];

  return (
   <>
     <div className="bg-gradient-to-b from-slate-50 to-blue-50 min-h-screen">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 py-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/api/placeholder/1200/600')] mix-blend-overlay opacity-10"></div>
          
          {/* Animated shapes */}
          <div className={`absolute top-10 left-10 w-32 h-32 rounded-full bg-indigo-400 opacity-20 transition-all duration-1000 ${animate ? 'scale-100' : 'scale-0'}`} 
               style={{animation: "float 15s infinite ease-in-out"}}></div>
          <div className={`absolute bottom-20 right-20 w-48 h-48 rounded-full bg-purple-400 opacity-20 transition-all duration-1000 delay-300 ${animate ? 'scale-100' : 'scale-0'}`}
               style={{animation: "float 18s infinite ease-in-out reverse"}}></div>
          <div className={`absolute top-40 right-60 w-20 h-20 rounded-full bg-blue-300 opacity-30 transition-all duration-1000 delay-500 ${animate ? 'scale-100' : 'scale-0'}`}
               style={{animation: "float 12s infinite ease-in-out"}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className={`text-center transition-all duration-1000 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 mt-10">Transforming Education Together</h1>
            <p className="text-xl max-w-3xl mx-auto mb-8">We're on a mission to make quality education accessible, engaging, and effective for everyone through innovative learning solutions.</p>
            <button onClick={() => navigate('/courses')}className="bg-white text-indigo-600 font-medium px-6 py-3 rounded-lg flex items-center gap-2 mx-auto hover:bg-opacity-90 transition-all">
              Explore Our Courses <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-6 transition-all duration-700 ${animate ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
              <Sparkles size={28} />
            </div>
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 transition-all duration-700 delay-100 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>Our Mission</h2>
            <p className={`text-lg text-gray-600 max-w-3xl mx-auto transition-all duration-700 delay-200 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              At EduLearn, we believe in the transformative power of education. Our platform is designed to break down barriers to learning, 
              foster meaningful connections between educators and students, and provide innovative tools that make teaching and learning more effective.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`bg-white rounded-xl shadow-md p-8 text-center flex flex-col items-center transition-all duration-700 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{transitionDelay: `${300 + index * 100}ms`}}
              >
                <div className="text-indigo-600 mb-4">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 ${animate ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2020, EduLearn began with a simple idea: to make quality education accessible to everyone, 
                regardless of location or background.
              </p>
              <p className="text-gray-600 mb-4">
                What started as a small team with big dreams has grown into a global platform serving thousands of 
                educators and learners across the world.
              </p>
              <p className="text-gray-600">
                Through continuous innovation and a deep commitment to our users, we've evolved our platform to 
                meet the changing needs of modern education while staying true to our core mission.
              </p>
            </div>
            <div className={`relative transition-all duration-1000 ${animate ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
              <div className="rounded-xl overflow-hidden shadow-xl">
                <img src="/api/placeholder/600/400" alt="Our team working together" className="w-full h-auto" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-indigo-600 text-white p-6 rounded-lg shadow-md">
                <p className="text-xl font-bold">Since 2020</p>
                <p>Empowering educators & learners</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 transition-all duration-700 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>Our Core Values</h2>
            <p className={`text-lg text-gray-600 max-w-3xl mx-auto transition-all duration-700 delay-100 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              These principles guide everything we do and are at the heart of our approach to transforming education.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <GraduationCap size={32} />,
                title: "Accessible Learning",
                description: "We believe education should be available to everyone, regardless of location or background."
              },
              {
                icon: <Sparkles size={32} />,
                title: "Innovation",
                description: "We continuously explore new technologies and methodologies to enhance the learning experience."
              },
              {
                icon: <Users size={32} />,
                title: "Community",
                description: "We foster meaningful connections between educators and learners across the globe."
              }
            ].map((value, index) => (
              <div 
                key={index}
                className={`bg-white rounded-xl shadow-md p-8 transition-all duration-700 hover:shadow-lg hover:-translate-y-1 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{transitionDelay: `${300 + index * 100}ms`}}
              >
                <div className="text-indigo-600 mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Meet Our Team Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 transition-all duration-700 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>Meet Our Team</h2>
            <p className={`text-lg text-gray-600 max-w-3xl mx-auto transition-all duration-700 delay-100 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              The passionate people behind EduLearn who work tirelessly to transform education.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-700 hover:shadow-lg hover:-translate-y-1 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{transitionDelay: `${300 + index * 100}ms`}}
              >
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTy6rhASBVTUuV6ZfAHC4iJEyWOnz9KLXc6Bw&s" alt={member.name} className="w-full h-66 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-indigo-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 transition-all duration-700 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>Ready to Transform Your Learning Experience?</h2>
          <p className={`text-xl max-w-3xl mx-auto mb-8 transition-all duration-700 delay-100 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Join thousands of educators and learners who are already using EduLearn to achieve their educational goals.
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-200 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <button onClick={() => navigate('/courses')}className="bg-white text-indigo-600 font-medium px-8 py-3 rounded-lg flex items-center gap-2 justify-center hover:bg-opacity-90 transition-all">
              Get Started Free <ArrowRight size={18} />
            </button>
            <button className="bg-transparent border-2 border-white font-medium px-8 py-3 rounded-lg flex items-center gap-2 justify-center hover:bg-white hover:bg-opacity-10 transition-all">
              Schedule a Demo
            </button>
          </div>
        </div>
      </div>

      
      
    </div>
   </>
  );
}