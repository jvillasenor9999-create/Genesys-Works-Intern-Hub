import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Shield, 
  Database, 
  Sliders, 
  Key, 
  Lock, 
  Unlock, 
  RefreshCw, 
  AlertTriangle, 
  ChevronRight, 
  UserCheck, 
  Laptop, 
  Smartphone, 
  Activity, 
  Layers, 
  CheckCircle2, 
  Briefcase,
  Flame,
  Plus,
  Trash2,
  Info
} from 'lucide-react';
import { UserRole, UserPermissions } from '../../types';
import PlatformDashboard from './PlatformDashboard';

interface SettingsViewProps {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  permissions: UserPermissions;
  setPermissions: React.Dispatch<React.SetStateAction<UserPermissions>>;
  userNickname: string;
  setUserNickname: (name: string) => void;
  userHardwarePreference: string;
  setUserHardwarePreference: (hw: string) => void;
  userMentorPreference: string;
  setUserMentorPreference: (mentor: string) => void;
  onResetWorkspace: () => void;
  onClearTasks: () => void;
  onLoadPresetTasks: (presetType: 'sprint' | 'ops' | 'minimal') => void;
  triggerToast: (msg: string) => void;
  activeSubTab?: 'profile' | 'permissions' | 'admin-access' | 'database' | 'platform';
  setActiveSubTab?: (subTab: 'profile' | 'permissions' | 'admin-access' | 'database' | 'platform') => void;
}

