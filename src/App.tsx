import React, { useState } from 'react';
import { X, CheckCircle2, Sparkles, Laptop, Smartphone, Mail, Settings, HelpCircle, LifeBuoy } from 'lucide-react';

// Imports types & initial data
import { Task, Shoutout, RoadmapTask, FaqItem, Meeting, UserRole, UserPermissions } from './types';
import { 
  INITIAL_TASKS, 
  SHOUTOUTS, 
  ONBOARDING_ROADMAP, 
  TECHNICAL_GUIDES, 
  PROFESSIONAL_SKILLS, 
  INTERNAL_SYSTEMS, 
  VIDEO_TUTORIALS, 
  INITIAL_CONTACTS, 
  INITIAL_FAQS,
  QUICK_LINKS,
  MEETINGS
} from './data';

// Imports components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MeetingsSyncModal from './components/MeetingsSyncModal';

// Imports views
import DashboardView from './components/views/DashboardView';
import ProjectBoardView from './components/views/ProjectBoardView';
import LearningHubView from './components/views/LearningHubView';
import ContactsView from './components/views/ContactsView';
import FAQView from './components/views/FAQView';
import OnboardingView from './components/views/OnboardingView';
import SettingsView from './components/views/SettingsView';
import InternsDashboard from './components/views/InternsDashboard';

