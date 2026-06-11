import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  HelpCircle, 
  ChevronDown, 
  CheckCircle2, 
  User, 
  Sparkles, 
  Sliders, 
  LifeBuoy, 
  LogOut, 
  Settings 
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  projectBoardSubTab?: 'board' | 'backlog' | 'timeline';
  onProjectBoardSubTabChange?: (subTab: 'board' | 'backlog' | 'timeline') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenSettings: () => void;
  brandProgress: number; // onboarding overall progress e.g., 42
  onNavigateToTab?: (tab: string) => void;
  userNickname?: string;
  userRole?: string;
  onSetSettingsSubTab?: (subTab: 'profile' | 'permissions' | 'admin-access' | 'database' | 'platform') => void;
  onOpenSupport?: () => void;
  onSignOut?: () => void;
}

export default function Header({
  activeTab,
  projectBoardSubTab = 'board',
  onProjectBoardSubTabChange,
  searchQuery,
  setSearchQuery,
  onOpenSettings,
  brandProgress,
  onNavigateToTab,
  userNickname = 'Alex Rivera',
  userRole = 'intern',
  onSetSettingsSubTab,
  onOpenSupport,
  onSignOut
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const headingTitles: Record<string, string> = {
    dashboard: 'Intern Support Hub',
    'project-board': 'Intern Project Board',
    'learning-hub': 'Learning Hub',
    contacts: 'Contacts Directory',
    faq: 'FAQ & Support Center',
    onboarding: 'Onboarding Journey',
    settings: 'Portal Configurations',
  };

  const currentTitle = headingTitles[activeTab] || 'Intern Support Hub';

  // Contextual placeholder for search bar
  const getSearchPlaceholder = () => {
    switch (activeTab) {
      case 'project-board':
        return 'Search tasks (e.g., ServiceNow, Excel)...';
      case 'learning-hub':
        return 'Search guides, modules, or certifications...';
      case 'contacts':
        return 'Search directory by name, role, department...';
      case 'faq':
        return 'Search the FAQ knowledge base...';
      default:
        return 'Search resources, help guidelines...';
    }
  };

  const notifications = [
    { id: 1, text: 'Sarah Jenkins recognized Jordan Smith with a ShoutOut!', time: '2 hours ago', read: false },
    { id: 2, text: 'New Excel Video tutorial added to the library: Consulting 101!', time: 'Yesterday', read: true },
    { id: 3, text: 'Your 30-day onboarding roadmap progress is at 42%. keep going!', time: '2 days ago', read: true },
  ];

  return (
    <header className="h-16 w-full px-10 border-b border-[#E1E4E8] bg-white flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Title & Navigation sub-context tabs if any */}
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-display font-bold text-wm-navy leading-none shrink-0">
          {currentTitle}
        </h2>

        {/* Exclusive Project Board Sub-Tabs in Screenshots */}
        {activeTab === 'project-board' && (
          <div className="hidden lg:flex items-center ml-4 border-l border-[#E1E4E8] pl-4 h-8 gap-6 text-sm font-medium">
            <button
              id="header-tab-board"
              onClick={() => onProjectBoardSubTabChange?.('board')}
              className={`${
                projectBoardSubTab === 'board'
                  ? 'text-[#005fae] font-bold border-b-2 border-[#005fae]'
                  : 'text-on-surface-variant hover:text-on-surface'
              } h-16 flex items-center pt-0.5 font-semibold focus:outline-none transition-all cursor-pointer bg-transparent border-none`}
            >
              Board
            </button>
            <button
              id="header-tab-backlog"
              onClick={() => onProjectBoardSubTabChange?.('backlog')}
              className={`${
                projectBoardSubTab === 'backlog'
                  ? 'text-[#005fae] font-bold border-b-2 border-[#005fae]'
                  : 'text-on-surface-variant hover:text-on-surface'
              } h-16 flex items-center pt-0.5 font-semibold focus:outline-none transition-all cursor-pointer bg-transparent border-none`}
            >
              Backlog
            </button>
            <button
              id="header-tab-timeline"
              onClick={() => onProjectBoardSubTabChange?.('timeline')}
              className={`${
                projectBoardSubTab === 'timeline'
                  ? 'text-[#005fae] font-bold border-b-2 border-[#005fae]'
                  : 'text-on-surface-variant hover:text-on-surface'
              } h-16 flex items-center pt-0.5 font-semibold focus:outline-none transition-all cursor-pointer bg-transparent border-none`}
            >
              Timeline
            </button>
          </div>
        )}
      </div>

      {/* Right widgets: Search, Alerts, Help, User profile */}
      <div className="flex items-center gap-6">
        {/* Search Input bar */}
        <div className="relative w-64 md:w-80 h-9 hidden sm:block">
          <Search className="w-4.5 h-4.5 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={getSearchPlaceholder()}
            className="w-full h-full pl-9 pr-4 text-xs font-sans bg-[#f1f4f6] hover:bg-[#ebeef2] focus:bg-white focus:ring-2 focus:ring-wm-royal rounded-full border-none outline-none transition-all placeholder:text-on-surface-variant"
          />
        </div>

        {/* Support items */}
        <div className="flex items-center gap-3 border-l border-[#E1E4E8] pl-6 shrink-0">
          {/* Notifications Panel */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-surface-container-low rounded-full transition-colors relative"
            >
              <Bell className="w-5 h-5 text-on-surface-variant" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E1E4E8] rounded-xl shadow-lg py-3 z-50 text-xs">
                <div className="px-4 py-1.5 border-b border-[#E1E4E8] flex justify-between items-center font-bold text-wm-navy">
                  <span>Notifications</span>
                  <span className="text-[10px] text-wm-royal cursor-pointer">Mark all read</span>
                </div>
                <div className="divide-y divide-[#F1F4F6] max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3 hover:bg-surface-container-low transition-colors">
                      <p className="font-medium text-on-surface leading-tight">{n.text}</p>
                      <span className="text-[10px] text-on-surface-variant block mt-1">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Help Tooltip */}
          <button 
            onClick={() => onNavigateToTab?.('faq')}
            className="p-2 hover:bg-surface-container-low rounded-full transition-colors" 
            title="Hub Help"
          >
            <HelpCircle className="w-5 h-5 text-on-surface-variant" />
          </button>

          {/* Admin Platform Management shortcut (next to name on the left) */}
          {userRole === 'admin' && (
            <button
              id="header-admin-platform-mgt-btn"
              onClick={() => {
                onNavigateToTab?.('settings');
                onSetSettingsSubTab?.('platform');
              }}
              className="p-2 hover:bg-red-50 text-[#E0533C] rounded-full transition-all relative flex items-center justify-center animate-pulse shrink-0 border border-transparent hover:border-[#E0533C]/20"
              title="Supervisor Platform Command Dashboard"
            >
              <Sliders className="w-5 h-5 shrink-0" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            </button>
          )}

          {/* User profile with simple state dropdown */}
          <div className="relative">
            <div
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-3 cursor-pointer p-1 pr-3 hover:bg-[#F1F4F6] rounded-full transition-all"
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPyTh4ZqA7kjWPwR-sCujEJOhg7n16iz7uA67wBEeBWF36WSGZlp0qDliA4zF--C5o_NSxHdnHVGf1DKIQGNsX-bPH7Rd8qDv6XNTxjvx8B98mnsyVk9yHECSaAfB6F6FqGS4zRVOh90q5RnmBG-XnDT-mmtHBH828nU0RT397Ca_IB8kRBYOjoOeTnuWX1OzJhypYPxUQR01GgUe6l3hizgg8vpyipfCa2mfORJTcFZcOu5yVdbcTMroqeSVJSCyoigqx7w0tkJ8"
                alt="Alex Rivera Profile"
                className="w-8 h-8 rounded-full border border-gray-200"
                referrerPolicy="no-referrer"
              />
              <div className="hidden md:block text-left select-none max-w-[120px]">
                <div className="flex items-center gap-1.5">
                  {userRole === 'admin' && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" title="Admin Active Session"></span>
                  )}
                  <p className="text-xs font-bold leading-none text-on-surface truncate">{userNickname}</p>
                </div>
                <p className="text-[9px] font-sans font-semibold text-on-surface-variant uppercase tracking-wider mt-0.5">{userRole === 'admin' ? 'Administrator' : 'Summer Intern'}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant hidden md:block" />
            </div>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-60 bg-white border border-[#E1E4E8] rounded-xl shadow-lg py-2 z-50 text-xs text-left">
                <div className="px-4 py-2 border-b border-[#E1E4E8] font-bold text-on-surface-variant uppercase text-[9px] tracking-wider">
                  Trainee Progress Index: {brandProgress}%
                </div>
                
                {/* 1. Settings Portal Section */}
                <button
                  onClick={() => {
                    onOpenSettings();
                    setShowProfileDropdown(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#F1F4F6] text-left transition-all font-semibold ${
                    activeTab === 'settings' ? 'text-wm-royal bg-slate-50' : 'text-on-surface'
                  }`}
                >
                  <Settings className="w-4 h-4 text-on-surface-variant shrink-0" />
                  <span>Settings & Portal Configurations</span>
                </button>

                {/* 2. Interactive Support Modal trigger */}
                <button
                  onClick={() => {
                    onOpenSupport?.();
                    setShowProfileDropdown(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#F1F4F6] text-left transition-all font-semibold text-on-surface"
                >
                  <LifeBuoy className="w-4 h-4 text-on-surface-variant shrink-0" />
                  <span>Get Tech Support</span>
                </button>

                {/* Divider */}
                <div className="h-px bg-[#E1E4E8] my-1" />

                {/* 3. Secure Terminate Session (Sign Out) */}
                <button
                  onClick={() => {
                    onSignOut?.();
                    setShowProfileDropdown(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-red-50 text-left transition-all font-bold text-red-600"
                >
                  <LogOut className="w-4 h-4 text-red-500 shrink-0" />
                  <span>Sign Out Session</span>
                </button>

                <div className="px-3.5 py-1.5 bg-green-50 text-status-success flex items-center gap-1.5 rounded-lg m-2">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-semibold text-[9.5px]">Roadmap Secured</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
