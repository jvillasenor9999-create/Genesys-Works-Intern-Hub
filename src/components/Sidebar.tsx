import { 
  Building2, 
  LayoutDashboard, 
  KanbanSquare, 
  GraduationCap, 
  Users, 
  HelpCircle, 
  ClipboardCheck, 
  LifeBuoy, 
  Settings, 
  LogOut 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSupport: () => void;
  onOpenSettings: () => void;
  onSignOut: () => void;
  userRole?: string;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  onOpenSupport, 
  onOpenSettings, 
  onSignOut,
  userRole = 'intern'
}: SidebarProps) {
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ...(userRole === 'admin' ? [{ id: 'interns-dashboard', label: 'Cohort Overview', icon: Users }] : []),
    { id: 'project-board', label: 'Project Board', icon: KanbanSquare },
    { id: 'learning-hub', label: 'Learning Hub', icon: GraduationCap },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'onboarding', label: 'Onboarding', icon: ClipboardCheck },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#E1E4E8] flex flex-col h-screen fixed left-0 top-0 z-40 p-5 shrink-0 select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 bg-wm-navy rounded-lg flex items-center justify-center shrink-0">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg font-display font-bold text-wm-navy leading-none truncate">Genesys Works</h1>
          <p className="text-xs text-on-surface-variant font-sans mt-0.5 font-medium">Intern Hub</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#d4e3ff] text-[#001c3a] font-bold'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#005fae]' : 'text-on-surface-variant'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Simplified, Elegant Footer Info */}
      <div className="mt-auto pt-6 border-t border-[#E1E4E8] text-center">
        <div className="bg-[#FAFBCF]/30 border border-[#E1E468]/35 text-[10px] text-gray-500 rounded-lg p-3 text-left leading-normal font-medium flex items-start gap-2">
          <span>🛡️</span>
          <span>Access core help, portal settings, and logout tools anytime using the dropdown on your username header above.</span>
        </div>
        <p className="text-[9px] text-[#A2AEBA] font-mono tracking-widest uppercase mt-4">System Secured v2.0</p>
      </div>
    </aside>
  );
}
