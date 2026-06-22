import React, { useState } from 'react';
import { X, CheckCircle2, Sparkles, Laptop, Smartphone, Mail, Settings, HelpCircle, LifeBuoy } from 'lucide-react';

// Imports types & initial data
import {
  Task,
  Shoutout,
  RoadmapTask,
  FaqItem,
  Meeting,
  UserRole,
  UserPermissions,
  InternHardwarePreference,
  InternMentorPreference,
  ManagedUser,
  ManagedUserRole,
  CohortInternProfile,
  Contact,
  MentorVolunteerRequest,
  ProjectMilestone,
  OnboardingCultureValuesContent
} from './types';
import { 
  INITIAL_TASKS, 
  SHOUTOUTS, 
  ONBOARDING_ROADMAP, 
  ONBOARDING_CULTURE_VALUES_CONTENT,
  TECHNICAL_GUIDES, 
  PROFESSIONAL_SKILLS, 
  INTERNAL_SYSTEMS, 
  VIDEO_TUTORIALS, 
  INITIAL_CONTACTS, 
  INITIAL_FAQS,
  QUICK_LINKS,
  MEETINGS,
  PROJECT_MILESTONES
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

const ALEX_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPyTh4ZqA7kjWPwR-sCujEJOhg7n16iz7uA67wBEeBWF36WSGZlp0qDliA4zF--C5o_NSxHdnHVGf1DKIQGNsX-bPH7Rd8qDv6XNTxjvx8B98mnsyVk9yHECSaAfB6F6FqGS4zRVOh90q5RnmBG-XnDT-mmtHBH828nU0RT397Ca_IB8kRBYOjoOeTnuWX1OzJhypYPxUQR01GgUe6l3hizgg8vpyipfCa2mfORJTcFZcOu5yVdbcTMroqeSVJSCyoigqx7w0tkJ8';
const JORDAN_AVATAR = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120';
const MARCUS_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqQoFrciSutG-llI_5OmFesWaHSbfKbJ89PWvuoCpGtAGdAhoNIFwe6Op-LyyZWK-gHRo8DS_fj-7qI7FBrxz7hJ7hpHAyiWlUPp7VObpvLExELVn6XntTeXw4hX1hDW6aH1fKXemmsccxJC4ng1B5SzEiozR2oTeRVNBq4rKjopSGkfLBC38v1hcawwN5mA1SBQXNNtf23O2stHfICljEhzzjifaiSRDGR3EEuBoqgFpcTXgCw6sAFu_TlzhQQ-pYGXWJrJFxdM8';
const DAVID_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlFZmdGnXv88Iq2TLd4u47C1qVJKNlcNnWUH6Y8l7-SvFHMUH1zH1AAvi6AtCowAqRHIO-0tmyIma9Pff_OX34Fl_mJRmzFJeulL8_JTc7lwvhM_B5QPjGv-VNbIjjZGjZ_B4PQrxkyOjuVmhaRm4CPIwZ2gffZawnHJOOl8QaQIF85yibmOP6geQ8TIg5hfGL7tmaRX9TXcVJeDMdlONWgEJHw4K3FoqQy_8_L7RD76ogYVkAYX63Vzr9spX08CIo-WW01p6Lo_k';
const SARAH_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmwwOwBpBgsYSE1SoGXp1Wa7o_edMgDb7qj4xRspqVRNb5EdBl32A40gQj1ZJrL6Od9tZVzh6G27x8T9XL3Zw0r9ePCTrbcVt-VhSNIM-61Nr0YnAlEnKwEk7fb0-WWuE20Wg6rf4cDnqq0PbYmyVB_EjxKbQXKqZffdowXXHbFsqOzgpIUsL90dPkYnmYTN_ZtUOWwhZvbt2-4jTMURjCZAqG9YM0gycWTQyJpzafPlCzxgBFwjLZZvitek1BD8niZSu9hXNqt9g';
const TYLER_AVATAR = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120';
const JOHN_AVATAR = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120';
const DEFAULT_NEW_INTERN_AVATAR = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120';

const DEFAULT_MANAGED_USERS: ManagedUser[] = [
  { id: 'usr-1', name: 'Alex Rivera', email: 'a.rivera@genesysworks.org', role: 'Summer Intern', department: 'Product Engineering', status: 'Active', lastLogin: 'Just now', hardware: 'MacBook Pro', avatar: ALEX_AVATAR, mentorPreference: 'Marcus Chen' },
  { id: 'usr-2', name: 'Jordan Smith', email: 'j.smith@genesysworks.org', role: 'Summer Intern', department: 'Data & Analytics', status: 'Active', lastLogin: '12 mins ago', hardware: 'Lenovo ThinkPad', avatar: JORDAN_AVATAR, mentorPreference: 'Marcus Chen' },
  { id: 'usr-3', name: 'Marcus Chen', email: 'm.chen@westmonroe.com', role: 'Technical Mentor', department: 'Data & Analytics', status: 'Active', lastLogin: '1 hour ago', hardware: 'MacBook Pro', avatar: MARCUS_AVATAR },
  { id: 'usr-4', name: 'David Park', email: 'd.park@westmonroe.com', role: 'Technical Mentor', department: 'Customer Experience', status: 'Active', lastLogin: '3 hours ago', hardware: 'Lenovo ThinkPad', avatar: DAVID_AVATAR },
  { id: 'usr-5', name: 'Sarah Anderson', email: 's.anderson@genesysworks.org', role: 'Program Coordinator', department: 'Career Development', status: 'Active', lastLogin: 'Yesterday', hardware: 'Lenovo ThinkPad', avatar: SARAH_AVATAR },
  { id: 'usr-6', name: 'Samantha Vance', email: 's.vance@genesysworks.org', role: 'Administrator', department: 'Operations', status: 'Active', lastLogin: '2 days ago', hardware: 'MacBook Pro', avatar: DEFAULT_NEW_INTERN_AVATAR },
  { id: 'usr-7', name: 'Tyler Durden', email: 't.durden@genesysworks.org', role: 'Summer Intern', department: 'Operations', status: 'On Vacation', lastLogin: 'Last week', hardware: 'Lenovo ThinkPad', avatar: TYLER_AVATAR, mentorPreference: 'Sarah Anderson' },
  { id: 'usr-8', name: 'John Doe', email: 'j.doe@unprovisioned.org', role: 'Summer Intern', department: 'Product Engineering', status: 'Provisioning', lastLogin: 'Never', hardware: 'MacBook Pro', avatar: JOHN_AVATAR, mentorPreference: 'David Park' }
];

const createDefaultCohortProfile = (userId: string): CohortInternProfile => ({
  userId,
  onboardingChecklist: [
    { id: `${userId}-ob-1`, title: 'Sign offer letter & background forms', category: 'Pre-Arrival', checked: false },
    { id: `${userId}-ob-2`, title: 'Complete Genesys bio survey', category: 'Pre-Arrival', checked: false },
    { id: `${userId}-ob-3`, title: 'Request dynamic laptop procurement keys', category: 'Pre-Arrival', checked: false },
    { id: `${userId}-ob-4`, title: 'Verify workspace login tokens', category: 'Week 1', checked: false },
    { id: `${userId}-ob-5`, title: 'Schedule sync with Assigned Onboarding Buddy', category: 'Week 1', checked: false },
    { id: `${userId}-ob-6`, title: 'Participate in cohort professional ethics seminar', category: 'Week 1', checked: false },
    { id: `${userId}-ob-7`, title: 'Submit 30-day intern self-alignment logbook', category: '30-Day', checked: false }
  ],
  courses: [
    { id: `${userId}-c-1`, title: 'ServiceNow Fundamentals', progress: 0, category: 'Technical Tooling', type: 'course' },
    { id: `${userId}-c-2`, title: 'Excel Analytics Deep Dive', progress: 0, category: 'Technical Tooling', type: 'course' },
    { id: `${userId}-c-3`, title: 'MFA & Enterprise Hardware Guidelines', progress: 0, category: 'Governance', type: 'lab' },
    { id: `${userId}-c-4`, title: 'Slack & Professional Communication Etiquette', progress: 0, category: 'Professionalism', type: 'video' }
  ]
});

const createSeededCohortProfile = (
  userId: string,
  checkedItemCount: number,
  courseProgress: [number, number, number, number]
): CohortInternProfile => {
  const profile = createDefaultCohortProfile(userId);
  return {
    ...profile,
    onboardingChecklist: profile.onboardingChecklist.map((item, index) => ({
      ...item,
      checked: index < checkedItemCount
    })),
    courses: profile.courses.map((course, index) => ({
      ...course,
      progress: courseProgress[index] ?? 0
    }))
  };
};

const DEFAULT_COHORT_PROFILES: CohortInternProfile[] = [
  createSeededCohortProfile('usr-1', 4, [100, 85, 100, 40]),
  createSeededCohortProfile('usr-2', 3, [40, 10, 100, 90]),
  createSeededCohortProfile('usr-7', 6, [100, 100, 100, 100]),
  createSeededCohortProfile('usr-8', 1, [0, 0, 20, 0])
];

const DEFAULT_ACTIVE_INTERN_USER_ID = 'usr-1';

const createUserAssignee = (user?: ManagedUser) => (
  user ? { name: user.name, avatar: user.avatar } : undefined
);

const DEFAULT_TASKS: Task[] = INITIAL_TASKS.map(task => {
  const assignedUser = task.assignee
    ? DEFAULT_MANAGED_USERS.find(user => user.role === 'Summer Intern' && user.name === task.assignee?.name)
    : undefined;

  return assignedUser
    ? { ...task, assigneeUserId: assignedUser.id, assignee: createUserAssignee(assignedUser) }
    : task;
});

export default function App() {
  // Navigation Routing State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [projectBoardSubTab, setProjectBoardSubTab] = useState<'board' | 'backlog' | 'timeline'>('board');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Primary Interactive States initialized from mockup specs
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);
  const [shoutouts, setShoutouts] = useState<Shoutout[]>(SHOUTOUTS);
  const [roadmap, setRoadmap] = useState<RoadmapTask[]>(ONBOARDING_ROADMAP);
  const [onboardingCultureValuesContent, setOnboardingCultureValuesContent] = useState<OnboardingCultureValuesContent>(ONBOARDING_CULTURE_VALUES_CONTENT);
  const [faqItems, setFaqItems] = useState<FaqItem[]>(INITIAL_FAQS);
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [mentorVolunteerRequests, setMentorVolunteerRequests] = useState<MentorVolunteerRequest[]>([]);
  const [projectMilestones, setProjectMilestones] = useState<ProjectMilestone[]>(PROJECT_MILESTONES);
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
  const [userHardwarePreference, setUserHardwarePreference] = useState<InternHardwarePreference>('MacBook Pro');
  const [userMentorPreference, setUserMentorPreference] = useState<InternMentorPreference>('Marcus Chen');
  const [managedUsers, setManagedUsers] = useState<ManagedUser[]>(DEFAULT_MANAGED_USERS);
  const [cohortProfiles, setCohortProfiles] = useState<CohortInternProfile[]>(DEFAULT_COHORT_PROFILES);
  const [activeInternUserId, setActiveInternUserId] = useState<string>(DEFAULT_ACTIVE_INTERN_USER_ID);
  const [settingsSubTab, setSettingsSubTab] = useState<'profile' | 'permissions' | 'admin-access' | 'database' | 'platform'>('profile');

  // Multi-view and Simulation access controls
  const [userRole, setUserRole] = useState<UserRole>('intern');
  const [permissions, setPermissions] = useState<UserPermissions>({
    allowInternsToDeleteTasks: false, // Default false to demonstrate permission intercept!
    allowInternsToCreateFAQ: true,
    allowInternsToSyncMeetings: true,
    allowInternsToSelfApproveMilestones: false // Default false to demonstrate permission intercept!
  });

  const summerInternUsers = managedUsers.filter(user => user.role === 'Summer Intern');
  const activeInternUser = summerInternUsers.find(user => user.id === activeInternUserId) ?? summerInternUsers[0];

  React.useEffect(() => {
    if (!activeInternUser) return;

    setUserNickname(activeInternUser.name);
    setUserHardwarePreference(activeInternUser.hardware);
    setUserMentorPreference(activeInternUser.mentorPreference ?? 'Marcus Chen');
  }, [activeInternUser]);

  const handleResetWorkspace = () => {
    setTasks(DEFAULT_TASKS);
    setShoutouts(SHOUTOUTS);
    setRoadmap(ONBOARDING_ROADMAP);
    setOnboardingCultureValuesContent(ONBOARDING_CULTURE_VALUES_CONTENT);
    setFaqItems(INITIAL_FAQS);
    setContacts(INITIAL_CONTACTS);
    setMentorVolunteerRequests([]);
    setProjectMilestones(PROJECT_MILESTONES);
    setMeetings(MEETINGS);
    setBrandProgress(42);
    setUserNickname('Alex Rivera');
    setUserHardwarePreference('MacBook Pro');
    setUserMentorPreference('Marcus Chen');
    setManagedUsers(DEFAULT_MANAGED_USERS);
    setCohortProfiles(DEFAULT_COHORT_PROFILES);
    setActiveInternUserId(DEFAULT_ACTIVE_INTERN_USER_ID);
    setUserRole('intern');
    setPermissions({
      allowInternsToDeleteTasks: false,
      allowInternsToCreateFAQ: true,
      allowInternsToSyncMeetings: true,
      allowInternsToSelfApproveMilestones: false
    });
  };

  const handleAddInternUser = (newInternUser: ManagedUser) => {
    setManagedUsers(prev => [...prev, newInternUser]);
    setCohortProfiles(prev => [...prev, createDefaultCohortProfile(newInternUser.id)]);
    setActiveInternUserId(newInternUser.id);
    setUserNickname(newInternUser.name);
    setUserHardwarePreference(newInternUser.hardware);
    setUserMentorPreference(newInternUser.mentorPreference ?? 'Marcus Chen');
  };

  const handleManagedUserRoleChange = (userId: string, newRole: ManagedUserRole) => {
    const nextActiveInternUser = managedUsers.find(user => (
      user.id !== userId && user.role === 'Summer Intern'
    ));

    setManagedUsers(prev => prev.map(user => (
      user.id === userId ? { ...user, role: newRole } : user
    )));

    if (newRole === 'Summer Intern') {
      setCohortProfiles(prev => (
        prev.some(profile => profile.userId === userId)
          ? prev
          : [...prev, createDefaultCohortProfile(userId)]
      ));
      return;
    }

    setTasks(prev => prev.map(task => (
      task.assigneeUserId === userId
        ? { ...task, assigneeUserId: undefined, assignee: undefined }
        : task
    )));

    if (activeInternUserId === userId && nextActiveInternUser) {
      setActiveInternUserId(nextActiveInternUser.id);
      setUserNickname(nextActiveInternUser.name);
      setUserHardwarePreference(nextActiveInternUser.hardware);
      setUserMentorPreference(nextActiveInternUser.mentorPreference ?? 'Marcus Chen');
    }
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
          assigneeUserId: activeInternUser?.id,
          assignee: createUserAssignee(activeInternUser),
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
          assigneeUserId: activeInternUser?.id,
          assignee: createUserAssignee(activeInternUser),
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
      assigneeUserId: activeInternUser?.id,
      assignee: createUserAssignee(activeInternUser)
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
            managedUsers={managedUsers}
            activeInternUserId={activeInternUser?.id ?? ''}
            projectMilestones={projectMilestones}
            setProjectMilestones={setProjectMilestones}
            meetings={meetings}
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
            contacts={contacts}
            setContacts={setContacts}
            mentorVolunteerRequests={mentorVolunteerRequests}
            setMentorVolunteerRequests={setMentorVolunteerRequests}
            searchQuery={searchQuery}
            userRole={userRole}
            triggerToast={triggerToast}
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
            cultureValuesContent={onboardingCultureValuesContent}
            setCultureValuesContent={setOnboardingCultureValuesContent}
            brandProgress={brandProgress}
            setBrandProgress={setBrandProgress}
            userRole={userRole}
            permissions={permissions}
            triggerToast={triggerToast}
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
            activeInternUserId={activeInternUser?.id ?? ''}
            setActiveInternUserId={setActiveInternUserId}
            managedUsers={managedUsers}
            setManagedUsers={setManagedUsers}
            onAddInternUser={handleAddInternUser}
            onManagedUserRoleChange={handleManagedUserRoleChange}
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
            managedUsers={managedUsers}
            cohortProfiles={cohortProfiles}
            setCohortProfiles={setCohortProfiles}
            tasks={tasks}
            setTasks={setTasks}
            activeInternUserId={activeInternUser?.id ?? ''}
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
          userNickname={activeInternUser?.name ?? userNickname}
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
