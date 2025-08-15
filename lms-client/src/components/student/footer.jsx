import { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube, 
  ChevronRight, 
  Send, 
  BookOpen, 
  Award, 
  Users, 
  Clock
} from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);
  
  // Trigger animation when component is in view
  const handleIntersection = (entries) => {
    if (entries[0].isIntersecting) {
      setAnimateStats(true);
    }
  };
  
  // Set up intersection observer when component mounts
  useState(() => {
    const observer = new IntersectionObserver(handleIntersection, { threshold: 0.2 });
    const footerStats = document.getElementById('footer-stats');
    if (footerStats) observer.observe(footerStats);
    
    return () => {
      if (footerStats) observer.unobserve(footerStats);
    };
  }, []);
  
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim() !== '') {
      setIsSubscribed(true);
      setEmail('');
      // In a real app, you would send this to your API
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };
  
  const stats = [
    { icon: <BookOpen size={24} />, value: '200+', label: 'Courses' },
    { icon: <Users size={24} />, value: '15,000+', label: 'Students' },
    { icon: <Award size={24} />, value: '99%', label: 'Success Rate' },
    { icon: <Clock size={24} />, value: '24/7', label: 'Support' }
  ];
  
  const resources = [
    'Courses Catalog', 
    'Career Paths', 
    'Student Success', 
    'Certifications', 
    'Free Resources'
  ];
  
  const company = [
    'About Us', 
    'Our Team', 
    'Partnerships', 
    'Careers', 
    'Contact Us'
  ];
  
  const legal = [
    'Terms of Service', 
    'Privacy Policy', 
    'Cookie Policy', 
    'GDPR Compliance', 
    'Accessibility'
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200">
      {/* Stats Section */}
      {/* <div 
        id="footer-stats" 
        className="max-w-7xl mx-auto px-4 pb-12 grid grid-cols-2 md:grid-cols-4 gap-8"
      >
        {stats.map((stat, index) => (
          <div 
            key={index}
            className={`flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all transform ${
              animateStats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: `${index * 150}ms`, transitionDuration: '500ms' }}
          >
            <div className="mb-3 text-blue-500">{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div> */}
      
      {/* Main Footer Content */}
      <div className="border-t border-gray-200 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                V
              </div>
              <div className="ml-3 text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Vivaaks LMS
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Empowering learners worldwide with accessible, high-quality education for personal and professional growth.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <Mail size={16} className="mr-3" />
                <span>contact@Vivaaks.edu</span>
              </div>
              <div className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <Phone size={16} className="mr-3" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <MapPin size={16} className="mr-3" />
                <span>123 Learning Ave, Education City</span>
              </div>
            </div>
          </div>
          
          {/* Resources Column */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-6 text-gray-800">Resources</h3>
            <ul className="space-y-3">
              {resources.map((item, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors group"
                  >
                    <ChevronRight size={16} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company Column */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-6 text-gray-800">Company</h3>
            <ul className="space-y-3">
              {company.map((item, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors group"
                  >
                    <ChevronRight size={16} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Newsletter Column */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-6 text-gray-800">Stay Updated</h3>
            <p className="text-gray-600 mb-4">
              Subscribe to our newsletter for the latest courses, updates, and educational resources.
            </p>
            
            <form onSubmit={handleSubscribe} className="mb-6">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                  required
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-1.5 rounded-md hover:shadow-md transition-all"
                  aria-label="Subscribe"
                >
                  <Send size={18} />
                </button>
              </div>
              {isSubscribed && (
                <p className="text-green-600 mt-2 text-sm">Thanks for subscribing!</p>
              )}
            </form>
            
            {/* Social Media Icons */}
            <div>
              <h4 className="text-sm font-semibold mb-3 text-gray-800">Follow Us</h4>
              <div className="flex space-x-3">
                <a 
                  href="#" 
                  className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all"
                  aria-label="Facebook"
                >
                  <Facebook size={18} />
                </a>
                <a 
                  href="#" 
                  className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all"
                  aria-label="Twitter"
                >
                  <Twitter size={18} />
                </a>
                <a 
                  href="#" 
                  className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-purple-100 hover:text-purple-600 transition-all"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
                <a 
                  href="#" 
                  className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
                <a 
                  href="#" 
                  className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-red-100 hover:text-red-600 transition-all"
                  aria-label="YouTube"
                >
                  <Youtube size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Footer */}
      <div className="border-t border-gray-200 pt-6 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex flex-wrap justify-center md:justify-start mb-4 md:mb-0">
              {legal.map((item, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="text-sm text-gray-500 hover:text-blue-600 mr-4 mb-2 md:mb-0 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
            <p className="text-sm text-gray-500 text-center md:text-right">
              © {new Date().getFullYear()} Vivaaks LMS. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}