export default function App() {
  // Navigation Routing State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [projectBoardSubTab, setProjectBoardSubTab] = useState<'board' | 'backlog' | 'timeline'>('board');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Primary Interactive States initialized from mockup specs
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [shoutouts, setShoutouts] = useState<Shoutout[]>(SHOUTOUTS);
  const [roadmap, setRoadmap] = useState<RoadmapTask[]>(ONBOARDING_ROADMAP);
  const [faqItems, setFaqItems] = useState<FaqItem[]>(INITIAL_FAQS);
  const [brandProgress, setBrandProgress] = useState<number>(42);
  const [meetings, setMeetings] = useState<Meeting[]>(MEETINGS);

  // Overlay Modals Toggles State
  const [showSupportModal, setShowSupportModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState<boolean>(false);
  const [showMeetingsModal, setShowMeetingsModal] = useState<boolean>(false);

  // New Global Notification message feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Profile Settings customizable states
  const [userNickname, setUserNickname] = useState<string>('Alex Rivera');
  const [userHardwarePreference, setUserHardwarePreference] = useState<string>('MacBook Pro');
  const [userMentorPreference, setUserMentorPreference] = useState<string>('Marcus Chen');
  const [settingsSubTab, setSettingsSubTab] = useState<'profile' | 'permissions' | 'admin-access' | 'database' | 'platform'>('profile');

  // Multi-view and Simulation access controls
  const [userRole, setUserRole] = useState<UserRole>('intern');
  const [permissions, setPermissions] = useState<UserPermissions>({
    allowInternsToDeleteTasks: false, // Default false to demonstrate permission intercept!
    allowInternsToCreateFAQ: true,
    allowInternsToSyncMeetings: true,
    allowInternsToSelfApproveMilestones: false // Default false to demonstrate permission intercept!
  });

  const handleResetWorkspace = () => {
    setTasks(INITIAL_TASKS);
    setShoutouts(SHOUTOUTS);
    setRoadmap(ONBOARDING_ROADMAP);
    setFaqItems(INITIAL_FAQS);
    setMeetings(MEETINGS);
    setBrandProgress(42);
    setUserNickname('Alex Rivera');
    setUserHardwarePreference('MacBook Pro');
    setUserMentorPreference('Marcus Chen');
    setUserRole('intern');
    setPermissions({
      allowInternsToDeleteTasks: false,
      allowInternsToCreateFAQ: true,
      allowInternsToSyncMeetings: true,
      allowInternsToSelfApproveMilestones: false
    });
  };

  const handleLoadPresetTasks = (presetType: 'sprint' | 'ops' | 'minimal') => {
    let preset: Task[] = [];
    if (presetType === 'sprint') {
      preset = [
        {
          id: 'sprint-1',
          title: 'Resolve Salesforce CRM sandbox pipeline replication limits',
          status: 'todo',
          type: 'Bug Fix',
          priority: 'High',
          dueDate: 'Sep 25',
          description: 'The standard sandboxed accounts are throttling metadata synchronization. We need to split schema partitions and test incremental updates in small batches.',
          comments: []
        },
        {
          id: 'sprint-2',
          title: 'Refile React-Router nested view transition indices',
          status: 'progress',
          type: 'Feature',
          priority: 'Medium',
          dueDate: 'Sep 28',
          description: 'Improve animations across secondary dashboard lists. Make sure there is zero flicker when swapping from calendar sync dialogs directly to faq articles.',
          assignee: {
            name: userNickname,
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPyTh4ZqA7kjWPwR-sCujEJOhg7n16iz7uA67wBEeBWF36WSGZlp0qDliA4zF--C5o_NSxHdnHVGf1DKIQGNsX-bPH7Rd8qDv6XNTxjvx8B98mnsyVk9yHECSaAfB6F6FqGS4zRVOh90q5RnmBG-XnDT-mmtHBH828nU0RT397Ca_IB8kRBYOjoOeTnuWX1OzJhypYPxUQR01GgUe6l3hizgg8vpyipfCa2mfORJTcFZcOu5yVdbcTMroqeSVJSCyoigqx7w0tkJ8'
          },
          comments: []
        },
        {
          id: 'sprint-3',
          title: 'Deploy PowerBI dashboard schemas to CX staging environment',
          status: 'review',
          type: 'Feature',
          priority: 'High',
          dueDate: 'Sep 29',
          description: 'Compile SQL analytics queries and push deployment blocks to supervisor evaluation queues.',
          comments: []
        }
      ];
    } else if (presetType === 'ops') {
      preset = [
        {
          id: 'ops-1',
          title: 'Refining West Monroe summer kickoff presenter deck',
          status: 'backlog',
          type: 'Opportunity',
          priority: 'Medium',
          dueDate: 'Future Sprint',
          description: 'Align color palettes and compile intern summary charts for senior mentorship staff presentations.',
          comments: []
        },
        {
          id: 'ops-2',
          title: 'Complete Slack communication & email etiquette guidelines',
          status: 'progress',
          type: 'Feature',
          priority: 'Low',
          dueDate: 'Tomorrow',
          description: 'Review the technical and professional communications guide in the Learning Hub, and practice drafting project-update briefings.',
          assignee: {
            name: userNickname,
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPyTh4ZqA7kjWPwR-sCujEJOhg7n16iz7uA67wBEeBWF36WSGZlp0qDliA4zF--C5o_NSxHdnHVGf1DKIQGNsX-bPH7Rd8qDv6XNTxjvx8B98mnsyVk9yHECSaAfB6F6FqGS4zRVOh90q5RnmBG-XnDT-mmtHBH828nU0RT397Ca_IB8kRBYOjoOeTnuWX1OzJhypYPxUQR01GgUe6l3hizgg8vpyipfCa2mfORJTcFZcOu5yVdbcTMroqeSVJSCyoigqx7w0tkJ8'
          },
          comments: []
        }
      ];
    } else {
      preset = [
        {
          id: 'min-1',
          title: 'Hello World task',
          status: 'todo',
          type: 'Feature',
          priority: 'Low',
          dueDate: 'Next week',
          description: 'A minimal start to build project card systems completely from scratch.',
          comments: []
        }
      ];
    }
    setTasks(preset);
  };

  // New Task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskType, setNewTaskType] = useState<'Feature' | 'Bug Fix' | 'Opportunity'>('Feature');
  const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('Tomorrow');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      status: 'todo',
      type: newTaskType,
      priority: newTaskPriority,
      dueDate: newTaskDueDate,
      description: newTaskDescription,
      comments: [],
      assignee: {
        name: 'Alex Rivera',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPyTh4ZqA7kjWPwR-sCujEJOhg7n16iz7uA67wBEeBWF36WSGZlp0qDliA4zF--C5o_NSxHdnHVGf1DKIQGNsX-bPH7Rd8qDv6XNTxjvx8B98mnsyVk9yHECSaAfB6F6FqGS4zRVOh90q5RnmBG-XnDT-mmtHBH828nU0RT397Ca_IB8kRBYOjoOeTnuWX1OzJhypYPxUQR01GgUe6l3hizgg8vpyipfCa2mfORJTcFZcOu5yVdbcTMroqeSVJSCyoigqx7w0tkJ8'
      }
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setShowNewTaskModal(false);
    triggerToast(`Created task: "${newTask.title}" directly on the Kanban board!`);
  };

  const handleSupportInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSupportModal(false);
    triggerToast('Secure inquiry request logged directly to Genesys Works support coordinator databases.');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSettingsModal(false);
    triggerToast('Summer intern profile settings updated and synchronized with firm AD registers.');
  };

  // Switch tabs programmatically from card actions
  const handleNavigateToTab = (tab: string) => {
    setActiveTab(tab);
    setSearchQuery('');
  };

  // Render view depending on state routing
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            tasks={tasks}
            setTasks={setTasks}
            shoutouts={shoutouts}
            setShoutouts={setShoutouts}
            quickLinks={QUICK_LINKS}
            meetings={meetings}
            brandProgress={brandProgress}
            onNavigateToTab={handleNavigateToTab}
            onOpenNewTaskModal={() => setShowNewTaskModal(true)}
            onOpenMeetingsModal={() => setShowMeetingsModal(true)}
          />
        );
      case 'project-board':
        return (
          <ProjectBoardView
            tasks={tasks}
            setTasks={setTasks}
            searchQuery={searchQuery}
            onOpenNewTaskModal={() => setShowNewTaskModal(true)}
            subTab={projectBoardSubTab}
            setSubTab={setProjectBoardSubTab}
            userRole={userRole}
            permissions={permissions}
          />
        );
      case 'learning-hub':
        return (
          <LearningHubView
            technicalGuides={TECHNICAL_GUIDES}
            professionalSkills={PROFESSIONAL_SKILLS}
            internalSystems={INTERNAL_SYSTEMS}
            videoTutorials={VIDEO_TUTORIALS}
            searchQuery={searchQuery}
          />
        );
      case 'contacts':
        return (
          <ContactsView
            contacts={INITIAL_CONTACTS}
            searchQuery={searchQuery}
          />
        );
      case 'faq':
        return (
          <FAQView
            faqItems={faqItems}
            setFaqItems={setFaqItems}
            searchQuery={searchQuery}
            userRole={userRole}
            permissions={permissions}
          />
        );
      case 'onboarding':
        return (
          <OnboardingView
            roadmap={roadmap}
            setRoadmap={setRoadmap}
            brandProgress={brandProgress}
            setBrandProgress={setBrandProgress}
            userRole={userRole}
            permissions={permissions}
          />
        );
      case 'settings':
        return (
          <SettingsView
            userRole={userRole}
            setUserRole={setUserRole}
            permissions={permissions}
            setPermissions={setPermissions}
            userNickname={userNickname}
            setUserNickname={setUserNickname}
            userHardwarePreference={userHardwarePreference}
            setUserHardwarePreference={setUserHardwarePreference}
            userMentorPreference={userMentorPreference}
            setUserMentorPreference={setUserMentorPreference}
            onResetWorkspace={handleResetWorkspace}
            onClearTasks={() => setTasks([])}
            onLoadPresetTasks={handleLoadPresetTasks}
            triggerToast={triggerToast}
            activeSubTab={settingsSubTab}
            setActiveSubTab={setSettingsSubTab}
          />
        );
      case 'interns-dashboard':
        return (
          <InternsDashboard
            userRole={userRole}
            triggerToast={triggerToast}
            userNickname={userNickname}
          />
        );
      default:
        return <div className="text-center p-8">Section not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] font-sans text-[#181c1e] flex antialiased select-none">
      
      {/* Toast notifications feedback banner overlay */}
      {toastMessage && (
        <div className="fixed top-6 right-6 bg-[#002B49] text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 z-50 text-xs font-bold font-sans transition-all animate-bounce">
          <Sparkles className="w-5 h-5 text-shoutout-gold fill-shoutout-gold" strokeWidth={2} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation (Fixed width: 64) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleNavigateToTab}
        onOpenSupport={() => setShowSupportModal(true)}
        onOpenSettings={() => handleNavigateToTab('settings')}
        onSignOut={() => triggerToast('Logging out... System connections secure. Session closed.')}
        userRole={userRole}
      />

      {/* Main app container with sidebar offset (width: calc(100% - 16rem)) */}
      <div className="flex-1 flex flex-col pl-64 min-h-screen select-none">
        
        {/* Global sticky header */}
        <Header
          activeTab={activeTab}
          projectBoardSubTab={projectBoardSubTab}
          onProjectBoardSubTabChange={setProjectBoardSubTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenSettings={() => handleNavigateToTab('settings')}
          brandProgress={brandProgress}
          onNavigateToTab={handleNavigateToTab}
          userNickname={userNickname}
          userRole={userRole}
          onSetSettingsSubTab={setSettingsSubTab}
          onOpenSupport={() => setShowSupportModal(true)}
          onSignOut={() => triggerToast('Logging out... System connections secure. Session closed.')}
        />

        {/* Dynamic Inner page scrollable view body */}
        <main className="flex-1 p-10 overflow-y-auto max-w-7xl mx-auto w-full">
          {renderActiveView()}
        </main>
      </div>

      {/* Standard Modal dialogs */}
      
      {/* 1. Add New Kanban Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-gray-200 shadow-2xl max-w-md w-full overflow-hidden text-left animate-zoom-in select-none">
            
            <div className="bg-wm-navy p-5 text-white flex justify-between items-center select-none">
              <h4 className="text-sm font-display font-medium leading-none">Draft Project Task card</h4>
              <button onClick={() => setShowNewTaskModal(false)} className="text-white hover:opacity-80 p-0.5 outline-none">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewTask} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-on-surface-variant uppercase font-bold">Task Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Audit SSO access tokens"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full text-xs p-3 bg-neutral-100 border-none rounded focus:bg-white focus:ring-1 focus:ring-wm-royal outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-on-surface-variant uppercase font-bold">Task Class</label>
                  <select 
                    value={newTaskType}
                    onChange={(e: any) => setNewTaskType(e.target.value)}
                    className="w-full text-xs p-3 bg-neutral-100 border-none rounded cursor-pointer outline-none"
                  >
                    <option>Feature</option>
                    <option>Bug Fix</option>
                    <option>Opportunity</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-on-surface-variant uppercase font-bold">Priority Scale</label>
                  <select 
                    value={newTaskPriority}
                    onChange={(e: any) => setNewTaskPriority(e.target.value)}
                    className="w-full text-xs p-3 bg-neutral-100 border-none rounded cursor-pointer outline-none"
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-on-surface-variant uppercase font-bold">Target Date</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Tomorrow or Sep 29"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="w-full text-xs p-3 bg-neutral-100 border-none rounded focus:bg-white focus:ring-1 focus:ring-wm-royal outline-none"
                />
              </div>

              <div className="space-y-1 bg-neutral-50/50 p-2.5 rounded border border-gray-100">
                <label className="text-[10px] font-mono text-on-surface-variant uppercase font-bold">Task Narrative / Description</label>
                <textarea 
                  placeholder="Give high-level description or checklist items for accountability..."
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  rows={3}
                  className="w-full text-xs p-2 bg-neutral-100 border border-transparent rounded focus:bg-white focus:border-wm-royal outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-150">
                <button 
                  type="button" 
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:text-on-surface"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-wm-royal text-white px-5 py-2 rounded-lg font-bold hover:opacity-95 text-xs text-left"
                >
                  Create Task
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* 2. Interactive Support Dialog Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-gray-200 shadow-2xl max-w-md w-full overflow-hidden text-left animate-zoom-in select-none">
            
            <div className="bg-wm-navy p-5 text-white flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <LifeBuoy className="w-5 h-5 text-shoutout-gold" />
                <h4 className="text-sm font-display font-medium leading-none">Genesys Works Support Desk</h4>
              </div>
              <button onClick={() => setShowSupportModal(false)} className="text-white hover:opacity-80 p-0.5 outline-none">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleSupportInquirySubmit} className="p-6 space-y-4">
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Log a ticket instantly with the Genesys Works support coordinator staff. Responses are directed to your registered intern portal email interface.
              </p>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-on-surface-variant uppercase font-bold">Category</label>
                <select className="w-full text-xs p-3 bg-neutral-100 border-none rounded cursor-pointer outline-none">
                  <option>Workstation Issues & Hardware</option>
                  <option>Hours Sheets submission error</option>
                  <option>Zoom Sync Links access</option>
                  <option>Other / Question</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-on-surface-variant uppercase font-bold">Urgency</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs">
                    <input type="radio" name="urgency" defaultChecked className="text-wm-royal" />
                    <span>Standard</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs">
                    <input type="radio" name="urgency" className="text-wm-royal" />
                    <span className="text-status-blocked font-bold">Urgent</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-on-surface-variant uppercase font-bold">Describe your question</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Tell us what you need support with..."
                  className="w-full text-xs p-3 bg-neutral-100 border-none rounded focus:bg-white focus:ring-1 focus:ring-wm-royal outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-150">
                <button 
                  type="button" 
                  onClick={() => setShowSupportModal(false)}
                  className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:text-on-surface"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-wm-royal text-white px-5 py-2 rounded-lg font-bold text-xs"
                >
                  Log Support Request
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* 4. Full Schedule & Meetings Outlook Sync Center Modal */}
      {showMeetingsModal && (
        <MeetingsSyncModal 
          meetings={meetings}
          setMeetings={setMeetings}
          onClose={() => setShowMeetingsModal(false)}
          triggerToast={triggerToast}
          userRole={userRole}
          permissions={permissions}
        />
      )}

    </div>
  );
}
