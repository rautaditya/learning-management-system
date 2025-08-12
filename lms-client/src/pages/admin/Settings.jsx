import { useState } from 'react';
import { Save, Bell, Lock, Globe, Users, Mail, ChevronRight, Moon, Sun } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    mobile: false,
  });
  
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'My Learning Platform',
    siteDescription: 'A comprehensive learning management system',
    language: 'english',
    timezone: 'UTC-05:00',
  });
  
  const [security, setSecurity] = useState({
    twoFactor: false,
    passwordExpiry: '90',
    sessionTimeout: '30',
  });
  
  const handleNotificationChange = (type) => {
    setNotifications({
      ...notifications,
      [type]: !notifications[type],
    });
  };
  
  const handleGeneralChange = (field, value) => {
    setGeneralSettings({
      ...generalSettings,
      [field]: value,
    });
  };
  
  const handleSecurityChange = (field, value) => {
    setSecurity({
      ...security,
      [field]: value,
    });
  };
  
  const saveSettings = () => {
    // In a real application, this would save to a backend
    alert('Settings saved successfully!');
  };
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      {/* Header */}
      <header className={`py-4 px-6 flex justify-between items-center border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        <h1 className="text-2xl font-bold">Admin Settings</h1>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700'}`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={saveSettings}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </header>
      
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className={`w-full md:w-64 p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <nav>
            <ul className="space-y-1">
              <li>
                <button 
                  onClick={() => setActiveTab('general')}
                  className={`w-full flex items-center justify-between p-3 rounded ${activeTab === 'general' ? 
                    (darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-800') : 
                    (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
                >
                  <div className="flex items-center">
                    <Globe size={18} className="mr-3" />
                    <span>General</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center justify-between p-3 rounded ${activeTab === 'notifications' ? 
                    (darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-800') : 
                    (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
                >
                  <div className="flex items-center">
                    <Bell size={18} className="mr-3" />
                    <span>Notifications</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center justify-between p-3 rounded ${activeTab === 'security' ? 
                    (darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-800') : 
                    (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
                >
                  <div className="flex items-center">
                    <Lock size={18} className="mr-3" />
                    <span>Security</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('users')}
                  className={`w-full flex items-center justify-between p-3 rounded ${activeTab === 'users' ? 
                    (darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-800') : 
                    (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
                >
                  <div className="flex items-center">
                    <Users size={18} className="mr-3" />
                    <span>User Management</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('email')}
                  className={`w-full flex items-center justify-between p-3 rounded ${activeTab === 'email' ? 
                    (darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-800') : 
                    (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
                >
                  <div className="flex items-center">
                    <Mail size={18} className="mr-3" />
                    <span>Email Settings</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
              </li>
            </ul>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">General Settings</h2>
              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Site Name</label>
                    <input 
                      type="text" 
                      value={generalSettings.siteName}
                      onChange={(e) => handleGeneralChange('siteName', e.target.value)}
                      className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Site Description</label>
                    <textarea 
                      value={generalSettings.siteDescription}
                      onChange={(e) => handleGeneralChange('siteDescription', e.target.value)}
                      className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                      rows="3"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Language</label>
                      <select 
                        value={generalSettings.language}
                        onChange={(e) => handleGeneralChange('language', e.target.value)}
                        className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                      >
                        <option value="english">English</option>
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                        <option value="german">German</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Timezone</label>
                      <select 
                        value={generalSettings.timezone}
                        onChange={(e) => handleGeneralChange('timezone', e.target.value)}
                        className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                      >
                        <option value="UTC-12:00">UTC-12:00</option>
                        <option value="UTC-08:00">UTC-08:00 (Pacific Time)</option>
                        <option value="UTC-05:00">UTC-05:00 (Eastern Time)</option>
                        <option value="UTC+00:00">UTC+00:00 (GMT)</option>
                        <option value="UTC+01:00">UTC+01:00 (Central European Time)</option>
                        <option value="UTC+05:30">UTC+05:30 (Indian Standard Time)</option>
                        <option value="UTC+08:00">UTC+08:00 (China Standard Time)</option>
                        <option value="UTC+09:00">UTC+09:00 (Japan Standard Time)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Notification Settings</h2>
              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Receive notifications via email</p>
                    </div>
                    <div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={notifications.email} onChange={() => handleNotificationChange('email')} className="sr-only peer" />
                        <div className={`w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer ${notifications.email ? 'peer-checked:bg-blue-600' : ''} peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Browser Notifications</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Receive notifications in your browser</p>
                    </div>
                    <div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={notifications.browser} onChange={() => handleNotificationChange('browser')} className="sr-only peer" />
                        <div className={`w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer ${notifications.browser ? 'peer-checked:bg-blue-600' : ''} peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Mobile Notifications</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Receive push notifications on mobile devices</p>
                    </div>
                    <div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={notifications.mobile} onChange={() => handleNotificationChange('mobile')} className="sr-only peer" />
                        <div className={`w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer ${notifications.mobile ? 'peer-checked:bg-blue-600' : ''} peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Security Settings</h2>
              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Require 2FA for all admin users</p>
                    </div>
                    <div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={security.twoFactor} onChange={() => handleSecurityChange('twoFactor', !security.twoFactor)} className="sr-only peer" />
                        <div className={`w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer ${security.twoFactor ? 'peer-checked:bg-blue-600' : ''} peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Password Expiry (days)</label>
                    <select 
                      value={security.passwordExpiry}
                      onChange={(e) => handleSecurityChange('passwordExpiry', e.target.value)}
                      className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    >
                      <option value="30">30 days</option>
                      <option value="60">60 days</option>
                      <option value="90">90 days</option>
                      <option value="180">180 days</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Session Timeout (minutes)</label>
                    <select 
                      value={security.sessionTimeout}
                      onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                      className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">60 minutes</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'users' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">User Management Settings</h2>
              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
                <p className="mb-4">This is where user management settings would appear.</p>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
                  Manage Users
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'email' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Email Settings</h2>
              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">SMTP Server</label>
                    <input 
                      type="text" 
                      placeholder="smtp.example.com"
                      className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">SMTP Port</label>
                      <input 
                        type="text" 
                        placeholder="587"
                        className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Encryption</label>
                      <select 
                        className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                      >
                        <option>TLS</option>
                        <option>SSL</option>
                        <option>None</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">From Email</label>
                    <input 
                      type="email" 
                      placeholder="no-reply@example.com"
                      className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <button className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded">
                      Test Connection
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
