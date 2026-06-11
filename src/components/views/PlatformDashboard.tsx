import React, { useState } from 'react';
import { 
  Users, 
  Settings, 
  Database, 
  Link, 
  Globe, 
  ShieldAlert, 
  CheckCheck, 
  Zap, 
  Activity, 
  Search, 
  UserCheck, 
  RefreshCw, 
  Lock, 
  Unlock, 
  Save, 
  Eye, 
  EyeOff,
  AlertCircle,
  ExternalLink,
  Sliders,
  Terminal,
  HelpCircle
} from 'lucide-react';

interface PlatformDashboardProps {
  userRole: 'admin' | 'intern';
  triggerToast: (msg: string) => void;
  userNickname: string;
}

// Simulated active user management dataset
interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: 'Administrator' | 'Program Coordinator' | 'Technical Mentor' | 'Summer Intern';
  department: 'Product Engineering' | 'Data & Analytics' | 'Customer Experience' | 'Operations' | 'Career Development';
  status: 'Active' | 'On Vacation' | 'Provisioning' | 'Inactive';
  lastLogin: string;
  hardware: string;
}

// Integrations types
interface IntegrationConfig {
  id: string;
  name: string;
  logo: string;
  description: string;
  urlLabel: string;
  urlPlaceholder: string;
  projectLabel?: string;
  projectPlaceholder?: string;
  keyLabel: string;
  keyPlaceholder: string;
  
  // Custom Values
  url: string;
  projectField: string;
  apiKey: string;
  connectionStatus: 'Connected' | 'Disconnected' | 'Pending' | 'Error';
  lastTried?: string;
}

