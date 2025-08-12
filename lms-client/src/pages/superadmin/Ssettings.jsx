import { useState } from 'react';
import {
  Settings,
  User,
  Shield,
  Bell,
  Mail,
  Globe,
  Database,
  Lock,
  Save,
  RefreshCw,
  HardDrive,
  Cloud,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export default function SuperadminSettings() {
  // State for general settings
  const [siteName, setSiteName] = useState('EduManage Pro');
  const [siteDescription, setSiteDescription] = useState('Advanced Educational Institution Management System');
  const [supportEmail, setSupportEmail] = useState('support@edumanagepro.com');
  
  // State for notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [maintenanceAlerts, setMaintenanceAlerts] = useState(false);
  
  // State for security settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [passwordExpiry, setPasswordExpiry] = useState('90');
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [ipRestriction, setIpRestriction] = useState(false);
  
  // State for system settings
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('daily');

  // State for success message
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Handle save settings
  const handleSaveSettings = () => {
    // In a real application, this would save settings to your backend
    console.log('Settings saved');
    
    // Show success message
    setShowSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };
  
  // Handle system action - backup now
  const handleBackupNow = () => {
    alert('System backup initiated. This may take a few minutes.');
  };
  
  // Handle system action - clear cache
  const handleClearCache = () => {
    alert('System cache cleared successfully.');
  };

  return (
    <div className="p-6 ml-20 md:ml-64">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">System Settings</h1>
        <p className="text-gray-600">Configure system-wide settings and preferences</p>
      </div>

      {/* Success message */}
      {showSuccess && (
        <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded flex items-center">
          <CheckCircle size={20} className="mr-2" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <Settings size={20} className="text-purple-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-800">General Settings</h2>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Name
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Description
              </label>
              <input
                type="text"
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Support Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                System Language
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                defaultValue="en"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
                <option value="ja">Japanese</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Notification Settings Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <Bell size={20} className="text-purple-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-800">Notification Settings</h2>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailNotifications"
                checked={emailNotifications}
                onChange={() => setEmailNotifications(!emailNotifications)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                Email Notifications
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="securityAlerts"
                checked={securityAlerts}
                onChange={() => setSecurityAlerts(!securityAlerts)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="securityAlerts" className="ml-2 block text-sm text-gray-700">
                Security Alerts
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="weeklyReports"
                checked={weeklyReports}
                onChange={() => setWeeklyReports(!weeklyReports)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="weeklyReports" className="ml-2 block text-sm text-gray-700">
                Weekly Summary Reports
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="maintenanceAlerts"
                checked={maintenanceAlerts}
                onChange={() => setMaintenanceAlerts(!maintenanceAlerts)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="maintenanceAlerts" className="ml-2 block text-sm text-gray-700">
                Maintenance Alerts
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notification Email Template
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                defaultValue="default"
              >
                <option value="default">Default Template</option>
                <option value="minimal">Minimal Design</option>
                <option value="modern">Modern Design</option>
                <option value="corporate">Corporate Design</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Security Settings Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <Shield size={20} className="text-purple-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-800">Security Settings</h2>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="twoFactorAuth"
                checked={twoFactorAuth}
                onChange={() => setTwoFactorAuth(!twoFactorAuth)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="twoFactorAuth" className="ml-2 block text-sm text-gray-700">
                Require Two-Factor Authentication
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password Expiry (Days)
              </label>
              <input
                type="number"
                value={passwordExpiry}
                onChange={(e) => setPasswordExpiry(e.target.value)}
                min="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="mt-1 text-xs text-gray-500">Set to 0 for no expiry</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Session Timeout (Minutes)
              </label>
              <input
                type="number"
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                min="5"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="ipRestriction"
                checked={ipRestriction}
                onChange={() => setIpRestriction(!ipRestriction)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="ipRestriction" className="ml-2 block text-sm text-gray-700">
                Enable IP Address Restrictions
              </label>
            </div>
          </div>
        </div>
        
        {/* System Settings Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <Database size={20} className="text-purple-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-800">System Settings</h2>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="maintenanceMode"
                checked={maintenanceMode}
                onChange={() => setMaintenanceMode(!maintenanceMode)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-700">
                Enable Maintenance Mode
              </label>
              {maintenanceMode && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                  <AlertTriangle size={12} className="mr-1" />
                  Active
                </span>
              )}
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="debugMode"
                checked={debugMode}
                onChange={() => setDebugMode(!debugMode)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="debugMode" className="ml-2 block text-sm text-gray-700">
                Enable Debug Mode
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoBackup"
                checked={autoBackup}
                onChange={() => setAutoBackup(!autoBackup)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="autoBackup" className="ml-2 block text-sm text-gray-700">
                Enable Automatic Backups
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Backup Frequency
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={backupFrequency}
                onChange={(e) => setBackupFrequency(e.target.value)}
                disabled={!autoBackup}
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleBackupNow}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <HardDrive size={16} className="mr-2" />
                Backup Now
              </button>
              
              <button
                onClick={handleClearCache}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <RefreshCw size={16} className="mr-2" />
                Clear Cache
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Save Changes Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <Save size={18} className="mr-2" />
          Save All Settings
        </button>
      </div>
      
      {/* Version Info */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>EduManage Pro v2.5.3</p>
        <p>Last updated: May 5, 2025</p>
      </div>
    </div>
  );
}