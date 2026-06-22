import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  KanbanSquare, 
  GraduationCap, 
  ClipboardCheck, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  PlayCircle, 
  ArrowRight,
  TrendingUp,
  UserCheck,
  AlertCircle,
  Video,
  Award,
  ChevronRight,
  Trash2,
  Check,
  Sliders,
  Calendar,
  Lock,
  Unlock,
  Building
} from 'lucide-react';
import {
  Task,
  ManagedUser,
  CohortInternProfile,
  CohortChecklistItem,
  CohortCourse
} from '../../types';

interface InternsDashboardProps {
  userRole: 'admin' | 'intern';
  triggerToast: (msg: string) => void;
  userNickname: string;
  managedUsers: ManagedUser[];
  cohortProfiles: CohortInternProfile[];
  setCohortProfiles: React.Dispatch<React.SetStateAction<CohortInternProfile[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  activeInternUserId: string;
}

interface CohortInternViewModel {
  id: string;
  name: string;
  email: string;
  department: ManagedUser['department'];
  avatar: string;
  onboardingProgress: number;
  learningCompleteness: number;
  hardwareChoice: string;
  mentor: string;
  tasks: Task[];
  onboardingChecklist: CohortChecklistItem[];
  courses: CohortCourse[];
}

export default function InternsDashboard({
  userRole,
  triggerToast,
  managedUsers,
  cohortProfiles,
  setCohortProfiles,
  tasks,
  setTasks,
  activeInternUserId
}: InternsDashboardProps) {
  const calculateProgress = (items: { checked: boolean }[]) => (
    items.length === 0 ? 0 : Math.round((items.filter(item => item.checked).length / items.length) * 100)
  );

  const calculateLearningCompleteness = (courses: CohortCourse[]) => (
    courses.length === 0 ? 0 : Math.round(courses.reduce((total, course) => total + course.progress, 0) / courses.length)
  );

  const internUsers = managedUsers.filter(user => user.role === 'Summer Intern');
  const interns: CohortInternViewModel[] = internUsers.map(user => {
    const cohortProfile = cohortProfiles.find(profile => profile.userId === user.id);
    const onboardingChecklist = cohortProfile?.onboardingChecklist ?? [];
    const courses = cohortProfile?.courses ?? [];

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      department: user.department,
      avatar: user.avatar,
      onboardingProgress: calculateProgress(onboardingChecklist),
      learningCompleteness: calculateLearningCompleteness(courses),
      hardwareChoice: user.hardware,
      mentor: user.mentorPreference ?? 'Unassigned',
      tasks: tasks.filter(task => task.assigneeUserId === user.id),
      onboardingChecklist,
      courses
    };
  });

  const [selectedInternId, setSelectedInternId] = useState<string>(activeInternUserId);
  
  // Dashboard Sub-Tabs
  const [viewTab, setViewTab] = useState<'board' | 'learning' | 'checklist' | 'timeline'>('board');
  
  // Quick filters state
  const [searchText, setSearchText] = useState('');
  const [deptFilter, setDeptFilter] = useState<string>('All');

  const selectedInternIdForView = interns.some(intern => intern.id === selectedInternId)
    ? selectedInternId
    : activeInternUserId && interns.some(intern => intern.id === activeInternUserId)
    ? activeInternUserId
    : interns[0]?.id ?? '';
  const activeIntern = interns.find(i => i.id === selectedInternIdForView);
  const averageProgress = interns.length > 0
    ? Math.round(interns.reduce((a, b) => a + b.onboardingProgress, 0) / interns.length)
    : 0;

  React.useEffect(() => {
    if (activeInternUserId && interns.some(intern => intern.id === activeInternUserId)) {
      setSelectedInternId(activeInternUserId);
    }
  }, [activeInternUserId, managedUsers]);

  // Helper function to count tasks by status for an intern
  const getTaskCount = (intern: CohortInternViewModel, status: Task['status']) => {
    return intern.tasks.filter(t => t.status === status).length;
  };