export default function PlatformDashboard({
  userRole,
  triggerToast,
  userNickname
}: PlatformDashboardProps) {

  // Local state for managed users
  const [usersList, setUsersList] = useState<ManagedUser[]>([
    { id: 'usr-1', name: 'Alex Rivera', email: 'a.rivera@genesysworks.org', role: 'Summer Intern', department: 'Product Engineering', status: 'Active', lastLogin: 'Just now', hardware: 'MacBook Pro' },
    { id: 'usr-2', name: 'Jordan Smith', email: 'j.smith@genesysworks.org', role: 'Summer Intern', department: 'Data & Analytics', status: 'Active', lastLogin: '12 mins ago', hardware: 'Lenovo ThinkPad' },
    { id: 'usr-3', name: 'Marcus Chen', email: 'm.chen@westmonroe.com', role: 'Technical Mentor', department: 'Data & Analytics', status: 'Active', lastLogin: '1 hour ago', hardware: 'MacBook Pro' },
    { id: 'usr-4', name: 'David Park', email: 'd.park@westmonroe.com', role: 'Technical Mentor', department: 'Customer Experience', status: 'Active', lastLogin: '3 hours ago', hardware: 'Lenovo ThinkPad' },
    { id: 'usr-5', name: 'Sarah Anderson', email: 's.anderson@genesysworks.org', role: 'Program Coordinator', department: 'Career Development', status: 'Active', lastLogin: 'Yesterday', hardware: 'Lenovo ThinkPad' },
    { id: 'usr-6', name: 'Samantha Vance', email: 's.vance@genesysworks.org', role: 'Administrator', department: 'Operations', status: 'Active', lastLogin: '2 days ago', hardware: 'MacBook Pro' },
    { id: 'usr-7', name: 'Tyler Durden', email: 't.durden@genesysworks.org', role: 'Summer Intern', department: 'Operations', status: 'On Vacation', lastLogin: 'Last week', hardware: 'Lenovo ThinkPad' },
    { id: 'usr-8', name: 'John Doe', email: 'j.doe@unprovisioned.org', role: 'Summer Intern', department: 'Product Engineering', status: 'Provisioning', lastLogin: 'Never', hardware: 'MacBook Pro' }
  ]);

  // Integration instances list state
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([
    {
      id: 'jira',
      name: 'Atlassian Jira Agile',
      logo: 'https://cdn.worldvectorlogo.com/logos/jira-1.svg',
      description: 'Synchronizes project board cards and backlogs automatically into West Monroe sprint backlogs.',
      urlLabel: 'Jira Workspace URL',
      urlPlaceholder: 'https://genesysworks.atlassian.net',
      projectLabel: 'Project ID / Key',
      projectPlaceholder: 'GW-SUMMER26',
      keyLabel: 'API Access Token',
      keyPlaceholder: 'ATATT3xFfGF0...',
      url: 'https://westmonroe.atlassian.net',
      projectField: 'WMC-INTERN-26',
      apiKey: 'ATATT3xFfGF0dG9rZW49QUJDMTIz...',
      connectionStatus: 'Connected',
      lastTried: 'Today, 14:32'
    },
    {
      id: 'salesforce',
      name: 'Salesforce CRM Sandbox',
      logo: 'https://cdn.worldvectorlogo.com/logos/salesforce-2.svg',
      description: 'Pulls dynamic client engagement opportunities and training datasets for interns to build analytics on.',
      urlLabel: 'Salesforce Login Host',
      urlPlaceholder: 'https://test.salesforce.com (Sandbox)',
      projectLabel: 'Connected App Consumer ID',
      projectPlaceholder: '3MVG9qNuznKB...',
      keyLabel: 'OAuth Consumer Secret',
      keyPlaceholder: '7829A03C1F4D...',
      url: 'https://genesysworks--sandbox.my.salesforce.com',
      projectField: 'ClientStagingOauthConn',
      apiKey: '',
      connectionStatus: 'Disconnected',
      lastTried: 'Never'
    },
    {
      id: 'outlook',
      name: 'Microsoft Outlook Exchange',
      logo: 'https://cdn.worldvectorlogo.com/logos/microsoft-outlook-1.svg',
      description: 'Syncs program calendar invitations, supervisor reviews, and automated onboarding schedules.',
      urlLabel: 'M365 Tenant Admin URL',
      urlPlaceholder: 'https://outlook.office.com/owa/tenant.onmicrosoft.com',
      projectLabel: 'Mailbox Domain Auth',
      projectPlaceholder: 'genesysworks.org',
      keyLabel: 'Client Secret Credential',
      keyPlaceholder: 'mso_7219cbaef990f...',
      url: 'https://outlook.office365.com/api/v2.0',
      projectField: 'genesysworks.org',
      apiKey: 'mso_7219cbaef990f892a01d...',
      connectionStatus: 'Connected',
      lastTried: 'Today, 09:15'
    },
    {
      id: 'teams',
      name: 'Microsoft Teams Operations',
      logo: 'https://cdn.worldvectorlogo.com/logos/microsoft-teams-1.svg',
      description: 'Monitors student team collaboration channels and broadcasts onboarding achievements.',
      urlLabel: 'Teams Webhook URL',
      urlPlaceholder: 'https://genesysworks.webhook.office.com/webhookb2/...',
      projectLabel: 'Target Digital Channel',
      projectPlaceholder: 'Cohort-Broadcaster',
      keyLabel: 'Integration Signing Token',
      keyPlaceholder: 'sig_teams_xxx',
      url: 'https://genesysworks.webhook.office.com/webhookb2/001a2b3c',
      projectField: 'General-Volunteer-Advisors',
      apiKey: 'sig_teams_b0193daef920',
      connectionStatus: 'Connected',
      lastTried: 'Today, 10:45'
    },
    {
      id: 'sharepoint',
      name: 'Microsoft SharePoint Hub',
      logo: 'https://cdn.worldvectorlogo.com/logos/sharepoint-1.svg',
      description: 'Secures and templates standard West Monroe resume files, rubrics, and feedback materials.',
      urlLabel: 'Site Collections URL',
      urlPlaceholder: 'https://genesysworks.sharepoint.com/sites/Portal',
      projectLabel: 'Document Library Title',
      projectPlaceholder: 'Intern-Portfolio-Assets',
      keyLabel: 'App-Only Access Client Secret',
      keyPlaceholder: 'sp_secret_xxxxxxxx',
      url: 'https://genesysworks.sharepoint.com/sites/WMC-Cohort-Resource',
      projectField: 'Summer-Rubrics-Template',
      apiKey: 'sp_sec_892019cfaae3010b',
      connectionStatus: 'Disconnected',
      lastTried: 'Yesterday, 17:30'
    },
    {
      id: 'degreed',
      name: 'Degreed LXP Portal',
      logo: 'https://cdn.worldvectorlogo.com/logos/degreed.svg',
      description: 'Maps technical learning curricula pipelines and verifies academic course completion stats.',
      urlLabel: 'Degreed API Base URL',
      urlPlaceholder: 'https://api.degreed.com/api/v2',
      projectLabel: 'Curricula Scope ID',
      projectPlaceholder: 'onboarding-roadmap-q3',
      keyLabel: 'Bearer Token Auth Key',
      keyPlaceholder: 'deg_bearer_xxxxxx',
      url: 'https://api.degreed.com/api/v2/tenant-westmonroe',
      projectField: 'wmc-interns-learning-path',
      apiKey: 'deg_bearer_892c90a192b0f3c5ea7728',
      connectionStatus: 'Connected',
      lastTried: 'Today, 12:05'
    },
    {
      id: 'servicenow',
      name: 'ServiceNow ITSM Gateway',
      logo: 'https://cdn.worldvectorlogo.com/logos/servicenow-logo.svg',
      description: 'Forwards trainee support tickets directly to the West Monroe enterprise IT helpdesk queue.',
      urlLabel: 'ServiceNow Instance URL',
      urlPlaceholder: 'https://dev12345.service-now.com',
      projectLabel: 'Assignment Group Queue',
      projectPlaceholder: 'WMC-GENESYS-IT-DESK',
      keyLabel: 'Integration Password Secret',
      keyPlaceholder: 'sn_pass_xxxxxx',
      url: 'https://westmonroe.service-now.com',
      projectField: 'WMC-COHORT-HELPDESK',
      apiKey: 'sn_secret_8209adbc92a83c71e0f0',
      connectionStatus: 'Connected',
      lastTried: 'Today, 08:30'
    },
    {
      id: 'slack',
      name: 'Slack Workplace Communication',
      logo: 'https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg',
      description: 'Pushes team milestones accomplishments and high five shoutouts to designated public workspace channels.',
      urlLabel: 'Webhook Target URL',
      urlPlaceholder: 'https://hooks.slack.com/services/T00/B00/X00',
      projectLabel: 'Target Notification Channel',
      projectPlaceholder: '#genesys-intern-shouts',
      keyLabel: 'Bot Authentication Token',
      keyPlaceholder: 'xoxb-your-token-here',
      url: 'https://hooks.slack.com/services/T0123/B4567/WMC-INTERNS',
      projectField: '#cohort-announcements',
      apiKey: 'xoxb-59281-cohort-82a173...',
      connectionStatus: 'Disconnected',
      lastTried: 'Yesterday, 18:05'
    },
    {
      id: 'github',
      name: 'GitHub Enterprise Source',
      logo: 'https://cdn.worldvectorlogo.com/logos/github-icon-1.svg',
      description: 'Monitors cohort repository commits and pulls status checks for technical milestone progress.',
      urlLabel: 'GitHub Repo Path',
      urlPlaceholder: 'e.g. genesys-works/summer-cohort-portal',
      projectLabel: 'Target Branch Sync',
      projectPlaceholder: 'usually main or prod',
      keyLabel: 'Personal Access Token (PAT)',
      keyPlaceholder: 'ghp_xxxxxxxxxxxxxxxxxxx',
      url: 'github.com/genesysworks/onboarding-roadmap',
      projectField: 'main',
      apiKey: 'ghp_42A82B73C819F920...',
      connectionStatus: 'Connected',
      lastTried: 'Today, 11:20'
    }
  ]);

  // View States
  const [userSearchText, setUserSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [visibleApiKeys, setVisibleApiKeys] = useState<Record<string, boolean>>({});
  const [loadingIntegrations, setLoadingIntegrations] = useState<Record<string, boolean>>({});

  // User list edits
  const handleRoleChange = (userId: string, newRole: ManagedUser['role']) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        triggerToast(`Updated Role for ${u.name} to ${newRole}`);
        return { ...u, role: newRole };
      }
      return u;
    }));
  };

  const handleStatusChange = (userId: string, newStatus: ManagedUser['status']) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        triggerToast(`Updated Status of ${u.name} to ${newStatus}`);
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  const toggleApiKeyVisibility = (id: string) => {
    setVisibleApiKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Integration Form Edits
  const handleIntegrationFieldChange = (id: string, field: 'url' | 'projectField' | 'apiKey', value: string) => {
    setIntegrations(prev => prev.map(curr => {
      if (curr.id === id) {
        return { ...curr, [field]: value };
      }
      return curr;
    }));
  };

  // Connect Simulation Hook
  const handleTestAndSaveIntegration = (id: string) => {
    const config = integrations.find(i => i.id === id);
    if (!config) return;

    if (!config.url.trim() || !config.apiKey.trim()) {
      triggerToast(`Verification Failed: ${config.name} requires all fields to test integration.`);
      setIntegrations(prev => prev.map(curr => {
        if (curr.id === id) {
          return { ...curr, connectionStatus: 'Error', lastTried: 'Just now' };
        }
        return curr;
      }));
      return;
    }

    // Set interactive loading spinner state
    setLoadingIntegrations(prev => ({ ...prev, [id]: true }));
    triggerToast(`Establishing connection tunnel for ${config.name}...`);

    setTimeout(() => {
      setLoadingIntegrations(prev => ({ ...prev, [id]: false }));
      const isSuccessfulSim = config.apiKey.length > 5;
      
      setIntegrations(prev => prev.map(curr => {
        if (curr.id === id) {
          const successTime = new Date().toTimeString().split(' ')[0].substring(0, 5);
          return {
            ...curr,
            connectionStatus: isSuccessfulSim ? 'Connected' : 'Error',
            lastTried: `Today, ${successTime}`
          };
        }
        return curr;
      }));
      
      if (isSuccessfulSim) {
        triggerToast(`SUCCESS: ${config.name} credentials verified! Webhooks listening.`);
      } else {
        triggerToast(`ERROR: Handshake refused for ${config.name}. Inspect API Access Key.`);
      }
    }, 1800);
  };

  // Mock toggle status directly
  const handleToggleStatus = (id: string) => {
    setIntegrations(prev => prev.map(curr => {
      if (curr.id === id) {
        const nextStatus = curr.connectionStatus === 'Connected' ? 'Disconnected' : 'Connected';
        triggerToast(`${curr.name} status swapped to ${nextStatus.toUpperCase()}`);
        return { 
          ...curr, 
          connectionStatus: nextStatus,
          lastTried: 'Just now'
        };
      }
      return curr;
    }));
  };

  // Filtered users list
  const filteredUsers = usersList.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearchText.toLowerCase()) || 
                          u.email.toLowerCase().includes(userSearchText.toLowerCase()) ||
                          u.department.toLowerCase().includes(userSearchText.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 animate-fade-in text-left">
      
      {/* 1. Header Banner Badge telling them this is the secret admin platform */}
      <div className="bg-gradient-to-r from-red-500/10 to-transparent border-l-4 border-[#E0533C] p-4 rounded-r-xl flex items-start gap-3.5 mb-2 font-display select-none">
        <ShieldAlert className="w-6 h-6 text-[#E0533C] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-[#E0533C]">Administrative Control Center</span>
          <h3 className="text-sm font-bold text-wm-navy leading-none">Supervisor Portal Platform Management Dashboard</h3>
          <p className="text-xs text-on-surface-variant font-sans mt-0.5 max-w-4xl">
            Authorize new coordinator logins, modify intern roles on-the-fly, and verify API webhooks connection handshakes for enterprise external cloud integrations.
          </p>
        </div>
      </div>

      {/* Grid Layout of User Management (L) and Integrations Info (R) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* COL 1: USER ROLES MANAGEMENT SECTION (col-span-12 or 7) */}
        <div className="xl:col-span-7 bg-white rounded-xl border border-[#E1E4E8] shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-[#F1F4F6] bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-left">
              <span className="text-[9px] font-mono tracking-wider font-bold text-wm-royal uppercase">Access Rosters</span>
              <h4 className="text-sm font-bold text-wm-navy font-display mt-0.5">App User Roles Directory</h4>
            </div>

            {/* Role Filter & Counter */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="text-[11px] font-semibold py-1.5 px-3 border border-[#E1E4E8] rounded-md bg-white cursor-pointer outline-none"
              >
                <option value="All">All Roles</option>
                <option value="Summer Intern">Summer Interns</option>
                <option value="Technical Mentor">Technical Mentors</option>
                <option value="Program Coordinator">Coordinators</option>
                <option value="Administrator">Administrators</option>
              </select>
              <span className="text-[10px] font-mono bg-wm-blue-light/35 text-wm-navy py-1 px-2.5 rounded-full font-bold">
                {filteredUsers.length} Users Found
              </span>
            </div>
          </div>

          {/* Search box overlay */}
          <div className="p-4 border-b border-gray-100 bg-white relative flex gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearchText}
                onChange={(e) => setUserSearchText(e.target.value)}
                placeholder="Search database users by name, email, department..."
                className="w-full text-xs pl-9 pr-4 py-2.5 bg-neutral-50 rounded-lg border border-[#E1E4E8] outline-none font-sans focus:bg-white focus:border-wm-royal transition-all"
              />
            </div>
            <button
              onClick={() => {
                setUserSearchText('');
                setRoleFilter('All');
                triggerToast('Search criteria reset.');
              }}
              className="text-[10px] font-bold text-wm-navy px-3 hover:underline"
            >
              Clear
            </button>
          </div>

          {/* Directory Listings Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans select-none">
              <thead>
                <tr className="bg-neutral-50 border-b border-[#E1E4E8] text-[10px] font-mono text-[#5C6F84] uppercase tracking-wider">
                  <th className="p-3.5 pl-5">Staff Member / Email</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Assigned App Role</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 pr-5 text-right">Simulation Auth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-sans">
                {filteredUsers.map(user => {
                  const isCurrentSimMe = user.name === userNickname;
                  return (
                    <tr 
                      key={user.id} 
                      className={`hover:bg-slate-50/50 transition-colors ${
                        isCurrentSimMe ? 'bg-[#d4e3ff]/15 font-medium' : ''
                      }`}
                    >
                      {/* Name / Email Block */}
                      <td className="p-3.5 pl-5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-wm-blue-light text-wm-navy flex items-center justify-center font-bold text-[10px] uppercase shrink-0">
                            {user.name.charAt(0)}
                          </div>
                          <div className="text-left">
                            <span className="block font-bold text-wm-navy leading-normal flex items-center gap-1.5">
                              {user.name}
                              {isCurrentSimMe && (
                                <span className="bg-wm-royal text-white text-[8px] font-bold px-1 py-0.2 rounded uppercase font-mono">
                                  Me
                                </span>
                              )}
                            </span>
                            <span className="block text-[10px] text-on-surface-variant font-mono">{user.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Department Block */}
                      <td className="p-3.5 font-medium text-gray-700">
                        {user.department}
                      </td>

                      {/* Interactive assigned role dropdown */}
                      <td className="p-3.5">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as ManagedUser['role'])}
                          className={`text-xs py-1 px-2 border rounded-md bg-white cursor-pointer select-none outline-none font-bold ${
                            user.role === 'Administrator' ? 'text-[#E0533C] border-red-200 bg-red-50/20' :
                            user.role === 'Program Coordinator' ? 'text-[#0072CE] border-blue-200 bg-blue-50/10' :
                            user.role === 'Technical Mentor' ? 'text-shoutout-gold border-yellow-250 bg-amber-50/20' :
                            'text-gray-800'
                          }`}
                        >
                          <option value="Administrator">Administrator</option>
                          <option value="Program Coordinator">Program Coordinator</option>
                          <option value="Technical Mentor">Technical Mentor</option>
                          <option value="Summer Intern">Summer Intern</option>
                        </select>
                      </td>

                      {/* User status dropdown */}
                      <td className="p-3.5">
                        <select
                          value={user.status}
                          onChange={(e) => handleStatusChange(user.id, e.target.value as ManagedUser['status'])}
                          className={`text-[10px] font-mono font-bold py-0.5 px-2 rounded-full cursor-pointer outline-none border ${
                            user.status === 'Active' ? 'bg-green-50 text-status-success border-green-200' :
                            user.status === 'On Vacation' ? 'bg-yellow-50 text-shoutout-gold border-yellow-200' :
                            user.status === 'Provisioning' ? 'bg-blue-50 text-wm-royal border-blue-200 animate-pulse' :
                            'bg-gray-100 text-gray-500 border-gray-300'
                          }`}
                        >
                          <option value="Active">Active</option>
                          <option value="On Vacation">Vacation</option>
                          <option value="Provisioning">Provision</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </td>

                      {/* Action buttons */}
                      <td className="p-3.5 pr-5 text-right font-mono text-[10.5px]">
                        <button
                          onClick={() => {
                            triggerToast(`Handshake successful. Key tokens refreshed for ${user.name}.`);
                          }}
                          className="text-[#005fae] hover:underline uppercase font-bold"
                        >
                          Verify Keys
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Quick instructions indicator block */}
          <div className="p-5 border-t border-[#F1F4F6] bg-[#F8FAFC] text-left leading-relaxed text-xs text-on-surface-variant h-full flex flex-col justify-end">
            <p className="font-sans">
              🔒 <b>Active Directory Synced:</b> User profiles are managed through single-sign-on registers at <code>genesysworks.org</code>. Updates made here simulate direct configuration edits on our active directory cache registers.
            </p>
          </div>
        </div>

        {/* COL 2: ENTERPRISE EXTERNAL INTEGRATIONS CONSOLE (col-span-12 or 5) */}
        <div className="xl:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-[#E1E4E8] shadow-sm p-5 text-left">
            <div className="pb-3 border-b border-[#F1F4F6] mb-5 flex justify-between items-center select-none">
              <div className="text-left">
                <span className="text-[9px] font-mono tracking-wider font-bold text-shoutout-gold uppercase">API Exchange Gateway</span>
                <h4 className="text-sm font-bold text-wm-navy font-display mt-0.5">External App Integrations Grid</h4>
              </div>
              <span className="text-[10px] font-mono text-status-success font-bold flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-status-success animate-pulse shrink-0" />
                Active Gateway Channels
              </span>
            </div>

            {/* Compact Bento Stack of Integrations configurations */}
            <div className="space-y-6">
              {integrations.map(integration => {
                const isApiKeyVisible = visibleApiKeys[integration.id];
                const isLoading = loadingIntegrations[integration.id];
                
                return (
                  <div key={integration.id} className="border border-[#E1E4E8] rounded-xl p-4.5 space-y-4 shadow-xs relative bg-[#FAFAFC]/40 hover:bg-[#FAFAFC] transition-colors hover:shadow-xs text-left">
                    
                    {/* Header: Logo, Title, Active Toggle */}
                    <div className="flex justify-between items-start select-none">
                      <div className="flex gap-3">
                        <img 
                          src={integration.logo} 
                          alt={integration.name}
                          className="w-10 h-10 object-contain rounded-lg p-1 bg-white border border-gray-150 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="text-left">
                          <h5 className="text-xs font-bold text-wm-navy font-display block leading-normal">{integration.name}</h5>
                          <span className="text-[10px] text-gray-500 leading-normal line-clamp-1 block max-w-xs">{integration.description}</span>
                        </div>
                      </div>

                      {/* Connection status badge pill toggler click list */}
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(integration.id)}
                        className={`text-[10px] font-mono font-bold uppercase rounded-md py-1 px-2 border cursor-pointer select-none transition-colors shrink-0 ${
                          integration.connectionStatus === 'Connected'
                            ? 'bg-green-150/40 text-status-success border-green-300 hover:bg-green-200/50'
                            : 'bg-red-50 text-status-blocked border-red-300 hover:bg-red-100'
                        }`}
                        title="Click to toggle simulated status"
                      >
                        ● {integration.connectionStatus}
                      </button>
                    </div>

                    {/* App Setup form parameters */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                      {/* Sub-block URL */}
                      <div className="space-y-1 text-left">
                        <label className="text-[9px] font-mono font-bold text-[#5C6F84] uppercase tracking-wide block">{integration.urlLabel}</label>
                        <input
                          type="text"
                          value={integration.url}
                          onChange={(e) => handleIntegrationFieldChange(integration.id, 'url', e.target.value)}
                          placeholder={integration.urlPlaceholder}
                          className="w-full text-xs p-2 bg-white border border-[#E1E4E8] rounded-md outline-none focus:border-wm-royal font-sans font-medium"
                        />
                      </div>

                      {/* Sub-block Project Code */}
                      {integration.projectLabel && (
                        <div className="space-y-1 text-left">
                          <label className="text-[9px] font-mono font-bold text-[#5C6F84] uppercase tracking-wide block">{integration.projectLabel}</label>
                          <input
                            type="text"
                            value={integration.projectField}
                            onChange={(e) => handleIntegrationFieldChange(integration.id, 'projectField', e.target.value)}
                            placeholder={integration.projectPlaceholder}
                            className="w-full text-xs p-2 bg-white border border-[#E1E4E8] rounded-md outline-none focus:border-wm-royal font-sans font-medium"
                          />
                        </div>
                      )}

                      {/* API secret / Token field (occupies full width) */}
                      <div className="sm:col-span-2 space-y-1 text-left">
                        <label className="text-[9px] font-mono font-bold text-[#5C6F84] uppercase tracking-wide block flex justify-between items-center">
                          <span>{integration.keyLabel}</span>
                          <span className="text-[8.5px] text-gray-400 capitalize">client-side salt hashed</span>
                        </label>
                        <div className="relative">
                          <input
                            type={isApiKeyVisible ? 'text' : 'password'}
                            value={integration.apiKey}
                            onChange={(e) => handleIntegrationFieldChange(integration.id, 'apiKey', e.target.value)}
                            placeholder={integration.keyPlaceholder}
                            className="w-full text-xs pl-3 pr-10 py-2.5 bg-white border border-[#E1E4E8] rounded-md outline-none focus:border-wm-royal font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => toggleApiKeyVisibility(integration.id)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                            title={isApiKeyVisible ? 'Hide token' : 'Show token'}
                          >
                            {isApiKeyVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Action Line details */}
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs select-none">
                      <span className="text-[10px] text-on-surface-variant font-mono">
                        {integration.lastTried && integration.lastTried !== 'Never' ? (
                          `Checked: ${integration.lastTried}`
                        ) : (
                          'Not established'
                        )}
                      </span>
                      
                      <button
                        type="button"
                        onClick={() => handleTestAndSaveIntegration(integration.id)}
                        disabled={isLoading}
                        className="bg-wm-navy hover:bg-[#002b49] disabled:opacity-50 text-white font-bold py-1.5 px-4 rounded text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>Verifying...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3 h-3 text-shoutout-gold" />
                            <span>Verify & Connect</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Quick Helper guidelines footer */}
            <div className="mt-6 bg-[#FAFBCF]/45 border border-[#E1E468] rounded-xl p-4 text-[11px] text-gray-700 leading-normal">
              <span className="font-bold text-wm-navy">Dynamic Grounding:</span>
              <p className="mt-1">
                You can input custom keys and test URLs live to verify correct handshakes. The applet records these configuration credentials dynamically to simulate deep end-to-end webhook interactions with modern external networks.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