export default function SettingsView({
  userRole,
  setUserRole,
  permissions,
  setPermissions,
  userNickname,
  setUserNickname,
  userHardwarePreference,
  setUserHardwarePreference,
  userMentorPreference,
  setUserMentorPreference,
  onResetWorkspace,
  onClearTasks,
  onLoadPresetTasks,
  triggerToast,
  activeSubTab: activeSubTabProp,
  setActiveSubTab: setActiveSubTabProp
}: SettingsViewProps) {
  const [localSubTab, setLocalSubTab] = useState<'profile' | 'permissions' | 'admin-access' | 'database' | 'platform'>('profile');
  const activeSubTab = activeSubTabProp || localSubTab;
  const setActiveSubTab = setActiveSubTabProp || setLocalSubTab;
  
  // Local state for administrative staff table simulator
  const [admins, setAdmins] = useState<{ id: string; name: string; email: string; role: string; lastActive: string }[]>([
    { id: '1', name: 'Marcus Chen', email: 'm.chen@genesysworks.org', role: 'Data & Analytics Mentor', lastActive: '2 mins ago' },
    { id: '2', name: 'David Park', email: 'd.park@genesysworks.org', role: 'CX & Operations Leader', lastActive: '1 hour ago' },
    { id: '3', name: 'Sarah Anderson', email: 's.anderson@genesysworks.org', role: 'Senior Program Director', lastActive: 'Yesterday' }
  ]);
  
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('Senior Mentor');

  // Audit Logs database simulator
  const [auditLogs, setAuditLogs] = useState<{ id: string; timestamp: string; action: string; category: string; user: string }[]>([
    { id: '1', timestamp: '18:25:32', action: 'Modified System Settings page layout', category: 'SYSTEM', user: 'Alex Rivera' },
    { id: '2', timestamp: '18:12:11', action: 'Claimed Project Opportunity: PowerBI Visualization templates', category: 'BOARD', user: 'Alex Rivera' },
    { id: '3', timestamp: '17:45:00', action: 'Restored onboarding database list to primary cohort parameters', category: 'RESET', user: 'System Supervisor' }
  ]);

  const addAuditLog = (action: string, category: string) => {
    const timestamp = new Date().toTimeString().split(' ')[0];
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp,
      action,
      category,
      user: userRole === 'admin' ? 'Administrator' : userNickname
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    addAuditLog(`Swapped active workspace simulation role to ${role.toUpperCase()}`, 'SECURITY');
    triggerToast(`Simulation role switched to: ${role === 'admin' ? 'Administrator' : 'Intern'}`);
  };

  const handleTogglePermission = (key: keyof UserPermissions) => {
    if (userRole !== 'admin') {
      triggerToast('Blocked: Changing permissions requires simulated Administrator role!');
      return;
    }

    setPermissions(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      addAuditLog(`Toggled system permission: ${key} to ${updated[key]}`, 'PERMISSION');
      triggerToast(`Permission updated! ${key} is now ${updated[key] ? 'ENABLED' : 'DISABLED'}`);
      return updated;
    });
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName.trim() || !newAdminEmail.trim()) return;

    if (userRole !== 'admin') {
      triggerToast('Blocked: Administrator simulated role required to add supervisors!');
      return;
    }

    const newAdmin = {
      id: `admin-${Date.now()}`,
      name: newAdminName,
      email: newAdminEmail,
      role: newAdminRole,
      lastActive: 'Just now'
    };

    setAdmins(prev => [...prev, newAdmin]);
    addAuditLog(`Added supervising administrator: ${newAdmin.name}`, 'SECURITY');
    triggerToast(`Supervisor registered: ${newAdmin.name}`);
    setNewAdminName('');
    setNewAdminEmail('');
  };

  const handleRemoveAdmin = (id: string, name: string) => {
    if (userRole !== 'admin') {
      triggerToast('Blocked: Simulated Admin role required to delete supervisors!');
      return;
    }
    setAdmins(prev => prev.filter(a => a.id !== id));
    addAuditLog(`Removed supervising administrator: ${name}`, 'SECURITY');
    triggerToast(`Removed administrator: ${name}`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] select-none">
      
      {/* Settings Central Header Bar */}
      <div id="settings-view-header" className="py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/50 border-b border-[#E1E4E8] px-10">
        <div className="text-left">
          <h2 className="text-lg font-display font-bold text-wm-navy">Portal Configurations</h2>
          <p className="text-xs text-on-surface-variant font-sans mt-0.5">
            Admin overrides, personalized settings, client-side permission grids, and workspace state simulators.
          </p>
        </div>

        {/* Global Simulated Role Selector */}
        <div className="flex items-center gap-3 shrink-0 bg-[#E1E4E8]/50 p-1 rounded-lg border border-[#cfd4da]">
          <span className="text-[10px] font-mono font-bold uppercase text-on-surface-variant pl-2">My Role:</span>
          <div className="flex gap-1">
            <button
              id="simulate-intern-btn"
              onClick={() => handleRoleChange('intern')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                userRole === 'intern'
                  ? 'bg-wm-royal text-white shadow-sm'
                  : 'text-[#4c566a] hover:bg-white/40'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Intern Mode</span>
            </button>
            <button
              id="simulate-admin-btn"
              onClick={() => handleRoleChange('admin')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                userRole === 'admin'
                  ? 'bg-[#E0533C] text-white shadow-sm'
                  : 'text-[#4c566a] hover:bg-white/40'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Administrator Mode</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-[#F4F7F9] p-10 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
          
          {/* LEFT AREA: Nav Tabs (col-span-3) */}
          <div className="lg:col-span-3 flex flex-col gap-2">
            <div className="bg-white rounded-xl border border-[#E1E4E8] p-4 shadow-sm text-left">
              <span className="text-[9px] font-mono font-bold text-on-surface-variant uppercase tracking-wider block mb-3 pl-1">Configure Zones</span>
              
              <button
                id="subtab-profile"
                onClick={() => setActiveSubTab('profile')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition-all ${
                  activeSubTab === 'profile'
                    ? 'bg-[#d4e3ff] text-[#001c3a]'
                    : 'text-on-surface-variant hover:bg-neutral-100 hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 shrink-0" />
                  <span>Intern Profile & Device</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                id="subtab-permissions"
                onClick={() => setActiveSubTab('permissions')}
                className={`w-full mt-1.5 flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition-all ${
                  activeSubTab === 'permissions'
                    ? 'bg-[#d4e3ff] text-[#001c3a]'
                    : 'text-on-surface-variant hover:bg-neutral-100 hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sliders className="w-4 h-4 shrink-0" />
                  <span>Access & Permissions</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                id="subtab-admin-access"
                onClick={() => setActiveSubTab('admin-access')}
                className={`w-full mt-1.5 flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition-all ${
                  activeSubTab === 'admin-access'
                    ? 'bg-[#d4e3ff] text-[#001c3a]'
                    : 'text-on-surface-variant hover:bg-neutral-100 hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Key className="w-4 h-4 shrink-0" />
                  <span>Admins & Supervision</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                id="subtab-database"
                onClick={() => setActiveSubTab('database')}
                className={`w-full mt-1.5 flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition-all ${
                  activeSubTab === 'database'
                    ? 'bg-[#d4e3ff] text-[#001c3a]'
                    : 'text-on-surface-variant hover:bg-neutral-100 hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Database className="w-4 h-4 shrink-0" />
                  <span>Data Reset & Seeds</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {userRole === 'admin' && (
                <button
                  id="subtab-platform"
                  onClick={() => setActiveSubTab('platform')}
                  className={`w-full mt-1.5 flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold text-left transition-all border border-dashed border-[#E0533C]/20 ${
                    activeSubTab === 'platform'
                      ? 'bg-red-50 text-[#E0533C] border-solid border-[#E0533C]'
                      : 'text-[#E0533C] hover:bg-red-50 hover:text-[#C53929]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Sliders className="w-4 h-4 shrink-0 text-[#E0533C]" />
                    <span>Platform Admin Mgt</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Helper Badge Info */}
            <div className="bg-[#FAFBCF] border border-dashed border-[#E1E468] rounded-xl p-4 text-left">
              <div className="flex items-start gap-2.5 text-on-surface text-xs leading-relaxed font-sans">
                <Info className="w-4.5 h-4.5 text-shoutout-gold shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-wm-navy">Simulating Access:</span>
                  <p className="mt-1 text-[11px] text-gray-700">
                    You can toggle between <b>Intern</b> and <b>Administrator</b> modes at the top right to verify permissions routing instantly across the app's components.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT AREA: View Details Panels (col-span-9) */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* 1. Profile / Workstation Tab */}
            {activeSubTab === 'profile' && (
              <div className="bg-white border border-[#E1E4E8] rounded-xl p-6 shadow-sm text-left font-sans">
                <div className="pb-4 border-b border-[#F1F4F6] mb-6">
                  <span className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-wider">Intern Portal Settings</span>
                  <h3 className="text-base font-bold text-wm-navy mt-1">Personal Profile & Equipment Choice</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-mono text-[#005fae] uppercase font-bold">Registered Intern Nickname</label>
                    <input 
                      type="text"
                      className="w-full text-xs p-3 bg-[#FAFBCF]/10 border border-[#E1E4E8] rounded-lg focus:border-wm-royal outline-none font-sans font-medium"
                      value={userNickname}
                      onChange={(e) => {
                        setUserNickname(e.target.value);
                        addAuditLog(`Set screen name nickname to "${e.target.value}"`, 'PROFILE');
                      }}
                    />
                    <p className="text-[10px] text-on-surface-variant">This will show as your display name in lists and shoutouts.</p>
                  </div>

                  {/* Mentor buddy select */}
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-mono text-[#005fae] uppercase font-bold">Assigned Onboarding Buddy</label>
                    <select
                      className="w-full text-xs p-3 bg-white border border-[#E1E4E8] rounded-lg focus:border-wm-royal cursor-pointer outline-none font-sans font-medium"
                      value={userMentorPreference}
                      onChange={(e) => {
                        setUserMentorPreference(e.target.value);
                        addAuditLog(`Swapped mentor buddy advisor reference to "${e.target.value}"`, 'PROFILE');
                        triggerToast(`Assigned buddy changed to: ${e.target.value}`);
                      }}
                    >
                      <option value="Marcus Chen">Marcus Chen (Data & Analytics Mentor)</option>
                      <option value="David Park">David Park (Customer Experience Leader)</option>
                      <option value="Sarah Anderson">Sarah Anderson (Career Development Advisor)</option>
                    </select>
                    <p className="text-[10px] text-on-surface-variant">The designated program adviser responsible for checking milestone sheets.</p>
                  </div>

                  {/* Workstation preference */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-mono text-[#005fae] uppercase font-bold">Designated Hardwares</label>
                    <div className="flex flex-col sm:flex-row gap-4 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setUserHardwarePreference('MacBook Pro');
                          addAuditLog('Updated station equipment selection: Apple MacBook Pro', 'PROFILE');
                          triggerToast('Assigned equipment updated: MacBook Pro 14"');
                        }}
                        className={`flex-1 p-4 border rounded-xl flex items-center gap-3 transition-all ${
                          userHardwarePreference === 'MacBook Pro'
                            ? 'border-wm-royal bg-blue-50/50 text-[#001c3a] ring-2 ring-wm-royal/10'
                            : 'border-[#E1E4E8] hover:bg-neutral-50 text-on-surface-variant'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${userHardwarePreference === 'MacBook Pro' ? 'bg-wm-royal text-white' : 'bg-neutral-100 text-on-surface-variant'}`}>
                          <Laptop className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <span className="block text-xs font-bold font-display">Apple MacBook Pro 14"</span>
                          <span className="text-[10px] text-on-surface-variant font-mono">M3 Pro • 18GB Unified Memory</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setUserHardwarePreference('Lenovo ThinkPad');
                          addAuditLog('Updated station equipment selection: PC Workstation', 'PROFILE');
                          triggerToast('Assigned equipment updated: Dell/ThinkPad workstation');
                        }}
                        className={`flex-1 p-4 border rounded-xl flex items-center gap-3 transition-all ${
                          userHardwarePreference === 'Lenovo ThinkPad'
                            ? 'border-wm-royal bg-blue-50/50 text-[#001c3a] ring-2 ring-wm-royal/10'
                            : 'border-[#E1E4E8] hover:bg-neutral-50 text-on-surface-variant'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${userHardwarePreference === 'Lenovo ThinkPad' ? 'bg-wm-royal text-white' : 'bg-neutral-100 text-on-surface-variant'}`}>
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <span className="block text-xs font-bold font-display">Lenovo ThinkPad / Dell Latitude</span>
                          <span className="text-[10px] text-on-surface-variant font-mono">Intel i7 • 32GB RAM • Corporate Secure OS</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#F1F4F6] flex justify-between items-center text-xs">
                  <span className="text-[11px] font-mono text-status-success font-bold flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4" />
                    Verified Genesys Works Active Participant
                  </span>
                  <button 
                    onClick={() => triggerToast('Successfully synced profile details to team databases.')}
                    className="bg-wm-royal hover:opacity-90 active:scale-95 text-white font-bold py-2 px-5 rounded-lg text-xs shadow-sm cursor-pointer transition-all"
                  >
                    Save Preference Changes
                  </button>
                </div>
              </div>
            )}

            {/* 2. Access & Security Permissions Tab */}
            {activeSubTab === 'permissions' && (
              <div className="bg-white border border-[#E1E4E8] rounded-xl p-6 shadow-sm text-left font-sans">
                
                {/* Header with simulated warning if not admin */}
                <div className="pb-4 border-b border-[#F1F4F6] mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-wider">Administrative Overrides</span>
                    <h3 className="text-base font-bold text-wm-navy mt-1">Intern Authorization Control Matrix</h3>
                  </div>

                  {userRole !== 'admin' ? (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-[10px] uppercase font-bold py-1 px-3 rounded-md flex items-center gap-1.5 font-mono">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Read-Only Mode</span>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 text-green-700 text-[10px] uppercase font-bold py-1 px-3 rounded-md flex items-center gap-1.5 font-mono">
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Write Access Granted</span>
                    </div>
                  )}
                </div>

                {/* Simulated Warning Alert explaining limits */}
                {userRole !== 'admin' && (
                  <div className="bg-amber-100/50 border border-amber-200 rounded-lg p-3.5 text-xs text-on-surface mb-6 flex gap-3">
                    <Lock className="w-5 h-5 text-shoutout-gold shrink-0" />
                    <div className="space-y-1">
                      <span className="font-bold text-wm-navy">Administrator Mode is Not Active:</span>
                      <p className="text-[11px] text-gray-700 leading-relaxed">
                        You can currently view the security toggles, but updates are locked. Switch to <b>Administrator Mode</b> at the top right header to simulate supervisor permissions toggling!
                      </p>
                    </div>
                  </div>
                )}

                {/* The Permission toggles list */}
                <div className="space-y-4">
                  {/* Toggle 1: Delete Tasks */}
                  <div className={`p-4 border rounded-xl flex items-start justify-between transition-all ${
                    permissions.allowInternsToDeleteTasks ? 'border-green-100 bg-green-50/10' : 'border-[#E1E4E8] bg-neutral-50/30'
                  } ${userRole !== 'admin' ? 'opacity-70' : ''}`}>
                    <div className="space-y-1 text-left select-none">
                      <span className="text-xs font-bold text-wm-navy flex items-center gap-1.5">
                        Permanent Delete Operations
                      </span>
                      <p className="text-[11px] text-on-surface-variant max-w-xl">
                        Determines if interns can permanently delete backlog items and board columns. Disabling forces interns to archive cards rather than delete.
                      </p>
                    </div>
                    
                    <button
                      type="button"
                      disabled={userRole !== 'admin'}
                      onClick={() => handleTogglePermission('allowInternsToDeleteTasks')}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        permissions.allowInternsToDeleteTasks ? 'bg-status-success' : 'bg-gray-300'
                      } ${userRole !== 'admin' ? 'cursor-not-allowed opacity-60' : ''}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        permissions.allowInternsToDeleteTasks ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Toggle 2: Create FAQs */}
                  <div className={`p-4 border rounded-xl flex items-start justify-between transition-all ${
                    permissions.allowInternsToCreateFAQ ? 'border-green-100 bg-green-50/10' : 'border-[#E1E4E8] bg-neutral-50/30'
                  } ${userRole !== 'admin' ? 'opacity-70' : ''}`}>
                    <div className="space-y-1 text-left select-none">
                      <span className="text-xs font-bold text-wm-navy flex items-center gap-1.5">
                        FAQ Question Posting & Creation
                      </span>
                      <p className="text-[11px] text-on-surface-variant max-w-xl">
                        Permits interns to append dynamic knowledge questions to the community database. Disabled results in read-only guides for interns.
                      </p>
                    </div>
                    
                    <button
                      type="button"
                      disabled={userRole !== 'admin'}
                      onClick={() => handleTogglePermission('allowInternsToCreateFAQ')}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        permissions.allowInternsToCreateFAQ ? 'bg-status-success' : 'bg-gray-300'
                      } ${userRole !== 'admin' ? 'cursor-not-allowed opacity-60' : ''}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        permissions.allowInternsToCreateFAQ ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Toggle 3: Sync Meetings */}
                  <div className={`p-4 border rounded-xl flex items-start justify-between transition-all ${
                    permissions.allowInternsToSyncMeetings ? 'border-green-100 bg-green-50/10' : 'border-[#E1E4E8] bg-neutral-50/30'
                  } ${userRole !== 'admin' ? 'opacity-70' : ''}`}>
                    <div className="space-y-1 text-left select-none">
                      <span className="text-xs font-bold text-wm-navy flex items-center gap-1.5">
                        Outlook Meetings Calendar Sync
                      </span>
                      <p className="text-[11px] text-on-surface-variant max-w-xl">
                        Enables writing and editing outlook calendar synchronization profiles on the active dashboard panel.
                      </p>
                    </div>
                    
                    <button
                      type="button"
                      disabled={userRole !== 'admin'}
                      onClick={() => handleTogglePermission('allowInternsToSyncMeetings')}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        permissions.allowInternsToSyncMeetings ? 'bg-status-success' : 'bg-gray-300'
                      } ${userRole !== 'admin' ? 'cursor-not-allowed opacity-60' : ''}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        permissions.allowInternsToSyncMeetings ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Toggle 4: Milestones */}
                  <div className={`p-4 border rounded-xl flex items-start justify-between transition-all ${
                    permissions.allowInternsToSelfApproveMilestones ? 'border-green-100 bg-green-50/10' : 'border-[#E1E4E8] bg-neutral-50/30'
                  } ${userRole !== 'admin' ? 'opacity-70' : ''}`}>
                    <div className="space-y-1 text-left select-none">
                      <span className="text-xs font-bold text-wm-navy flex items-center gap-1.5">
                        Onboarding Roadmap Milestone Verification
                      </span>
                      <p className="text-[11px] text-on-surface-variant max-w-xl">
                        Authorizes interns to self-verify onboarding program metrics and training cards. Disabling restricts checks until verified by supervisors.
                      </p>
                    </div>
                    
                    <button
                      type="button"
                      disabled={userRole !== 'admin'}
                      onClick={() => handleTogglePermission('allowInternsToSelfApproveMilestones')}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        permissions.allowInternsToSelfApproveMilestones ? 'bg-status-success' : 'bg-gray-300'
                      } ${userRole !== 'admin' ? 'cursor-not-allowed opacity-60' : ''}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        permissions.allowInternsToSelfApproveMilestones ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>

                <div className="mt-8 border-t border-[#F1F4F6] pt-6 flex justify-between items-center text-[10.5px] font-mono text-on-surface-variant">
                  <span>Current Security Key: AES-256 Enabled</span>
                  <span>Active Role: <b className="text-wm-navy uppercase">{userRole}</b></span>
                </div>
              </div>
            )}

            {/* 3. Admins / Staff List Tab */}
            {activeSubTab === 'admin-access' && (
              <div className="bg-white border border-[#E1E4E8] rounded-xl p-6 shadow-sm text-left font-sans">
                <div className="pb-4 border-b border-[#F1F4F6] mb-6">
                  <span className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-wider">Supervision & Security Registries</span>
                  <h3 className="text-base font-bold text-wm-navy mt-1">Authorized Supervisor Staff Directory</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Manage the directory of active Genesys Works consultants and administrators with total system permission capabilities.
                  </p>
                </div>

                {/* Directory Table */}
                <div className="overflow-x-auto border border-[#E1E4E8] rounded-lg mb-6">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#FAFBCF]/15 border-b border-[#E1E4E8] font-mono font-bold uppercase text-[9.5px] text-on-surface-variant text-left">
                        <th className="p-3">Staff Leader</th>
                        <th className="p-3">Designation</th>
                        <th className="p-3">Email Reference</th>
                        <th className="p-3">Activity Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {admins.map(person => (
                        <tr key={person.id} className="hover:bg-neutral-50/50">
                          <td className="p-3 text-left font-bold text-wm-navy">{person.name}</td>
                          <td className="p-3 text-left font-sans text-on-surface-variant">{person.role}</td>
                          <td className="p-3 text-left font-mono text-on-surface-variant">{person.email}</td>
                          <td className="p-3 text-left font-mono text-status-success">{person.lastActive}</td>
                          <td className="p-3 text-right">
                            <button
                              id={`remove-admin-btn-${person.id}`}
                              onClick={() => handleRemoveAdmin(person.id, person.name)}
                              disabled={userRole !== 'admin'}
                              className={`text-status-blocked hover:underline font-bold text-[10.5px] uppercase cursor-pointer ${
                                userRole !== 'admin' ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Inline form to add staff (Locked to admin) */}
                <form onSubmit={handleAddAdmin} className={`bg-neutral-50 border border-[#E1E4E8] rounded-lg p-4 ${
                  userRole !== 'admin' ? 'opacity-70 pointer-events-none' : ''
                }`}>
                  <div className="text-[10px] font-mono font-bold uppercase text-on-surface-variant mb-3 flex items-center justify-between">
                    <span>Register New Program Staff Supervisor</span>
                    {userRole !== 'admin' && (
                      <span className="text-red-500 font-bold">🔒 Requires Supervisor Mode to Register</span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input 
                      type="text"
                      placeholder="e.g. John Doe"
                      disabled={userRole !== 'admin'}
                      value={newAdminName}
                      onChange={(e) => setNewAdminName(e.target.value)}
                      className="text-xs p-2.5 bg-white border border-[#E1E4E8] rounded outline-none w-full"
                    />
                    <input 
                      type="email"
                      placeholder="e.g. j.doe@genesysworks.org"
                      disabled={userRole !== 'admin'}
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      className="text-xs p-2.5 bg-white border border-[#E1E4E8] rounded outline-none w-full font-mono"
                    />
                    <div className="flex gap-2">
                      <select
                        disabled={userRole !== 'admin'}
                        value={newAdminRole}
                        onChange={(e) => setNewAdminRole(e.target.value)}
                        className="text-xs p-2.5 bg-white border border-[#E1E4E8] rounded outline-none cursor-pointer flex-1"
                      >
                        <option value="Executive Mentor">Executive Mentor</option>
                        <option value="Program Coordinator">Program Advisor</option>
                        <option value="IT Hub Administrator">IT Administrator</option>
                      </select>
                      <button
                        id="add-admin-form-submit"
                        type="submit"
                        disabled={userRole !== 'admin'}
                        className="bg-[#0072CE] hover:bg-wm-royal text-white px-4 py-2.5 rounded font-bold text-xs shrink-0 cursor-pointer shadow-sm transition-colors"
                      >
                        Add Staff
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* 4. Global Seeds / Database Purge / Reset */}
            {activeSubTab === 'database' && (
              <div className="bg-white border border-[#E1E4E8] rounded-xl p-6 shadow-sm text-left font-sans">
                <div className="pb-4 border-b border-[#F1F4F6] mb-6">
                  <span className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-wider">Database Operations & Sandbox Seeds</span>
                  <h3 className="text-base font-bold text-wm-navy mt-1">Workspace Database Control Terminal</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Clear lists completely, trigger mock databases updates, or load template scope libraries into the board.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none text-left">
                  {/* Preset Option A */}
                  <div className="border border-[#E1E4E8] rounded-xl p-4 flex flex-col justify-between hover:bg-neutral-50 transition-all text-left">
                    <div className="space-y-1">
                      <span className="font-bold text-xs text-wm-navy block text-left">High Intensity Agile Sprint</span>
                      <p className="text-[11px] text-on-surface-variant leading-relaxed text-left">
                        Includes several high and medium priority technical tickets including CRM sandbox and PowerBI template testing.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onLoadPresetTasks('sprint');
                        addAuditLog('Loaded Preset: Agile Sprint task portfolio', 'SEED');
                        triggerToast('Portfolio loaded! Board initialized with Sprint Tasks.');
                      }}
                      className="mt-4 bg-wm-royal hover:opacity-95 text-white py-1.5 px-3 rounded text-[11px] font-bold cursor-pointer transition-all uppercase"
                    >
                      Load Sprint Presets
                    </button>
                  </div>

                  {/* Preset Option B */}
                  <div className="border border-[#E1E4E8] rounded-xl p-4 flex flex-col justify-between hover:bg-neutral-50 transition-all text-left">
                    <div className="space-y-1">
                      <span className="font-bold text-xs text-wm-navy block text-left">Professional & Corporate Skills</span>
                      <p className="text-[11px] text-on-surface-variant leading-relaxed text-left">
                        Tuned for mock training exercises. Focusing on presentation decks, Slack communication, and Outlook setups.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onLoadPresetTasks('ops');
                        addAuditLog('Loaded Preset: Professional & Corporate Operations list', 'SEED');
                        triggerToast('Portfolio loaded! Board initialized with Corporate Skills.');
                      }}
                      className="mt-4 bg-[#F2A900] hover:opacity-95 text-neutral-900 py-1.5 px-3 rounded text-[11px] font-bold cursor-pointer transition-all uppercase"
                    >
                      Load Ops Presets
                    </button>
                  </div>

                  {/* Clear All Card Option */}
                  <div className="border border-[#E1E4E8] rounded-xl p-4 flex flex-col justify-between hover:bg-neutral-50 transition-all text-left border-dashed bg-neutral-50/50">
                    <div className="space-y-1">
                      <span className="font-bold text-xs text-status-blocked block text-left flex items-center gap-1">
                        <Flame className="w-4 h-4 animate-pulse" />
                        Purge Active Board
                      </span>
                      <p className="text-[11px] text-on-surface-variant leading-relaxed text-left">
                        Completely wipe the Kanban Board and backlog clean to simulate building workflows entirely from zero scratch.
                      </p>
                    </div>
                    <button
                      id="btn-purge-active-board"
                      onClick={() => {
                        if (confirm('Are you absolutely certain you want to purge all active sprint tasks and stories to zero?')) {
                          onClearTasks();
                          addAuditLog('Triggered complete active board data purge', 'PURGE');
                          triggerToast('Workspace purged. Active tasks cleared completely.');
                        }
                      }}
                      className="mt-4 bg-status-blocked hover:opacity-95 text-white py-1.5 px-3 rounded text-[11px] font-bold cursor-pointer transition-all uppercase"
                    >
                      Purge Board Tasks
                    </button>
                  </div>
                </div>

                {/* Hard Reset System Button Box */}
                <div className="mt-8 pt-6 border-t border-red-100 bg-red-50/20 rounded-xl p-5 border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
                  <div className="space-y-1">
                    <span className="font-bold text-xs text-status-blocked flex items-center gap-1.5 text-left">
                      <AlertTriangle className="w-4.5 h-4.5" />
                      Complete Workspace Database Restoration
                    </span>
                    <p className="text-[11px] text-on-surface-variant max-w-xl">
                      Reverts the layout dashboard state, onboarding milestones checklist, mock user profiles, faq registers, and meetings listings back to primary Genesys Works standards.
                    </p>
                  </div>

                  <button
                    id="btn-hard-reset-workspace"
                    onClick={() => {
                      if (confirm('Revert all databases (milestones, meetings, faqs) to original Genesys Works initial program specs?')) {
                        onResetWorkspace();
                        addAuditLog('Authorized entire portal databases hard restoration', 'RESET');
                        triggerToast('System Reset! Cohort parameters initialized.');
                      }
                    }}
                    className="bg-status-blocked hover:bg-red-650 text-white font-bold px-4 py-2.5 rounded-lg text-xs tracking-wide shadow-sm hover:shadow active:scale-95 transition-all text-left block shrink-0 cursor-pointer font-sans"
                  >
                    Reset Workspace Back to Init
                  </button>
                </div>
              </div>
            )}

            {/* 5. Platform Management Dashboard */}
            {activeSubTab === 'platform' && (
              userRole === 'admin' ? (
                <PlatformDashboard 
                  userRole={userRole}
                  triggerToast={triggerToast}
                  userNickname={userNickname}
                />
              ) : (
                <div className="bg-white border border-[#E1E4E8] rounded-xl p-8 text-center space-y-4">
                  <Sliders className="w-12 h-12 text-[#E0533C] mx-auto animate-bounce" />
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-wm-navy">Platform Management Locked</h3>
                    <p className="text-xs text-on-surface-variant max-w-md mx-auto">
                      Administrative credentials are required to view integration keys and user tables. Please switch your role to <b>Administrator</b> using the role selector block at the top right of this settings workspace.
                    </p>
                  </div>
                </div>
              )
            )}

            {/* Simulated Live System Audit Trail Panel (Shows what changes took place) */}
            <div className="bg-wm-navy border border-[#001c3a] text-white rounded-xl p-6 shadow text-left font-mono">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-shoutout-gold" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Dynamic Workspace Security Audit Logs</h4>
              </div>

              <div id="settings-audit-logs" className="space-y-2 text-[11px] max-h-48 overflow-y-auto pr-2">
                {auditLogs.map(log => (
                  <div key={log.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/5 py-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-on-surface-variant font-bold text-[10px]">{log.timestamp}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        log.category === 'SECURITY' ? 'bg-red-900/50 text-red-300' :
                        log.category === 'PERMISSION' ? 'bg-amber-900/50 text-amber-300' :
                        log.category === 'RESET' ? 'bg-blue-900/50 text-blue-300' : 'bg-white/10 text-white'
                      }`}>
                        {log.category}
                      </span>
                      <span className="text-white/95">{log.action}</span>
                    </div>
                    <span className="text-shoutout-gold/80 font-bold text-[10px] sm:ml-4">operator: {log.user}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