  // Switch check value of checklist step
  const handleToggleChecklistStep = (internId: string, itemId: string) => {
    const intern = interns.find(item => item.id === internId);
    setCohortProfiles(prev => prev.map(profile => (
      profile.userId === internId
        ? {
            ...profile,
            onboardingChecklist: profile.onboardingChecklist.map(step => (
              step.id === itemId ? { ...step, checked: !step.checked } : step
            ))
          }
        : profile
    )));
    triggerToast(`Checklist task updated for ${intern?.name ?? 'intern'}!`);
  };

  // Fast auto-check everything
  const handleVerifyAllChecklist = (internId: string) => {
    const intern = interns.find(item => item.id === internId);
    setCohortProfiles(prev => prev.map(profile => (
      profile.userId === internId
        ? {
            ...profile,
            onboardingChecklist: profile.onboardingChecklist.map(step => ({ ...step, checked: true }))
          }
        : profile
    )));
    triggerToast(`Verified all onboarding milestones for ${intern?.name ?? 'intern'}!`);
  };

  // Modify tasks assigned status directly
  const handleUpdateTaskStatus = (internId: string, taskId: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== taskId || task.assigneeUserId !== internId) return task;

      triggerToast(`Moved "${task.title}" to ${newStatus.toUpperCase()}`);
      return {
        ...task,
        status: newStatus,
        type: newStatus === 'done' ? 'Completed' : task.type === 'Completed' ? 'Feature' : task.type,
        progress: newStatus === 'done' ? 100 : task.progress
      };
    }));
  };

  // Quick modify course progress manually
  const handleSetCourseProgress = (internId: string, courseId: string, amount: number) => {
    setCohortProfiles(prev => prev.map(profile => (
      profile.userId === internId
        ? {
            ...profile,
            courses: profile.courses.map(course => {
              if (course.id !== courseId) return course;
              const nextProgress = Math.min(100, Math.max(0, course.progress + amount));
              return { ...course, progress: nextProgress };
            })
          }
        : profile
    )));
    triggerToast(`Adjusted course progress index.`);
  };

  // Quick Add task for selected intern
  const [quickTaskTitle, setQuickTaskTitle] = useState('');
  const [quickTaskPriority, setQuickTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  
  const handleQuickAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskTitle.trim() || !activeIntern) return;

    const newTask: Task = {
      id: `t-sim-${Date.now()}`,
      title: quickTaskTitle,
      status: 'todo',
      type: 'Feature',
      priority: quickTaskPriority,
      dueDate: 'Oct 02',
      description: 'Administrative mock task dispatched on-demand from the cohort supervisor dashboard.',
      assigneeUserId: activeIntern.id,
      assignee: {
        name: activeIntern.name,
        avatar: activeIntern.avatar
      },
      comments: []
    };

    setTasks(prev => [newTask, ...prev]);
    setQuickTaskTitle('');
    triggerToast(`Dispatched new sprint task card to ${activeIntern.name}`);
  };

  // Delete task 
  const handleDeleteTask = (internId: string, taskId: string) => {
    setTasks(prev => prev.filter(task => !(task.id === taskId && task.assigneeUserId === internId)));
    triggerToast('Removed task card from intern view.');
  };

  // Filtered interns list
  const filteredInterns = interns.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(searchText.toLowerCase()) || 
                          i.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesDept = deptFilter === 'All' || i.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  if (!activeIntern) {
    return (
      <div className="bg-white border border-[#E1E4E8] rounded-xl p-8 text-center space-y-3">
        <Users className="w-10 h-10 text-gray-300 mx-auto" />
        <h2 className="text-base font-bold text-wm-navy">No Summer Intern Users</h2>
        <p className="text-xs text-on-surface-variant">
          Add a Summer Intern user in Settings to populate the cohort overview.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-left select-none">
      
      {/* ⚠️ Warning standard bar if viewed by non-admin just in case */}
      {userRole !== 'admin' && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl text-xs font-semibold leading-relaxed mb-4">
          Warning: The cohort visualizer contains secure performance logs. Your sandbox is simulated in Administrator supervisor mode.
        </div>
      )}

      {/* Main Grid Banner Header */}
      <div className="bg-white border border-[#E1E4E8] rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <span className="text-[10px] font-mono tracking-widest text-[#005fae] uppercase font-bold">Cohort Supervisor Hub</span>
          <h2 className="text-lg font-bold font-display text-wm-navy">Intern Workflows Monitoring Center</h2>
          <p className="text-xs text-on-surface-variant max-w-2xl leading-relaxed">
            Audit assigned tasks, drill down into technical training completion checklists, and review timeframes to coordinate active product sprint tracks across team divisions.
          </p>
        </div>

        {/* Global Cohort Overall metrics */}
        <div className="grid grid-cols-2 gap-4 shrink-0 bg-slate-50 p-4 border border-[#F1F4F6] rounded-xl w-full md:w-auto">
          <div className="text-left">
            <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-gray-500 block">Total Interns</span>
            <span className="text-xl font-extrabold text-wm-navy mt-0.5">{interns.length} Active</span>
          </div>
          <div className="text-left">
            <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-gray-500 block">Average Progress</span>
            <span className="text-xl font-extrabold text-[#0072CE] mt-0.5">
              {averageProgress}%
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Main Split Frame */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Intern list directory selector (col-span-12 or 4) */}
        <div className="xl:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-[#E1E4E8] shadow-sm overflow-hidden flex flex-col h-full min-h-[580px]">
            
            {/* Header / Title block */}
            <div className="p-4.5 border-b border-[#F1F4F6] bg-slate-50/50">
              <span className="text-[9px] font-mono tracking-wider font-bold text-wm-navy uppercase">Cohort Portal Profiles</span>
              <h4 className="text-sm font-bold text-wm-navy mt-0.5">Active Summer Recruits</h4>
            </div>

            {/* Searching Filters */}
            <div className="p-3 bg-white border-b border-gray-100 space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Find intern by name, email..."
                  className="w-full text-xs pl-9 pr-3 py-2 bg-neutral-50 rounded-lg border border-[#E1E4E8] outline-none focus:bg-white focus:border-wm-royal transition-all"
                />
              </div>

              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="w-full text-[11px] font-semibold p-1.5 bg-white rounded border border-[#E1E4E8] cursor-pointer outline-none text-gray-700"
              >
                <option value="All">All Departments</option>
                <option value="Product Engineering">Product Engineering</option>
                <option value="Data & Analytics">Data & Analytics</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            {/* List scrollable items */}
            <div className="flex-1 divide-y divide-gray-100 overflow-y-auto max-h-[480px]">
              {filteredInterns.map((intern) => {
                const isSelected = intern.id === selectedInternIdForView;
                const tasksTotal = intern.tasks.length;
                const tasksDone = intern.tasks.filter(t => t.status === 'done').length;

                return (
                  <button
                    key={intern.id}
                    onClick={() => {
                      setSelectedInternId(intern.id);
                      triggerToast(`Switched view context to ${intern.name}`);
                    }}
                    className={`w-full text-left p-4.5 flex gap-3 transition-colors outline-none cursor-pointer ${
                      isSelected 
                        ? 'bg-[#d4e3ff]/35 border-l-4 border-wm-royal font-medium' 
                        : 'hover:bg-slate-50/60'
                    }`}
                  >
                    <img 
                      src={intern.avatar} 
                      alt={intern.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-250 ring-2 ring-white shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                    
                    <div className="min-w-0 flex-1 space-y-1 text-left">
                      <div className="flex justify-between items-start gap-1">
                        <span className="text-xs font-bold text-wm-navy leading-tight truncate">{intern.name}</span>
                        <span className="text-[9px] font-mono text-gray-500 shrink-0 font-semibold">{intern.department}</span>
                      </div>
                      
                      <span className="block text-[10px] text-on-surface-variant font-mono truncate">{intern.email}</span>

                      {/* Percentage metrics bars preview */}
                      <div className="pt-1.5 flex items-center justify-between gap-4 text-[10px] font-semibold text-gray-600">
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between text-[9px]">
                            <span>Onboarding Journey</span>
                            <span className="font-bold text-wm-navy">{intern.onboardingProgress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-status-success" style={{ width: `${intern.onboardingProgress}%` }}></div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="block text-[8px] uppercase tracking-wider font-mono text-gray-400">Card Goals</span>
                          <span className="block text-[11px] font-bold text-wm-navy">{tasksDone}/{tasksTotal}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}

              {filteredInterns.length === 0 && (
                <div className="p-8 text-center text-xs text-on-surface-variant">
                  No cohort members matched search filters.
                </div>
              )}
            </div>

            {/* Quick reset/presential instructions footer info */}
            <div className="p-4 border-t border-gray-150 bg-slate-50 text-[10px] text-gray-500 leading-normal font-sans">
              ⚙️ Select any summer intern above to live-inspect, modify milestones, register training courses metrics, or dispatch administrative cards in the viewport canvas next to this sidebar.
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Interactive granular detail inspect canvas (col-span-12 or 8) */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* Active Intern Profile Bar Card summary metadata */}
          <div className="bg-white rounded-xl border border-[#E1E4E8] shadow-sm p-5.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
            <div className="flex items-center gap-4 text-left">
              <img
                src={activeIntern.avatar}
                alt={activeIntern.name}
                className="w-12 h-12 rounded-full object-cover border border-gray-200 ring-4 ring-[#EAF0F6]/40 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-0.5 text-left">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-wm-navy font-display">{activeIntern.name}</h3>
                  <span className="bg-wm-blue-light text-wm-navy text-[9px] font-bold px-2 py-0.5 rounded-full font-mono uppercase">
                    {activeIntern.department} Division
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-on-surface-variant font-sans">
                  <span>Buddy Buddy: <b>{activeIntern.mentor}</b></span>
                  <span>System: <b>{activeIntern.hardwareChoice}</b></span>
                </div>
              </div>
            </div>

            {/* Sub-tab selection row header */}
            <div className="flex flex-wrap items-center gap-1.5 border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto shrink-0 select-none">
              <button
                onClick={() => setViewTab('board')}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewTab === 'board' 
                    ? 'bg-wm-navy text-white shadow-xs' 
                    : 'text-gray-600 hover:bg-slate-100'
                }`}
              >
                <KanbanSquare className="w-3.5 h-3.5" />
                <span>Task Board</span>
              </button>

              <button
                onClick={() => setViewTab('learning')}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewTab === 'learning' 
                    ? 'bg-wm-navy text-white shadow-xs' 
                    : 'text-gray-600 hover:bg-slate-100'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Learning ({activeIntern.learningCompleteness}%)</span>
              </button>

              <button
                onClick={() => setViewTab('checklist')}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewTab === 'checklist' 
                    ? 'bg-wm-navy text-white shadow-xs' 
                    : 'text-gray-600 hover:bg-slate-100'
                }`}
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
                <span>Checklist</span>
              </button>

              <button
                onClick={() => setViewTab('timeline')}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewTab === 'timeline' 
                    ? 'bg-wm-navy text-white shadow-xs' 
                    : 'text-gray-600 hover:bg-slate-100'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Timeline</span>
              </button>
            </div>
          </div>

          {/* VIEW TAB 1: KANBAN BOARDS DISPLAY (Task Board) */}
          {viewTab === 'board' && (
            <div className="space-y-6">
              
              {/* Dispatch mock administrator tasks card generator */}
              <form onSubmit={handleQuickAddTask} className="bg-slate-50 border border-[#E1E488]/40 p-4 rounded-xl flex flex-col sm:flex-row items-end sm:items-center gap-4 text-left">
                <div className="flex-1 space-y-1 w-full text-left">
                  <label className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest block">Dispatch Task Card to Active Board</label>
                  <input
                    type="text"
                    required
                    value={quickTaskTitle}
                    onChange={(e) => setQuickTaskTitle(e.target.value)}
                    placeholder="Enter short title (e.g. Audit Salesforce Sandbox limits, Re-index data sheets)..."
                    className="w-full text-xs p-2 bg-white border border-[#E1E4E8] rounded-md outline-none focus:border-wm-royal font-sans"
                  />
                </div>

                <div className="w-full sm:w-32 space-y-1 text-left shrink-0">
                  <label className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest block">Priority</label>
                  <select
                    value={quickTaskPriority}
                    onChange={(e) => setQuickTaskPriority(e.target.value as 'High' | 'Medium' | 'Low')}
                    className="w-full text-xs p-2 bg-white border border-[#E1E4E8] rounded-md cursor-pointer outline-none"
                  >
                    <option value="High">🔴 High</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="Low">🟢 Low</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="bg-wm-royal text-white px-5 py-2 rounded-md font-bold text-xs shrink-0 cursor-pointer hover:bg-opacity-90 transition-all w-full sm:w-auto text-center"
                >
                  Dispatch Task
                </button>
              </form>

              {/* Kanban lane structures */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 text-left" id="intern-kanban-board-grid">
                
                {/* 1. Backlog Lane */}
                {['backlog', 'todo', 'progress', 'review', 'done'].map((lane) => {
                  const laneTitleMapping: Record<string, string> = {
                    backlog: 'Backlog',
                    todo: 'To Do',
                    progress: 'In Progress',
                    review: 'In Review',
                    done: 'Completed'
                  };
                  
                  const laneBorderMapping: Record<string, string> = {
                    backlog: 'border-t-2 border-gray-300',
                    todo: 'border-t-2 border-blue-400',
                    progress: 'border-t-2 border-yellow-450',
                    review: 'border-t-2 border-indigo-400',
                    done: 'border-t-2 border-green-500'
                  };

                  const filteredLaneTasks = activeIntern.tasks.filter(t => t.status === lane);

                  return (
                    <div key={lane} className="bg-slate-50 border border-gray-150 rounded-xl p-3 flex flex-col space-y-3 min-h-[360px]">
                      
                      {/* Lane Header */}
                      <div className={`pt-1.5 pb-1 border-b border-gray-150/50 flex justify-between items-center ${laneBorderMapping[lane]}`}>
                        <span className="text-[11px] font-extrabold text-wm-navy font-display">{laneTitleMapping[lane]}</span>
                        <span className="text-[10px] font-mono bg-neutral-200 text-gray-700 py-0.5 px-2 rounded-full font-bold">
                          {filteredLaneTasks.length}
                        </span>
                      </div>

                      {/* Display task list */}
                      <div className="flex-1 space-y-2.5 overflow-y-auto pr-0.5 scrollbar-thin">
                        {filteredLaneTasks.map((task) => (
                          <div 
                            key={task.id}
                            className="bg-white border border-[#E1E4E8] rounded-lg p-3 space-y-2.5 shadow-2xs hover:shadow-xs transition-shadow text-left group"
                          >
                            <span className={`inline-block text-[8.5px] font-bold px-2 py-0.5 rounded font-mono ${
                              task.priority === 'High' ? 'bg-red-50 text-red-600' :
                              task.priority === 'Medium' ? 'bg-amber-50 text-amber-600' :
                              'bg-green-50 text-green-600'
                            }`}>
                              ● {task.priority}
                            </span>

                            <h5 className="text-[11px] font-bold text-gray-800 font-sans leading-tight line-clamp-2">
                              {task.title}
                            </h5>

                            {/* Dropdown controls for shifting state */}
                            <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-gray-100">
                              <select
                                value={task.status}
                                onChange={(e) => handleUpdateTaskStatus(activeIntern.id, task.id, e.target.value as Task['status'])}
                                className="text-[9.5px] font-semibold py-0.5 pl-1.5 pr-2 border border-gray-150 rounded bg-white font-mono cursor-pointer outline-none"
                              >
                                <option value="backlog">Backlog</option>
                                <option value="todo">To Do</option>
                                <option value="progress">In Prog</option>
                                <option value="review">Review</option>
                                <option value="done">Done</option>
                              </select>
                              
                              <button
                                type="button"
                                onClick={() => handleDeleteTask(activeIntern.id, task.id)}
                                className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors opacity-0 group-hover:opacity-100"
                                title="Delete task"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}

                        {filteredLaneTasks.length === 0 && (
                          <div className="text-center py-8 text-[11px] text-gray-400 font-mono border border-dashed border-gray-200 rounded-lg">
                            Empty
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}

              </div>
            </div>
          )}

          {/* VIEW TAB 2: LEARNING COMPLETENESS PROGRESS BAR GANTTS */}
          {viewTab === 'learning' && (
            <div className="bg-white rounded-xl border border-[#E1E4E8] shadow-sm p-6 space-y-6 text-left">
              <div className="flex justify-between items-center select-none">
                <div>
                  <h4 className="text-sm font-bold text-wm-navy">Technical Training Courseware Logs</h4>
                  <p className="text-xs text-on-surface-variant">Click buttons to simulate learning progress changes.</p>
                </div>
                <span className="text-xs font-mono font-bold text-wm-royal">
                  Completeness Index: {activeIntern.learningCompleteness}%
                </span>
              </div>

              {/* Course items stack */}
              <div className="space-y-4">
                {activeIntern.courses.map(course => (
                  <div key={course.id} className="border border-gray-150 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/50 transition-all text-left">
                    
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[8.5px] font-mono font-bold uppercase rounded py-0.5 px-2 ${
                          course.type === 'course' ? 'bg-blue-50 text-wm-royal' :
                          course.type === 'lab' ? 'bg-[#FAFBCF] text-[#9A9F0D]' :
                          'bg-purple-100/60 text-purple-700'
                        }`}>
                          {course.type}
                        </span>
                        <span className="text-[10px] text-gray-500 font-semibold font-mono">{course.category}</span>
                      </div>
                      
                      <h5 className="text-xs font-bold text-wm-navy truncate">{course.title}</h5>

                      {/* Bar indicator */}
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex-1 max-w-sm">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              course.progress === 100 ? 'bg-status-success' : 'bg-[#0072CE]'
                            }`}
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-gray-600 shrink-0">{course.progress}% Completed</span>
                      </div>
                    </div>

                    {/* Progress adjustments callbacks */}
                    <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0 select-none">
                      <button
                        onClick={() => handleSetCourseProgress(activeIntern.id, course.id, -20)}
                        className="p-1 px-2.5 border border-gray-250 hover:bg-slate-100 text-xs font-mono font-bold rounded"
                      >
                        -20
                      </button>
                      <button
                        onClick={() => handleSetCourseProgress(activeIntern.id, course.id, 20)}
                        className="p-1 px-2.5 border border-gray-250 hover:bg-slate-100 text-xs font-mono font-bold rounded"
                      >
                        +20
                      </button>
                      <button
                        onClick={() => handleSetCourseProgress(activeIntern.id, course.id, 100)}
                        className="bg-green-50 border border-green-250 text-status-success p-1 px-3 hover:bg-green-100 text-[10.5px] font-bold rounded flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Complete
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {/* Gamified summary box badge */}
              <div className="bg-[#FAFBCF]/45 border border-[#E1E468] rounded-xl p-4.5 flex gap-3 text-left">
                <Award className="w-5 h-5 text-shoutout-gold shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#9A9F0D]">Simulate Program Evaluation Parameters</span>
                  <p className="text-[11px] text-gray-700 leading-normal">
                    This trainee is currently synced to cohorts sandbox platform servers. Modifying course parameters translates instantly to their learning dashboards. Minimum of <b>80% completeness</b> across tracks triggers cohort certification eligibility.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* VIEW TAB 3: MINUTIAE ONBOARDING CHECKLISTS CHECKBOX LABELS */}
          {viewTab === 'checklist' && (
            <div className="bg-white rounded-xl border border-[#E1E4E8] shadow-sm p-6 space-y-6 text-left">
              <div className="flex justify-between items-center select-none">
                <div>
                  <h4 className="text-sm font-bold text-wm-navy">Onboarding Checklist Audit Panel</h4>
                  <p className="text-xs text-on-surface-variant">Observe completion indexes of program mandates.</p>
                </div>

                <button
                  onClick={() => handleVerifyAllChecklist(activeIntern.id)}
                  className="bg-wm-royal text-white text-[11px] font-bold px-4 py-1.5 rounded-lg hover:bg-opacity-90 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-shoutout-gold" />
                  <span>Verify All Checklist</span>
                </button>
              </div>

              {/* Categorized Checkbox list */}
              {['Pre-Arrival', 'Week 1', '30-Day'].map(category => {
                const categoricalSteps = activeIntern.onboardingChecklist.filter(s => s.category === category);
                return (
                  <div key={category} className="space-y-3.5 text-left">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#5C6F84] tracking-wider block">
                      {category} Milestones
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {categoricalSteps.map(step => (
                        <div
                          key={step.id}
                          onClick={() => handleToggleChecklistStep(activeIntern.id, step.id)}
                          className={`p-3.5 rounded-xl border cursor-pointer select-none transition-all flex items-start gap-3 text-left hover:shadow-xs hover:bg-[#FAF9FC] ${
                            step.checked 
                              ? 'border-green-250 bg-green-50/20 text-[#1B5E20]' 
                              : 'border-gray-200 bg-white text-gray-700'
                          }`}
                        >
                          {step.checked ? (
                            <CheckCircle2 className="w-4 h-4 text-status-success shrink-0 mt-0.5" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-400 shrink-0 mt-0.5 hover:text-gray-600" />
                          )}
                          <span className="text-xs font-semibold leading-normal">{step.title}</span>
                        </div>
                      ))}

                      {categoricalSteps.length === 0 && (
                        <div className="text-[10.5px] text-gray-400 font-mono italic">
                          No items in category.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

            </div>
          )}

          {/* VIEW TAB 4: TASK CHRONOLOGICAL TIMELINE (Gantt representation) */}
          {viewTab === 'timeline' && (
            <div className="bg-white rounded-xl border border-[#E1E4E8] shadow-sm p-6 space-y-6 text-left">
              <div>
                <h4 className="text-sm font-bold text-wm-navy">Cron Timeline / Milestone Track Indicators</h4>
                <p className="text-xs text-on-surface-variant">Review sprint dates and workload sequence chronologically.</p>
              </div>

              {activeIntern.tasks.length > 0 ? (
                <div className="space-y-4">
                  {activeIntern.tasks.map((task, idx) => {
                    const startOffsetDays = (idx * 3) + 1; // mock timing offsets
                    return (
                      <div key={task.id} className="border border-gray-150 rounded-xl p-4 block text-left space-y-3">
                        <div className="flex justify-between items-start gap-2 select-none">
                          <h5 className="text-xs font-bold text-wm-navy truncate">{task.title}</h5>
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase shrink-0 tracking-wider ${
                            task.status === 'done' ? 'bg-green-150 text-status-success border border-green-300' :
                            task.status === 'progress' ? 'bg-yellow-50 text-shoutout-gold border border-yellow-250' :
                            task.status === 'review' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                            'bg-gray-100 text-gray-500'
                          }`}>
                            {task.status}
                          </span>
                        </div>

                        {/* Chrono Horizontal Timeline Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[10px] text-on-surface-variant font-mono">
                            <span>Sprints Start: <b>Sept {10 + startOffsetDays}</b></span>
                            <span>Target Milestone: <b>{task.dueDate}</b></span>
                          </div>

                          <div className="relative h-6 bg-slate-100 rounded overflow-hidden select-none">
                            {/* Horizontal Gantt bar */}
                            <div 
                              className={`absolute h-full top-0 flex items-center justify-center text-[9px] font-mono font-extrabold text-white rounded transition-all ${
                                task.status === 'done' ? 'bg-status-success' :
                                task.status === 'progress' ? 'bg-[#FFB100]' :
                                'bg-wm-royal'
                              }`}
                              style={{ 
                                left: `${10 + startOffsetDays * 3}%`, 
                                width: '55%' 
                              }}
                            >
                              🚀 Week {idx + 1} sprint track
                            </div>
                          </div>
                        </div>

                        {/* Priorities & Assignees metadata */}
                        <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-[10px] text-on-surface-variant">
                          <span>Priority Status: <b>{task.priority || 'Medium'}</b></span>
                          <span>Duration Index: <b>7 Calendar Days</b></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 border border-dashed border-gray-200 rounded-xl text-center text-xs text-on-surface-variant">
                  No active tasks. Use the <b>Task Board</b> tab to dispatch work milestones for this cohort member.
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
