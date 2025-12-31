import React, { useState, useMemo } from 'react';
import { 
  Settings, Shield, Bell, Lock, UserCog, 
  Activity, Database, Download, Upload, RefreshCw,
  Save, AlertCircle, CheckCircle, XCircle, Users
} from 'lucide-react';

const AdminPanel = ({ donors = [], onExport, onImport, onRefresh }) => {
  const [settings, setSettings] = useState({
    autoApprove: false,
    sendNotifications: true,
    requireVerification: true,
    backupFrequency: 'daily',
    maxDonorsPerPage: 10,
    dataRetention: 30,
    emergencyMode: false
  });

  const [activeTab, setActiveTab] = useState('general');
  const [backupStatus, setBackupStatus] = useState(null);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const pending = donors.filter(d => d.status === 'pending').length;
    const approved = donors.filter(d => d.status === 'approved').length;
    const todayRegistrations = donors.filter(d => 
      new Date(d.registeredAt).toDateString() === today
    ).length;
    
    const cities = [...new Set(donors.map(d => d.city))];
    const bloodTypes = [...new Set(donors.map(d => d.bloodType))];

    return {
      total: donors.length,
      pending,
      approved,
      todayRegistrations,
      cities: cities.length,
      bloodTypes: bloodTypes.length
    };
  }, [donors]);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleBackup = async () => {
    setIsBackingUp(true);
    try {
      // Simulate backup process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const backupData = {
        donors,
        settings,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      };
      
      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: 'application/json'
      });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `blood-bank-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      setBackupStatus({
        type: 'success',
        message: 'Backup completed successfully!'
      });
    } catch (error) {
      setBackupStatus({
        type: 'error',
        message: 'Backup failed. Please try again.'
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestoreDefaults = () => {
    if (window.confirm('Are you sure you want to restore all settings to default?')) {
      setSettings({
        autoApprove: false,
        sendNotifications: true,
        requireVerification: true,
        backupFrequency: 'daily',
        maxDonorsPerPage: 10,
        dataRetention: 30,
        emergencyMode: false
      });
      
      setBackupStatus({
        type: 'info',
        message: 'Settings restored to default'
      });
    }
  };

  const handleEmergencyModeToggle = () => {
    const newMode = !settings.emergencyMode;
    handleSettingChange('emergencyMode', newMode);
    
    setBackupStatus({
      type: 'warning',
      message: newMode 
        ? '🚨 Emergency Mode Activated - All donors notified' 
        : 'Emergency Mode Deactivated'
    });
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <Settings className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'data', label: 'Data Management', icon: <Database className="w-4 h-4" /> },
    { id: 'system', label: 'System', icon: <Activity className="w-4 h-4" /> }
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">General Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium text-gray-700">Auto-approve Donors</label>
                    <p className="text-sm text-gray-500">Automatically approve new registrations</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('autoApprove', !settings.autoApprove)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      settings.autoApprove ? 'bg-green-500' : 'bg-gray-300'
                    } transition-colors`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.autoApprove ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium text-gray-700">Require Verification</label>
                    <p className="text-sm text-gray-500">Require phone/email verification</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('requireVerification', !settings.requireVerification)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      settings.requireVerification ? 'bg-blue-500' : 'bg-gray-300'
                    } transition-colors`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.requireVerification ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div>
                  <label className="font-medium text-gray-700 mb-2 block">Donors Per Page</label>
                  <select
                    value={settings.maxDonorsPerPage}
                    onChange={(e) => handleSettingChange('maxDonorsPerPage', parseInt(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Security Settings</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800">Emergency Mode</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        When enabled, all donors will be notified of urgent blood requirements
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <button
                      onClick={handleEmergencyModeToggle}
                      className={`w-full py-3 rounded-lg font-semibold transition-all ${
                        settings.emergencyMode
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      {settings.emergencyMode ? '🚨 Emergency Mode Active' : 'Activate Emergency Mode'}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Session Timeout</div>
                      <div className="text-sm text-gray-500">Auto-logout after inactivity</div>
                    </div>
                    <span className="font-semibold">30 min</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Password Policy</div>
                      <div className="text-sm text-gray-500">Strong passwords required</div>
                    </div>
                    <span className="text-green-600 font-semibold">Enabled</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">IP Whitelist</div>
                      <div className="text-sm text-gray-500">Restrict admin access</div>
                    </div>
                    <span className="text-gray-500">Disabled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium text-gray-700">Email Notifications</label>
                    <p className="text-sm text-gray-500">Send email notifications to donors</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('sendNotifications', !settings.sendNotifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      settings.sendNotifications ? 'bg-green-500' : 'bg-gray-300'
                    } transition-colors`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.sendNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-medium text-gray-700">Donation Reminders</label>
                    <select className="w-full border rounded-lg px-3 py-2">
                      <option value="7">7 days before</option>
                      <option value="14">14 days before</option>
                      <option value="30">30 days before</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="font-medium text-gray-700">Urgent Need Alerts</label>
                    <select className="w-full border rounded-lg px-3 py-2">
                      <option value="immediate">Immediately</option>
                      <option value="daily">Daily Digest</option>
                      <option value="weekly">Weekly Summary</option>
                    </select>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Notification Templates</h4>
                  <div className="space-y-3">
                    <button className="w-full text-left p-3 bg-white rounded-lg border hover:bg-blue-50">
                      <div className="font-medium">Welcome Email</div>
                      <div className="text-sm text-gray-600">Sent to new donors</div>
                    </button>
                    
                    <button className="w-full text-left p-3 bg-white rounded-lg border hover:bg-blue-50">
                      <div className="font-medium">Donation Reminder</div>
                      <div className="text-sm text-gray-600">Sent before donation eligibility</div>
                    </button>
                    
                    <button className="w-full text-left p-3 bg-white rounded-lg border hover:bg-blue-50">
                      <div className="font-medium">Emergency Alert</div>
                      <div className="text-sm text-gray-600">Urgent blood requirement</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Management</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="font-medium text-gray-700 mb-2 block">Backup Frequency</label>
                  <select
                    value={settings.backupFrequency}
                    onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="hourly">Every Hour</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="manual">Manual Only</option>
                  </select>
                </div>
                
                <div>
                  <label className="font-medium text-gray-700 mb-2 block">Data Retention</label>
                  <select
                    value={settings.dataRetention}
                    onChange={(e) => handleSettingChange('dataRetention', parseInt(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value={7}>7 days</option>
                    <option value={30}>30 days</option>
                    <option value={90}>90 days</option>
                    <option value={365}>1 year</option>
                    <option value={0}>Forever</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">How long to keep donor records</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={handleBackup}
                    disabled={isBackingUp}
                    className="flex items-center justify-center gap-2 p-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-100 disabled:opacity-50"
                  >
                    {isBackingUp ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Download className="w-5 h-5" />
                    )}
                    {isBackingUp ? 'Creating Backup...' : 'Create Backup'}
                  </button>
                  
                  <button
                    onClick={() => onImport && onImport()}
                    className="flex items-center justify-center gap-2 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 hover:bg-green-100"
                  >
                    <Upload className="w-5 h-5" />
                    Import Data
                  </button>
                </div>
                
                {backupStatus && (
                  <div className={`p-4 rounded-lg ${
                    backupStatus.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' :
                    backupStatus.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' :
                    backupStatus.type === 'warning' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                    'bg-blue-50 text-blue-700 border-blue-200'
                  } border`}>
                    <div className="flex items-center gap-2">
                      {backupStatus.type === 'success' && <CheckCircle className="w-5 h-5" />}
                      {backupStatus.type === 'error' && <XCircle className="w-5 h-5" />}
                      {backupStatus.type === 'warning' && <AlertCircle className="w-5 h-5" />}
                      <span>{backupStatus.message}</span>
                    </div>
                  </div>
                )}
                
                <div className="pt-6 border-t">
                  <h4 className="font-semibold text-gray-800 mb-3">Danger Zone</h4>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        if (window.confirm('This will delete all donor data. This action cannot be undone.')) {
                          localStorage.removeItem('bloodDonors');
                          onRefresh && onRefresh();
                        }
                      }}
                      className="w-full p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 hover:bg-red-100 text-left"
                    >
                      <div className="font-medium">Delete All Data</div>
                      <div className="text-sm">Permanently remove all donor records</div>
                    </button>
                    
                    <button
                      onClick={handleRestoreDefaults}
                      className="w-full p-3 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-200 hover:bg-yellow-100 text-left"
                    >
                      <div className="font-medium">Restore Default Settings</div>
                      <div className="text-sm">Reset all settings to default values</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'system':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">System Information</h3>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">Total Donors</div>
                    <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">Pending Approvals</div>
                    <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">Approved Donors</div>
                    <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">Today's Registrations</div>
                    <div className="text-2xl font-bold text-blue-600">{stats.todayRegistrations}</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">System Version</div>
                      <div className="text-sm text-gray-500">Blood Bank Management System</div>
                    </div>
                    <span className="font-semibold">v1.0.0</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Last Backup</div>
                      <div className="text-sm text-gray-500">System data backup</div>
                    </div>
                    <span className="text-gray-600">2 hours ago</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Storage Used</div>
                      <div className="text-sm text-gray-500">Local storage usage</div>
                    </div>
                    <span className="text-gray-600">{(stats.total * 2).toFixed(1)} KB</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Cities Covered</div>
                      <div className="text-sm text-gray-500">Active cities in system</div>
                    </div>
                    <span className="font-semibold text-blue-600">{stats.cities}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <button
                    onClick={() => onRefresh && onRefresh()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh System Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
          <p className="text-gray-600">Manage system settings and configurations</p>
        </div>
        
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            settings.emergencyMode 
              ? 'bg-red-100 text-red-700' 
              : 'bg-green-100 text-green-700'
          }`}>
            {settings.emergencyMode ? '🚨 Emergency Mode' : '🟢 System Normal'}
          </span>
          
          <button
            onClick={() => {
              // Save settings
              localStorage.setItem('adminSettings', JSON.stringify(settings));
              setBackupStatus({
                type: 'success',
                message: 'Settings saved successfully!'
              });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500" />
            <div>
              <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
              <div className="text-sm text-gray-500">Total Donors</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-green-500" />
            <div>
              <div className="text-2xl font-bold text-gray-800">{stats.todayRegistrations}</div>
              <div className="text-sm text-gray-500">Today's Registrations</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Database className="w-8 h-8 text-purple-500" />
            <div>
              <div className="text-2xl font-bold text-gray-800">{stats.cities}</div>
              <div className="text-sm text-gray-500">Cities</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-red-500" />
            <div>
              <div className="text-2xl font-bold text-gray-800">{stats.bloodTypes}</div>
              <div className="text-sm text-gray-500">Blood Types</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Panel */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

AdminPanel.defaultProps = {
  donors: [],
  settings: {}
};

export default AdminPanel;