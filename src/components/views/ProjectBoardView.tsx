import React, { useState } from 'react';
import { 
  Plus, 
  MoreHorizontal, 
  MessageSquare, 
  CheckCircle2, 
  Calendar, 
  TrendingUp, 
  UserPlus, 
  ChevronRight, 
  AlertTriangle,
  Flame,
  ArrowRight,
  FolderOpen,
  Trash2,
  Share2,
  Clock,
  Layers,
  Sparkles,
  Search,
  Check,
  ChevronLeft,
  CalendarDays,
  Target,
  FileText,
  Workflow,
  CheckSquare,
  Bookmark,
  UserCheck
} from 'lucide-react';
import { Task, UserRole, UserPermissions, ManagedUser, ProjectMilestone, Meeting } from '../../types';
import TaskDetailModal from '../TaskDetailModal';

const TIMELINE_TOTAL_DAYS = 36;
const TIMELINE_CALENDAR_DAYS = 42;
const TIMELINE_START_DATE = new Date(2026, 8, 15, 12);
const TIMELINE_CURRENT_DATE = new Date(2026, 8, 29, 12);
const OUTLOOK_CALENDAR_YEAR = 2026;
const DAY_IN_MS = 1000 * 60 * 60 * 24;
const OUTLOOK_MONTH_INDEXES: Record<string, number> = {
  JAN: 0,
  FEB: 1,
  MAR: 2,
  APR: 3,
  MAY: 4,
  JUN: 5,
  JUL: 6,
  AUG: 7,
  SEP: 8,
  OCT: 9,
  NOV: 10,
  DEC: 11
};

const addTimelineDays = (date: Date, days: number) => {
  const nextDate = new Date(date);
  nextDate.setDate(date.getDate() + days);
  return nextDate;
};

const parseTimelineDate = (date: string) => {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day, 12);
};

const formatTimelineDate = (date: Date) => date.toLocaleDateString('en-US', {
  month: 'short',
  day: 'numeric'
});

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getMilestoneOffset = (date: string) => {
  return Math.round((parseTimelineDate(date).getTime() - TIMELINE_START_DATE.getTime()) / DAY_IN_MS) + 1;
};

const getWeekStartDate = (date: Date) => {
  const dayOffset = (date.getDay() + 6) % 7;
  return addTimelineDays(date, -dayOffset);
};

const getWeekEndDate = (date: Date) => addTimelineDays(getWeekStartDate(date), 6);

const parseMeetingDate = (meeting: Meeting) => {
  const monthIndex = OUTLOOK_MONTH_INDEXES[meeting.dateMonth.toUpperCase()] ?? 0;
  return new Date(OUTLOOK_CALENDAR_YEAR, monthIndex, parseInt(meeting.dateDay, 10), 12);
};

interface ProjectBoardViewProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  searchQuery: string;
  onOpenNewTaskModal: () => void;
  subTab?: 'board' | 'backlog' | 'timeline';
  setSubTab?: (subTab: 'board' | 'backlog' | 'timeline') => void;
  userRole?: UserRole;
  permissions?: UserPermissions;
  managedUsers: ManagedUser[];
  activeInternUserId: string;
  projectMilestones: ProjectMilestone[];
  setProjectMilestones: React.Dispatch<React.SetStateAction<ProjectMilestone[]>>;
  meetings: Meeting[];
}

export default function ProjectBoardView({
  tasks,
  setTasks,
  searchQuery,
  onOpenNewTaskModal,
  subTab = 'board',
  setSubTab = () => {},
  userRole = 'intern',
  permissions = {
    allowInternsToDeleteTasks: true,
    allowInternsToCreateFAQ: true,
    allowInternsToSyncMeetings: true,
    allowInternsToSelfApproveMilestones: true
  },
  managedUsers,
  activeInternUserId,
  projectMilestones,
  setProjectMilestones,
  meetings
}: ProjectBoardViewProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const summerInternUsers = managedUsers.filter(user => user.role === 'Summer Intern');
  const activeInternUser = summerInternUsers.find(user => user.id === activeInternUserId) ?? summerInternUsers[0];

  const getTaskAssignee = (task: Task) => {
    const assignedUser = task.assigneeUserId
      ? managedUsers.find(user => user.id === task.assigneeUserId)
      : undefined;

    return assignedUser
      ? { name: assignedUser.name, avatar: assignedUser.avatar }
      : task.assignee;
  };

  const getUserAssignee = (user?: ManagedUser) => (
    user ? { name: user.name, avatar: user.avatar } : undefined
  );

  // Drag and drop states for Kanban Board
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [isDraggingOverCol, setIsDraggingOverCol] = useState<string | null>(null);

  // Inline backlog task creation state
  const [backlogInputTitle, setBacklogInputTitle] = useState('');
  const [backlogInputPriority, setBacklogInputPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [backlogInputType, setBacklogInputType] = useState<'Feature' | 'Bug Fix' | 'Opportunity'>('Feature');
  const [isCreatingMilestone, setIsCreatingMilestone] = useState<boolean>(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState<string>('');
  const [newMilestoneDate, setNewMilestoneDate] = useState<string>(formatDateKey(addTimelineDays(TIMELINE_CURRENT_DATE, 7)));
  const [newMilestoneDescription, setNewMilestoneDescription] = useState<string>('');
  const [newMilestoneError, setNewMilestoneError] = useState<string>('');

  // Filter tasks based on Search Query
  const getFilteredTasks = (taskList: Task[]) => {
    return taskList.filter((task) => {
      // Filter by Search Query
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        const matchTitle = task.title.toLowerCase().includes(query);
        const matchType = task.type.toLowerCase().includes(query);
        const matchDesc = task.description?.toLowerCase().includes(query) || false;
        if (!matchTitle && !matchType && !matchDesc) return false;
      }
      return true;
    });
  };

  const filteredTasks = getFilteredTasks(tasks);

  // Separate tasks currently in Active Sprint (todo, progress, review, done) vs Product Backlog
  const sprintTasks = filteredTasks.filter(t => t.status !== 'backlog');
  const backlogTasks = filteredTasks.filter(t => t.status === 'backlog');
  const timelineTasks = filteredTasks;
  const timelineEndDate = addTimelineDays(TIMELINE_START_DATE, TIMELINE_TOTAL_DAYS - 1);
  const sortedProjectMilestones = [...projectMilestones].sort((firstMilestone, secondMilestone) => (
    parseTimelineDate(firstMilestone.date).getTime() - parseTimelineDate(secondMilestone.date).getTime()
  ));
  const currentProjectMilestone = sortedProjectMilestones.find(milestone => milestone.status === 'current');
  const currentScheduleDate = currentProjectMilestone ? parseTimelineDate(currentProjectMilestone.date) : TIMELINE_CURRENT_DATE;
  const sortedCalendarMeetings = [...meetings].sort((firstMeeting, secondMeeting) => (
    parseMeetingDate(firstMeeting).getTime() - parseMeetingDate(secondMeeting).getTime()
  ));
  const timelineWeekLabels = Array.from({ length: 6 }, (_, index) => {
    const weekStart = addTimelineDays(TIMELINE_START_DATE, index * 7);
    return {
      id: `week-${index + 1}`,
      label: `Week ${index + 1}`,
      date: formatTimelineDate(weekStart)
    };
  });

  const getTaskWindow = (task: Task) => {
    const startOffset = Math.min(Math.max(task.startDaysOffset ?? 2, 1), TIMELINE_TOTAL_DAYS);
    const duration = Math.min(Math.max(task.durationDays ?? 5, 1), TIMELINE_TOTAL_DAYS);
    const startDate = addTimelineDays(TIMELINE_START_DATE, startOffset - 1);
    const endDate = addTimelineDays(startDate, duration - 1);

    return { startOffset, duration, startDate, endDate };
  };

  const scheduleSourceDates = [
    TIMELINE_START_DATE,
    timelineEndDate,
    ...timelineTasks.flatMap(task => {
      const { startDate, endDate } = getTaskWindow(task);
      return [startDate, endDate];
    }),
    ...sortedProjectMilestones.map(milestone => parseTimelineDate(milestone.date)),
    ...sortedCalendarMeetings.map(meeting => parseMeetingDate(meeting))
  ];
  const scheduleCalendarStartDate = getWeekStartDate(new Date(Math.min(...scheduleSourceDates.map(date => date.getTime()))));
  const scheduleCalendarEndDate = getWeekEndDate(new Date(Math.max(...scheduleSourceDates.map(date => date.getTime()))));
  const scheduleCalendarDayCount = Math.max(
    TIMELINE_CALENDAR_DAYS,
    Math.round((scheduleCalendarEndDate.getTime() - scheduleCalendarStartDate.getTime()) / DAY_IN_MS) + 1
  );
  const timelineCalendarDays = Array.from({ length: scheduleCalendarDayCount }, (_, index) => addTimelineDays(scheduleCalendarStartDate, index));
  const scheduleRangeLabel = `${formatTimelineDate(scheduleCalendarStartDate)} - ${formatTimelineDate(scheduleCalendarEndDate)}`;

  const getTasksForCalendarDay = (date: Date) => {
    const dateTime = date.getTime();
    return timelineTasks.filter(task => {
      const { startDate, endDate } = getTaskWindow(task);
      return dateTime >= startDate.getTime() && dateTime <= endDate.getTime();
    });
  };

  const getMeetingsForCalendarDay = (date: Date) => (
    sortedCalendarMeetings.filter(meeting => formatDateKey(parseMeetingDate(meeting)) === formatDateKey(date))
  );

  const getMilestonesForCalendarDay = (date: Date) => (
    sortedProjectMilestones.filter(milestone => formatDateKey(parseTimelineDate(milestone.date)) === formatDateKey(date))
  );

  const getMilestoneClassName = (milestone: ProjectMilestone) => {
    if (milestone.category === 'intern') return 'border-wm-royal bg-[#F7FBFF] text-wm-royal';
    if (milestone.status === 'completed') return 'border-status-success bg-[#EAF7EC] text-status-success';
    if (milestone.status === 'current') return 'border-wm-royal bg-[#e7f3ff] text-wm-royal';
    if (milestone.category === 'presentation') return 'border-shoutout-gold bg-[#FFF7D6] text-[#9A6B00]';
    return 'border-[#D0D5DD] bg-white text-on-surface-variant';
  };

  const getCalendarTaskClassName = (task: Task) => {
    if (task.status === 'done') return 'bg-[#EAF7EC] text-status-success border-status-success/30';
    if (task.status === 'progress') return 'bg-[#e7f3ff] text-wm-royal border-wm-royal/20';
    if (task.status === 'review') return 'bg-[#FFF7D6] text-[#9A6B00] border-shoutout-gold/30';
    if (task.status === 'backlog') return 'bg-neutral-100 text-on-surface-variant border-neutral-200';
    return 'bg-white text-wm-navy border-[#D0D5DD]';
  };

  const getTimelineBarStyle = (task: Task) => {
    const { startOffset, duration } = getTaskWindow(task);
    const leftPercent = ((startOffset - 1) / TIMELINE_TOTAL_DAYS) * 100;
    const widthPercent = Math.min((duration / TIMELINE_TOTAL_DAYS) * 100, 100 - leftPercent);

    return {
      left: `${leftPercent}%`,
      width: `${Math.max(widthPercent, 2.5)}%`
    };
  };

  const upcomingMilestonesCount = sortedProjectMilestones.filter(milestone => milestone.status !== 'completed').length;
  const completedTimelineTasksCount = timelineTasks.filter(task => task.status === 'done').length;
  const outlookMeetingCount = sortedCalendarMeetings.length;
  const attentionTimelineTasksCount = timelineTasks.filter(task => {
    const { endDate } = getTaskWindow(task);
    return task.status !== 'done' && (
      task.status === 'progress' ||
      task.status === 'review' ||
      endDate.getTime() < currentScheduleDate.getTime()
    );
  }).length;
  const sprintRangeLabel = `${formatTimelineDate(TIMELINE_START_DATE)} - ${formatTimelineDate(timelineEndDate)}`;
  const currentTimelineOffset = Math.round((currentScheduleDate.getTime() - TIMELINE_START_DATE.getTime()) / DAY_IN_MS) + 1;
  const currentTimelineLeft = `${((currentTimelineOffset - 1) / TIMELINE_TOTAL_DAYS) * 100}%`;
  const canCreateInternMilestone = userRole === 'intern' && !!activeInternUser;

  // Columns specification for Kanban board
  const columns = [
    { id: 'todo', label: 'To Do', color: '#c3c7ce', text: 'text-on-surface-variant' },
    { id: 'progress', label: 'In Progress', color: '#0072CE', text: 'text-white bg-status-progress' },
    { id: 'review', label: 'In Review', color: '#F2A900', text: 'text-white bg-shoutout-gold' },
    { id: 'done', label: 'Done', color: '#28A745', text: 'text-white bg-status-success' }
  ];

  // Drag and drop events for board
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setIsDraggingOverCol(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setIsDraggingOverCol(columnId);
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      setTasks(prev => prev.map(t => {
        if (t.id === taskId) {
          const nextStatus = columnId as Task['status'];
          return {
            ...t,
            status: nextStatus,
            type: nextStatus === 'done' ? 'Completed' : t.type === 'Completed' ? 'Feature' : t.type,
            progress: nextStatus === 'done' ? 100 : t.progress
          };
        }
        return t;
      }));
    }
    setDraggedTaskId(null);
    setIsDraggingOverCol(null);
  };

  // Helper code to change task column status sequentially (Button Action 1)
  const handleTransitionTask = (taskId: string, currentStatus: string) => {
    let nextStatus: Task['status'] = 'progress';
    if (currentStatus === 'backlog') nextStatus = 'todo';
    else if (currentStatus === 'todo') nextStatus = 'progress';
    else if (currentStatus === 'progress') nextStatus = 'review';
    else if (currentStatus === 'review') nextStatus = 'done';
    else if (currentStatus === 'done') nextStatus = 'todo'; // wrapping done to todo

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { 
          ...t, 
          status: nextStatus,
          type: nextStatus === 'done' ? 'Completed' : t.type === 'Completed' ? 'Feature' : t.type,
          progress: nextStatus === 'done' ? 100 : t.progress
        };
      }
      return t;
    }));
  };

  // Quick Action Button 2: Toggle Sprint vs backlog status
  const handleToggleSprintBacklog = (taskId: string, currentStatus: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextStatus: Task['status'] = currentStatus === 'backlog' ? 'todo' : 'backlog';
        return {
          ...t,
          status: nextStatus,
          // Reset progress to 0 if moving back to backlog
          progress: nextStatus === 'backlog' ? 0 : t.progress
        };
      }
      return t;
    }));
  };

  // Quick Action Button 3: Instant Delete task from workspace
  const handleDeleteTaskFromBoard = (taskId: string) => {
    if (userRole === 'intern' && !permissions.allowInternsToDeleteTasks) {
      alert("Access Blocked: Intern delete operations are disabled under active administrator security profiles. Change this under the Access & Permissions tab in Settings.");
      return;
    }
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setSelectedTask(null);
  };

  // Claiming an Opportunity task
  const handleClaimOpportunity = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          type: 'Feature',
          status: 'progress',
          priority: 'Medium',
          dueDate: 'Tomorrow',
          assigneeUserId: activeInternUser?.id,
          assignee: getUserAssignee(activeInternUser)
        };
      }
      return t;
    }));
  };

  // Handle addition of a new backlog task from inline form
  const handleCreateBacklogTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!backlogInputTitle.trim()) return;

    const newTask: Task = {
      id: `task-backlog-${Date.now()}`,
      title: backlogInputTitle,
      status: 'backlog',
      type: backlogInputType,
      priority: backlogInputPriority,
      dueDate: 'Future Sprint',
      description: 'Backlog item added to the workspace. Fill in details below.',
      comments: [],
      startDaysOffset: 4,
      durationDays: 6,
      progress: 0,
      assigneeUserId: activeInternUser?.id,
      assignee: getUserAssignee(activeInternUser)
    };

    setTasks(prev => [newTask, ...prev]);
    setBacklogInputTitle('');
  };

  const handleCreateInternMilestone = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = newMilestoneTitle.trim();
    if (!trimmedTitle) {
      setNewMilestoneError('Milestone title is required.');
      return;
    }

    if (!newMilestoneDate) {
      setNewMilestoneError('Milestone date is required.');
      return;
    }

    const creatorName = activeInternUser?.name ?? 'Intern';
    const milestoneDescription = newMilestoneDescription.trim();
    const newMilestone: ProjectMilestone = {
      id: `milestone-${Date.now()}`,
      title: trimmedTitle,
      date: newMilestoneDate,
      category: 'intern',
      status: 'upcoming',
      description: milestoneDescription || `Personal milestone created by ${creatorName}.`,
      createdByUserId: activeInternUser?.id,
      createdByName: creatorName
    };

    setProjectMilestones(prev => [...prev, newMilestone]);
    setNewMilestoneTitle('');
    setNewMilestoneDescription('');
    setNewMilestoneDate(formatDateKey(addTimelineDays(TIMELINE_CURRENT_DATE, 7)));
    setNewMilestoneError('');
    setIsCreatingMilestone(false);
  };

  // Adjust Start offset inside Timeline View
  const handleUpdateScheduleOffset = (taskId: string, offset: number) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, startDaysOffset: offset } : t));
  };

  // Adjust Duration inside Timeline View
  const handleUpdateScheduleDuration = (taskId: string, duration: number) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, durationDays: duration } : t));
  };

  const handleUpdateTaskInBoard = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  // Dynamic lookup of active selected task to ensure live updates match the modal representation
  const activeTaskDetails = selectedTask ? tasks.find(t => t.id === selectedTask.id) : null;

  // Render header statistics panels
  const totalCompletedCount = tasks.filter(t => t.status === 'done').length;
  const totalInFlightCount = tasks.filter(t => t.status === 'progress' || t.status === 'review').length;
  const totalBacklogCount = tasks.filter(t => t.status === 'backlog').length;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] select-none">
      
      {/* Dynamic Filter/Sprint bar header */}
      <div id="project-board-view-header" className="py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/50 border-b border-[#E1E4E8] px-10">
        <div className="text-left">
          <h2 className="text-lg font-display font-bold text-wm-navy">Project: Q3 Salesforce Integration</h2>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] font-mono">
            <span className="font-semibold text-on-surface-variant uppercase tracking-wider">
              Active Sprint: Iteration 2 (Sep 15 - Sep 29)
            </span>
            <span className="text-gray-300">•</span>
            {/* Inner Project Board navigation sub-bar */}
            <div className="bg-[#ebeef0] px-2 py-0.5 rounded-full flex gap-3 text-[10px] uppercase font-bold text-on-surface-variant">
              <button 
                id="board-inner-tab-board"
                onClick={() => setSubTab('board')}
                className={`px-2 py-0.5 rounded ${subTab === 'board' ? 'bg-[#005fae] text-white' : 'hover:text-on-surface'}`}
              >
                Board View
              </button>
              <button 
                id="board-inner-tab-backlog"
                onClick={() => setSubTab('backlog')}
                className={`px-2 py-0.5 rounded ${subTab === 'backlog' ? 'bg-[#005fae] text-white' : 'hover:text-on-surface'}`}
              >
                Backlog ({totalBacklogCount})
              </button>
              <button 
                id="board-inner-tab-timeline"
                onClick={() => setSubTab('timeline')}
                className={`px-2 py-0.5 rounded ${subTab === 'timeline' ? 'bg-[#005fae] text-white' : 'hover:text-on-surface'}`}
              >
                Timeline Map
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0 font-sans">
          <button
            id="board-create-newTask-btn"
            onClick={onOpenNewTaskModal}
            className="flex items-center gap-2 bg-wm-royal text-white px-5 py-2 rounded-lg font-bold text-xs shadow hover:shadow-md active:scale-95 transition-all text-left cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Task</span>
          </button>
        </div>
      </div>

      {/* Conditionally Render: Kanban Board View */}
      {subTab === 'board' && (
        <div id="board-view-section" className="flex-1 overflow-x-auto p-10 bg-[#FAFBCF]/10 bg-[#F4F7F9]">
          <div className="flex gap-6 h-full min-w-[1200px]">
            {columns.map((col) => {
              const columnTasks = sprintTasks.filter(t => t.status === col.id);

              return (
                <div key={col.id} className="w-80 flex flex-col gap-4 select-none">
                  
                  {/* Column header */}
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{col.label}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold shrink-0 ${
                        col.id === 'todo' ? 'bg-[#ebeef0] text-on-surface-variant' : col.text
                      }`}>
                        {columnTasks.length}
                      </span>
                    </div>
                    <button className="text-on-surface-variant hover:text-on-surface cursor-pointer">
                      <MoreHorizontal className="w-4.5 h-4.5" />
                    </button>
                  </div>

                  {/* Column Card list (Acts as Drop Zone) */}
                  <div 
                    onDragOver={handleDragOver}
                    onDragEnter={(e) => handleDragEnter(e, col.id)}
                    onDrop={(e) => handleDrop(e, col.id)}
                    className={`flex-1 flex flex-col gap-3 overflow-y-auto pb-4 pr-1 rounded-xl p-2 transition-all duration-200 ${
                      isDraggingOverCol === col.id 
                        ? 'bg-wm-royal/5 border-2 border-dashed border-wm-royal/35 shadow-inner' 
                        : 'border-2 border-transparent'
                    }`}
                  >
                    {columnTasks.map((task) => {
                      const isOpportunity = task.type === 'Opportunity';
                      const taskAssignee = getTaskAssignee(task);
                      const hasAssignee = !!taskAssignee;
                      const isDone = task.status === 'done';

                      return (
                        <div
                          key={task.id}
                          draggable="true"
                          onDragStart={(e) => handleDragStart(e, task.id)}
                          onDragEnd={handleDragEnd}
                          onClick={() => setSelectedTask(task)}
                          className={`bg-white border rounded-lg p-4 shadow-sm hover:shadow-md hover:border-wm-royal transition-all duration-150 relative text-left group cursor-grab active:cursor-grabbing ${
                            isOpportunity ? 'border-[#E1E4E8] border-dashed bg-surface-container-low/30' : 'border-[#E1E4E8]'
                          } ${isDone ? 'opacity-80' : ''} ${
                            draggedTaskId === task.id ? 'opacity-35 border-wm-royal scale-95 select-none bg-neutral-50/50' : ''
                          }`}
                        >
                          {/* THREE INTERACTIVE BUTTONS INTERFACE on card top-right */}
                          <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all z-10">
                            {/* Button 1: Advance Column Sequentially */}
                            <button
                              id={`btn-advance-${task.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTransitionTask(task.id, task.status);
                              }}
                              className="p-1 rounded bg-[#F1F4F6] hover:bg-[#0072CE] text-[#333] hover:text-white transition-all cursor-pointer shadow-sm border border-gray-150"
                              title={isDone ? "Restart at To Do" : "Advance Pipeline Stage"}
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>

                            {/* Button 2: Send Task to Product Backlog */}
                            <button
                              id={`btn-backlog-${task.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleSprintBacklog(task.id, task.status);
                              }}
                              className="p-1 rounded bg-[#F1F4F6] hover:bg-[#F2A900] text-[#333] hover:text-white transition-all cursor-pointer shadow-sm border border-gray-150"
                              title="Archive to Product Backlog"
                            >
                              <FolderOpen className="w-3 h-3" />
                            </button>

                            {/* Button 3: Instant Delete */}
                            <button
                              id={`btn-delete-${task.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Delete the task "${task.title}" permanently?`)) {
                                  handleDeleteTaskFromBoard(task.id);
                                }
                              }}
                              className="p-1 rounded bg-[#F1F4F6] hover:bg-status-blocked text-[#333] hover:text-white transition-all cursor-pointer shadow-sm border border-gray-150"
                              title="Delete task from workspace"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex items-start justify-between mb-3 pr-14">
                            <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-tighter ${
                              isOpportunity 
                                ? 'bg-amber-100 text-shoutout-gold' 
                                : col.id === 'done' 
                                ? 'bg-[#d4edda] text-status-success'
                                : 'bg-[#e7f3ff] text-wm-royal'
                            }`}>
                              {task.type}
                            </span>

                            {/* Assignee Avatar / Claim prompt */}
                            {hasAssignee ? (
                              <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200 ml-1.5 shrink-0" title={taskAssignee?.name}>
                                <img
                                  src={taskAssignee?.avatar}
                                  alt={taskAssignee?.name}
                                  className="w-full h-full object-cover font-sans"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full border border-dashed border-[#c3c7ce] flex items-center justify-center text-[#73777e] bg-white ml-1.5 shrink-0">
                                <UserPlus className="w-3 h-3 text-on-surface-variant" />
                              </div>
                            )}
                          </div>

                          {/* Title */}
                          <h4 className={`text-xs font-bold leading-snug text-wm-navy mb-3 transition-colors ${
                            isDone ? 'line-through text-on-surface-variant/80' : 'group-hover:text-wm-royal'
                          }`}>
                            {task.title}
                          </h4>

                          {/* Progress Bar for specific tasks with values */}
                          {task.progress !== undefined && task.progress > 0 && !isDone && (
                            <div className="mb-3 select-none">
                              <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                                <div className="bg-status-progress h-full rounded-full transition-all" style={{ width: `${task.progress}%` }}></div>
                              </div>
                              <span className="text-[9px] font-mono text-on-surface-variant mt-1 block font-medium">Progress • {task.progress}%</span>
                            </div>
                          )}

                          {/* Footer details: Priority, Due Date or Action Claim */}
                          <div className="flex items-center justify-between mt-4 border-t border-[#F1F4F6] pt-3">
                            <div className="flex items-center gap-1.5 text-on-surface-variant">
                              {task.priority === 'High' ? (
                                <Flame className="w-3.5 h-3.5 text-status-blocked fill-status-blocked" />
                              ) : (
                                <TrendingUp className="w-3.5 h-3.5 text-shoutout-gold" strokeWidth={2.5} />
                              )}
                              <span className="text-[10px] font-mono">{task.priority} Priority</span>
                            </div>

                            {isOpportunity ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleClaimOpportunity(task.id);
                                }}
                                className="text-wm-royal font-bold text-[10px] uppercase hover:underline shrink-0 cursor-pointer z-10"
                              >
                                Claim Task
                              </button>
                            ) : (
                              <div className="flex items-center gap-1 text-on-surface-variant">
                                {task.commentsCount ? (
                                  <>
                                    <MessageSquare className="w-3 h-3 text-on-surface-variant/80" />
                                    <span className="text-[10px] font-mono font-medium">{task.commentsCount} comments</span>
                                  </>
                                ) : (
                                  <>
                                    <Calendar className="w-3 h-3 text-on-surface-variant/80" />
                                    <span className="text-[10px] font-mono font-medium">{task.dueDate}</span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>

                        </div>
                      );
                    })}

                    {/* Add Card button column placeholder action */}
                    <button
                      onClick={onOpenNewTaskModal}
                      className="py-2.5 border border-dashed border-[#c3c7ce] rounded-lg text-on-surface-variant text-xs flex items-center justify-center gap-2 hover:bg-white hover:border-wm-royal hover:text-wm-royal transition-all cursor-pointer font-medium select-none bg-transparent"
                    >
                      <Plus className="w-4 h-4 text-on-surface-variant" />
                      <span>Add card</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Conditionally Render: Interactive Backlog View */}
      {subTab === 'backlog' && (
        <div id="backlog-view-section" className="flex-1 overflow-y-auto p-10 bg-[#F4F7F9] text-left">
          
          {/* Backlog stat panels */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 select-none font-sans">
            <div className="bg-white border border-[#E1E4E8] rounded-xl p-5 shadow-sm text-left">
              <span className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-wider block">Iteration Planning</span>
              <p className="text-2xl font-bold font-display text-wm-navy mt-1">Iteration 2</p>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3 overflow-hidden">
                <div className="bg-wm-royal h-full" style={{ width: `${(totalCompletedCount / (sprintTasks.length || 1)) * 100}%` }}></div>
              </div>
              <span className="text-[9px] font-mono text-on-surface-variant block mt-1.5">
                {totalCompletedCount} in {sprintTasks.length} tasks completed
              </span>
            </div>

            <div className="bg-white border border-[#E1E4E8] rounded-xl p-5 shadow-sm text-left">
              <span className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-wider block">Uncommitted Backlog</span>
              <p className="text-2xl font-bold font-display text-on-surface mt-1">{totalBacklogCount} tasks</p>
              <span className="text-xs text-status-success font-medium block mt-3 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-shoutout-gold" />
                Product backlog size
              </span>
            </div>

            <div className="bg-white border border-[#E1E4E8] rounded-xl p-5 shadow-sm text-left">
              <span className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-wider block">High Priority Tickets</span>
              <p className="text-2xl font-bold font-display text-status-blocked mt-1">
                {tasks.filter(t => t.priority === 'High').length} items
              </p>
              <span className="text-[9px] font-mono text-on-surface-variant block mt-3">
                Requires direct coordinator attention
              </span>
            </div>

            <div className="bg-white border border-[#E1E4E8] rounded-xl p-5 shadow-sm text-left">
              <span className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-wider block">Sprint Velocity Estimated</span>
              <p className="text-2xl font-bold font-display text-wm-navy mt-1">16 Points</p>
              <span className="text-[9px] font-mono text-on-surface-variant block mt-3">
                Average intern deliverable capability
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-sans">
            {/* COLUMN 1: SPRINT BACKLOG MODULE */}
            <div className="bg-white border border-[#E1E4E8] rounded-xl p-6 shadow-sm flex flex-col min-h-[500px]">
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-[#F1F4F6]">
                <div>
                  <h3 className="font-bold text-base text-wm-navy flex items-center gap-2">
                    <Workflow className="w-5 h-5 text-wm-royal" />
                    <span>Active Sprint Backlog</span>
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">Tasks currently committed to the active iteration</p>
                </div>
                <span className="text-xs font-mono font-extrabold bg-[#e7f3ff] text-wm-royal px-3 py-1 rounded">
                  {sprintTasks.length} committed
                </span>
              </div>

              {/* Sprint Tasks List */}
              <div className="flex-1 overflow-y-auto space-y-3 max-h-[500px] pr-2">
                {sprintTasks.length === 0 ? (
                  <div className="py-20 text-center text-on-surface-variant/60 flex flex-col items-center justify-center gap-3">
                    <Layers className="w-10 h-10 stroke-1" />
                    <p className="text-sm">No tasks committed to the active sprint yet.</p>
                  </div>
                ) : (
                  sprintTasks.map(task => {
                    const taskAssignee = getTaskAssignee(task);

                    return (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className="group border border-[#E1E4E8] hover:border-wm-royal bg-[#FAFBCF]/5 hover:bg-white rounded-lg p-3.5 transition-all cursor-pointer relative"
                      >
                      {/* Three option buttons on top right of backlog cell */}
                      <div className="absolute top-2.5 right-3.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTransitionTask(task.id, task.status);
                          }}
                          className="p-1 rounded bg-neutral-100 hover:bg-wm-royal hover:text-white transition-colors"
                          title="Advance Column Status"
                        >
                          <ArrowRight className="w-3 h-3 text-neutral-600 hover:text-white" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSprintBacklog(task.id, task.status);
                          }}
                          className="p-1 rounded bg-neutral-100 hover:bg-neutral-600 hover:text-white transition-colors"
                          title="Send to Product Backlog"
                        >
                          <FolderOpen className="w-3 h-3 text-neutral-600 hover:text-white" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Delete key task "${task.title}"?`)) {
                              handleDeleteTaskFromBoard(task.id);
                            }
                          }}
                          className="p-1 rounded bg-neutral-100 hover:bg-status-blocked hover:text-white transition-colors"
                          title="Delete Action"
                        >
                          <Trash2 className="w-3 h-3 text-neutral-600 hover:text-white" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mb-2 pr-20">
                        <span className={`text-[8.5px] font-mono font-bold px-2 py-0.5 rounded capitalize ${
                          task.status === 'done' ? 'bg-[#d4edda] text-status-success' : 'bg-neutral-100 text-on-surface-variant'
                        }`}>
                          {task.status}
                        </span>
                        <span className="text-[8.5px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-wm-royal uppercase">
                          {task.type}
                        </span>
                        {task.priority === 'High' && (
                          <span className="text-[8.5px] font-mono font-bold px-1 rounded bg-red-50 text-status-blocked flex items-center gap-0.5">
                            <Flame className="w-2.5 h-2.5 animate-pulse" />
                            CRITICAL
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-bold text-wm-navy line-clamp-1 mb-2 group-hover:text-[#005fae]">
                        {task.title}
                      </h4>

                      <div className="flex items-center justify-between mt-3 text-[10px] text-on-surface-variant border-t border-[#F8F9FA] pt-2">
                        <span className="font-mono">Due: {task.dueDate}</span>
                        
                        {taskAssignee ? (
                          <div className="flex items-center gap-1.5">
                            <img src={taskAssignee.avatar} className="w-4 h-4 rounded-full" referrerPolicy="no-referrer" />
                            <span className="font-medium text-on-surface text-[9.5px]">{taskAssignee.name}</span>
                          </div>
                        ) : (
                          <span className="text-[9px] font-mono text-neutral-400">Unassigned</span>
                        )}
                      </div>
                    </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* COLUMN 2: PRODUCT BACKLOG VIEW & INLINE CREATE VIEW */}
            <div className="bg-white border border-[#E1E4E8] rounded-xl p-6 shadow-sm flex flex-col min-h-[500px]">
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-[#F1F4F6]">
                <div>
                  <h3 className="font-bold text-base text-wm-navy flex items-center gap-2">
                    <Layers className="w-5 h-5 text-shoutout-gold" />
                    <span>Product Backlog (Future Scope)</span>
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">Uncommitted tasks scheduled for future programming sprints</p>
                </div>
                <span className="text-xs font-mono font-extrabold bg-[#FAFBCF] text-on-surface px-3 py-1 rounded border border-[#E1E468]">
                  {backlogTasks.length} items
                </span>
              </div>

              {/* Inline quick create form */}
              <form onSubmit={handleCreateBacklogTask} className="mb-4 bg-[#F8F9FA] border border-gray-100 rounded-lg p-3">
                <div className="text-[9.5px] font-mono font-extrabold uppercase text-on-surface-variant px-1 mb-2">
                  Draft Quick Backlog Story
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Set up dynamic filters inside FAQ knowledge databases..."
                      value={backlogInputTitle}
                      onChange={(e) => setBacklogInputTitle(e.target.value)}
                      className="flex-1 font-sans text-xs bg-white border border-[#E1E4E8] px-3 py-2 rounded focus:ring-1 focus:ring-wm-royal outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-[#0072CE] hover:bg-wm-royal text-white text-xs px-4 py-2 rounded font-bold transition-colors cursor-pointer"
                    >
                      Add Item
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      {/* Priority toggle */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono text-on-surface-variant">Priority:</span>
                        <select
                          value={backlogInputPriority}
                          onChange={(e) => setBacklogInputPriority(e.target.value as 'High' | 'Medium' | 'Low')}
                          className="bg-white border rounded text-[10px] py-0.5 font-sans"
                        >
                          <option value="High">🔴 High</option>
                          <option value="Medium">🟡 Medium</option>
                          <option value="Low">🟢 Low</option>
                        </select>
                      </div>

                      {/* Type toggle */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono text-on-surface-variant">Category:</span>
                        <select
                          value={backlogInputType}
                          onChange={(e) => setBacklogInputType(e.target.value as 'Feature' | 'Bug Fix' | 'Opportunity')}
                          className="bg-white border rounded text-[10px] py-0.5 font-sans"
                        >
                          <option value="Feature">Feature</option>
                          <option value="Bug Fix">Bug Fix</option>
                          <option value="Opportunity">Opportunity</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </form>

              {/* Product Backlog tasks list */}
              <div className="flex-1 overflow-y-auto space-y-3 max-h-[380px] pr-2">
                {backlogTasks.length === 0 ? (
                  <div className="py-24 text-center text-on-surface-variant/60 flex flex-col items-center justify-center gap-3">
                    <Bookmark className="w-10 h-10 stroke-1" />
                    <p className="text-xs">Product Backlog is completely empty. Create a quick story above!</p>
                  </div>
                ) : (
                  backlogTasks.map(task => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className="group border border-[#E1E4E8] bg-white hover:border-shoutout-gold rounded-lg p-3.5 transition-all cursor-pointer relative"
                    >
                      {/* Three options top right buttons for product backlog cell */}
                      <div className="absolute top-2.5 right-3.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all z-10">
                        {/* Pull To active sprint */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSprintBacklog(task.id, task.status);
                          }}
                          className="p-1 rounded bg-[#EAF7EC] hover:bg-[#28A745] text-[#28A745] hover:text-white font-bold transition-all text-[9.5px] uppercase flex items-center gap-0.5"
                          title="Commit to Active Sprint"
                        >
                          <Plus className="w-3 h-3" />
                          <span className="pr-1">Commit</span>
                        </button>
                        {/* Instant delete */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Remove "${task.title}"?`)) {
                              handleDeleteTaskFromBoard(task.id);
                            }
                          }}
                          className="p-1.5 rounded bg-neutral-100 hover:bg-status-blocked text-neutral-600 hover:text-white transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mb-2 pr-32">
                        <span className={`text-[8.5px] font-mono font-bold px-2 py-0.5 rounded ${
                          task.priority === 'High' ? 'bg-red-50 text-status-blocked' :
                          task.priority === 'Medium' ? 'bg-amber-50 text-shoutout-gold' : 'bg-green-50 text-green-700'
                        }`}>
                          {task.priority} Priority
                        </span>
                        <span className="text-[8.5px] font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 text-on-surface-variant uppercase">
                          {task.type}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-wm-navy line-clamp-1 group-hover:text-[#005fae]">
                        {task.title}
                      </h4>

                      <p className="text-[10px] text-on-surface-variant line-clamp-2 mt-1 bg-neutral-50 p-1.5 rounded leading-relaxed">
                        {task.description || "No narrative supplied."}
                      </p>

                      <div className="flex items-center justify-between mt-3 text-[9px] text-on-surface-variant/80 border-t border-[#F8F9FA] pt-2 font-mono">
                        <span>Status: product-backlog</span>
                        <span className="text-[#0072CE] font-bold group-hover:underline">View details</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conditionally Render: Timeline Map (Gantt style Scheduling Dashboard) */}
      {subTab === 'timeline' && (
        <div id="timeline-view-section" className="flex-1 overflow-y-auto p-10 bg-[#F4F7F9] text-left">
          
          {/* Gantt Header explanatory block */}
          <div className="mb-6 font-sans">
            <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant">Program Schedule</span>
                <h3 className="font-display font-bold text-xl text-wm-navy mt-1 flex items-center gap-2">
                  <CalendarDays className="w-6 h-6 text-wm-royal" />
                  <span>Timeline Map</span>
                </h3>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-on-surface-variant uppercase">
                <Clock className="w-4 h-4 text-wm-royal" />
                <span>{sprintRangeLabel}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6 font-sans">
            <div className="bg-white border border-[#E1E4E8] rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold text-on-surface-variant uppercase tracking-wider">Upcoming Milestones</span>
                <Target className="w-4 h-4 text-wm-royal" />
              </div>
              <p className="text-2xl font-display font-bold text-wm-navy mt-3">{upcomingMilestonesCount}</p>
            </div>
            <div className="bg-white border border-[#E1E4E8] rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold text-on-surface-variant uppercase tracking-wider">Needs Attention</span>
                <AlertTriangle className="w-4 h-4 text-shoutout-gold" />
              </div>
              <p className="text-2xl font-display font-bold text-wm-navy mt-3">{attentionTimelineTasksCount}</p>
            </div>
            <div className="bg-white border border-[#E1E4E8] rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold text-on-surface-variant uppercase tracking-wider">Completed Tasks</span>
                <CheckCircle2 className="w-4 h-4 text-status-success" />
              </div>
              <p className="text-2xl font-display font-bold text-wm-navy mt-3">{completedTimelineTasksCount}</p>
            </div>
            <div className="bg-white border border-[#E1E4E8] rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold text-on-surface-variant uppercase tracking-wider">Outlook Events</span>
                <Calendar className="w-4 h-4 text-wm-royal" />
              </div>
              <p className="text-2xl font-display font-bold text-wm-navy mt-3">{outlookMeetingCount}</p>
            </div>
          </div>

          <div className="mb-6 font-sans">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant">Milestone Row</span>
                <h4 className="font-display font-bold text-lg text-wm-navy mt-1">Key Dates And Intern Goals</h4>
              </div>
              {canCreateInternMilestone && (
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingMilestone(prev => !prev);
                    setNewMilestoneError('');
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-wm-royal px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#005fae] active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isCreatingMilestone ? 'Close Form' : 'Add My Milestone'}</span>
                </button>
              )}
            </div>

            {isCreatingMilestone && canCreateInternMilestone && (
              <form
                onSubmit={handleCreateInternMilestone}
                className="mb-4 grid grid-cols-1 lg:grid-cols-12 gap-3 rounded-xl border border-wm-royal/20 bg-white p-4 shadow-sm"
              >
                <div className="lg:col-span-4">
                  <label className="block text-[9px] font-mono font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                    Milestone Name
                  </label>
                  <input
                    type="text"
                    value={newMilestoneTitle}
                    onChange={(event) => setNewMilestoneTitle(event.target.value)}
                    placeholder="Portfolio demo ready"
                    className="w-full rounded-lg border border-[#D0D5DD] bg-white px-3 py-2 text-sm font-semibold text-wm-navy outline-none focus:border-wm-royal focus:ring-2 focus:ring-wm-royal/15"
                  />
                </div>
                <div className="lg:col-span-3">
                  <label className="block text-[9px] font-mono font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newMilestoneDate}
                    min={formatDateKey(scheduleCalendarStartDate)}
                    max={formatDateKey(scheduleCalendarEndDate)}
                    onChange={(event) => setNewMilestoneDate(event.target.value)}
                    className="w-full rounded-lg border border-[#D0D5DD] bg-white px-3 py-2 text-sm font-semibold text-wm-navy outline-none focus:border-wm-royal focus:ring-2 focus:ring-wm-royal/15"
                  />
                </div>
                <div className="lg:col-span-3">
                  <label className="block text-[9px] font-mono font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                    Notes
                  </label>
                  <input
                    type="text"
                    value={newMilestoneDescription}
                    onChange={(event) => setNewMilestoneDescription(event.target.value)}
                    placeholder="What should be ready?"
                    className="w-full rounded-lg border border-[#D0D5DD] bg-white px-3 py-2 text-sm font-semibold text-wm-navy outline-none focus:border-wm-royal focus:ring-2 focus:ring-wm-royal/15"
                  />
                </div>
                <div className="lg:col-span-2 flex flex-col justify-end gap-2">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-wm-navy px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-wm-royal active:scale-95 transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                  {newMilestoneError && (
                    <p className="text-[10px] font-bold text-status-blocked">{newMilestoneError}</p>
                  )}
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
              {sortedProjectMilestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className={`border rounded-xl p-5 shadow-sm ${getMilestoneClassName(milestone)}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="rounded-lg bg-white/80 border border-current/10 px-3 py-2 text-center min-w-16">
                      <span className="block text-[10px] font-mono font-bold uppercase tracking-wider">
                        {parseTimelineDate(milestone.date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="block text-2xl font-display font-bold leading-none text-wm-navy mt-1">
                        {parseTimelineDate(milestone.date).getDate()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-white/85 px-2.5 py-1 text-[8.5px] font-mono font-bold uppercase tracking-wider border border-current/10">
                          {milestone.status}
                        </span>
                        {milestone.createdByName && (
                          <span className="rounded-full bg-wm-royal text-white px-2.5 py-1 text-[8.5px] font-mono font-bold uppercase tracking-wider">
                            {milestone.createdByName}
                          </span>
                        )}
                      </div>
                      <h5 className="font-display font-bold text-base leading-snug mt-3 text-wm-navy">{milestone.title}</h5>
                      <p className="text-xs leading-relaxed mt-2 text-on-surface-variant">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#E1E4E8] rounded-xl p-5 shadow-sm mb-8 font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F4F6] mb-4">
              <div>
                <span className="text-[9px] font-mono font-bold text-on-surface-variant uppercase tracking-wider">Outlook Calendar</span>
                <h4 className="font-display font-bold text-base text-wm-navy mt-1">Schedule View</h4>
                <p className="text-[11px] text-on-surface-variant mt-1">
                  Synced from {outlookMeetingCount} intern calendar events and {timelineTasks.length} project board items.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-on-surface-variant uppercase">
                <Calendar className="w-5 h-5 text-wm-royal" />
                <span>{scheduleRangeLabel}</span>
              </div>
            </div>

            <div className="grid grid-cols-7 border-y border-[#E1E4E8] bg-[#F7F9FC] text-center text-[9px] font-mono font-bold text-on-surface-variant uppercase">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(dayLabel => (
                <span key={dayLabel} className="border-r border-[#E1E4E8] last:border-r-0 py-2">{dayLabel}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 border-l border-[#E1E4E8]">
              {timelineCalendarDays.map(day => {
                const dayKey = formatDateKey(day);
                const dayTasks = getTasksForCalendarDay(day);
                const dayMeetings = getMeetingsForCalendarDay(day);
                const dayMilestones = getMilestonesForCalendarDay(day);
                const visibleMeetings = dayMeetings.slice(0, 2);
                const visibleTasks = dayTasks.slice(0, Math.max(0, 4 - visibleMeetings.length));
                const visibleMilestones = dayMilestones.slice(0, Math.max(0, 4 - visibleMeetings.length - visibleTasks.length));
                const calendarItemsCount = dayMeetings.length + dayTasks.length + dayMilestones.length;

                return (
                  <div
                    key={dayKey}
                    className="min-h-[132px] border-r border-b border-[#E1E4E8] bg-white p-2 text-left transition-colors"
                    title={`${formatTimelineDate(day)} - ${dayMeetings.length} Outlook events, ${dayTasks.length} project tasks, ${dayMilestones.length} milestones`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-wm-navy">
                        {day.getDate()}
                      </span>
                      {calendarItemsCount > 3 && (
                        <span className="text-[8.5px] font-mono font-bold text-on-surface-variant">
                          +{calendarItemsCount - 3}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      {visibleMeetings.map(meeting => (
                        <span
                          key={meeting.id}
                          className="block truncate rounded border border-[#0078d4]/25 bg-[#deecf9] px-2 py-1 text-[9px] font-bold text-[#0078d4]"
                          title={`${meeting.time} - ${meeting.title} (${meeting.location})`}
                        >
                          {meeting.time} {meeting.title}
                        </span>
                      ))}
                      {visibleTasks.map(task => (
                        <span
                          key={`${dayKey}-${task.id}`}
                          className={`block truncate rounded border px-2 py-1 text-[9px] font-bold ${getCalendarTaskClassName(task)}`}
                          title={task.title}
                        >
                          {task.title}
                        </span>
                      ))}
                      {visibleMilestones.map(milestone => (
                        <span
                          key={milestone.id}
                          className={`block truncate rounded border px-2 py-1 text-[9px] font-bold ${
                            milestone.category === 'intern'
                              ? 'border-wm-royal/30 bg-[#EAF4FF] text-wm-royal'
                              : 'border-shoutout-gold/35 bg-[#FFF7D6] text-[#8A6500]'
                          }`}
                          title={milestone.title}
                        >
                          {milestone.title}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4 mt-4 border-t border-[#F1F4F6] text-[9px] font-mono font-bold text-on-surface-variant uppercase">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#0078d4]" /> Outlook Event</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#0072CE]" /> Project Task</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-shoutout-gold" /> Milestone</span>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 font-sans">
            
            {/* SIDEBAR SCHEDULING FORM INTERFACES (xl:col-span-5) */}
            <div className="xl:col-span-5 bg-white border border-[#E1E4E8] rounded-xl p-6 shadow-sm">
              <div className="pb-3 border-b border-[#F1F4F6] mb-5">
                <span className="text-[9.5px] font-bold font-mono text-on-surface-variant uppercase tracking-wider">Workload Schedule Configuration</span>
                <h4 className="font-bold text-sm text-wm-navy mt-1">Task Windows</h4>
              </div>

              {/* Tasks schedule adjusters */}
              <div className="space-y-5 max-h-[500px] overflow-y-auto pr-2">
                {timelineTasks.length === 0 ? (
                  <div className="border border-dashed border-[#D0D5DD] rounded-lg p-6 text-center">
                    <p className="text-xs font-bold text-on-surface-variant">No tasks match the current search.</p>
                  </div>
                ) : timelineTasks.map(task => {
                  const { startOffset, duration, startDate, endDate } = getTaskWindow(task);

                  return (
                    <div key={task.id} className="p-3.5 border border-neutral-100 bg-neutral-50/50 rounded-lg hover:bg-neutral-50 transition-colors">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <h5 className="font-bold text-xs text-wm-navy line-clamp-1 max-w-[240px]" title={task.title}>{task.title}</h5>
                          <p className="text-[9px] font-mono font-bold text-on-surface-variant uppercase mt-1">
                            {formatTimelineDate(startDate)} - {formatTimelineDate(endDate)}
                          </p>
                        </div>
                        <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          task.status === 'done' ? 'bg-[#d4edda] text-status-success' :
                          task.status === 'progress' ? 'bg-[#e7f3ff] text-wm-royal' :
                          task.status === 'review' ? 'bg-[#FFF7D6] text-[#9A6B00]' : 'bg-gray-100 text-on-surface-variant'
                        }`}>
                          {task.status}
                        </span>
                      </div>

                      <div className="space-y-2 pt-1 select-none">
                        {/* Offset controls */}
                        <div className="flex items-center justify-between gap-3">
                          <label className="text-[9px] font-mono text-on-surface-variant font-bold uppercase w-20 shrink-0">Start Day Offset:</label>
                          <input
                            type="range"
                            min="1"
                            max={TIMELINE_TOTAL_DAYS}
                            value={startOffset}
                            onChange={(e) => handleUpdateScheduleOffset(task.id, parseInt(e.target.value))}
                            className="flex-1 accent-wm-royal"
                          />
                          <span className="text-[10px] font-mono font-extrabold w-12 text-right text-wm-royal">Day {startOffset}</span>
                        </div>

                        {/* Duration controls */}
                        <div className="flex items-center justify-between gap-3">
                          <label className="text-[9px] font-mono text-on-surface-variant font-bold uppercase w-20 shrink-0">Duration Scope:</label>
                          <input
                            type="range"
                            min="1"
                            max="14"
                            value={duration}
                            onChange={(e) => handleUpdateScheduleDuration(task.id, parseInt(e.target.value))}
                            className="flex-1 accent-shoutout-gold"
                          />
                          <span className="text-[10px] font-mono font-extrabold w-12 text-right text-shoutout-gold">{duration}d</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* VISUAL TIMELINE PLOTS (xl:col-span-7) */}
            <div className="xl:col-span-7 bg-white border border-[#E1E4E8] rounded-xl p-6 shadow-sm flex flex-col overflow-x-auto">
              
              {/* Gantt Timeline grid map header columns */}
              <div className="min-w-[500px]">
                
                {/* Visual grid timeline column headers */}
                <div className="grid grid-cols-12 border-b border-gray-200 pb-3 mb-4 text-center select-none font-mono text-[9px] font-bold text-on-surface-variant uppercase">
                  <div className="col-span-3 text-left font-bold text-wm-navy">Work Item Name</div>
                  <div className="col-span-9 grid grid-cols-6">
                    {timelineWeekLabels.map(week => (
                      <div key={week.id} className="border-l border-gray-100 first:border-l-0">
                        <span>{week.label}</span>
                        <span className="block text-[8px] font-semibold normal-case">{week.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vertical Gantt list plot lines */}
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                  {timelineTasks.length === 0 ? (
                    <div className="border border-dashed border-[#D0D5DD] rounded-lg p-6 text-center">
                      <p className="text-xs font-bold text-on-surface-variant">No timeline rows match the current search.</p>
                    </div>
                  ) : timelineTasks.map(task => {
                    const { duration, startDate, endDate } = getTaskWindow(task);
                    const taskAssignee = getTaskAssignee(task);
                    const isDone = task.status === 'done';

                    return (
                      <div key={task.id} className="grid grid-cols-12 items-center min-h-[70px] hover:bg-neutral-50 rounded pl-1 pr-1 py-2">
                        
                        {/* Title col (span 3) */}
                        <div className="col-span-3 text-left pr-2" title={task.title}>
                          <h5 className="text-xs font-bold text-wm-navy line-clamp-1">{task.title}</h5>
                          <div className="mt-2 grid grid-cols-1 gap-0.5 text-[8.5px] font-mono font-bold uppercase text-on-surface-variant">
                            <span className="truncate">Owner: {taskAssignee?.name ?? 'Unassigned'}</span>
                            <span className="truncate">{task.status} - {task.priority}</span>
                            <span className="truncate">{formatTimelineDate(startDate)} - {formatTimelineDate(endDate)}</span>
                          </div>
                        </div>

                        {/* Gantt space columns (span 9 allocated) */}
                        <div className="col-span-9 h-9 relative bg-gray-50 border border-gray-100 rounded-md overflow-hidden">
                          <div className="absolute inset-0 grid grid-cols-6">
                            {timelineWeekLabels.map(week => (
                              <span key={`${task.id}-${week.id}`} className="border-l border-gray-100 first:border-l-0" />
                            ))}
                          </div>
                          <div
                            className="absolute top-0 bottom-0 w-px bg-wm-royal/40 z-10"
                            style={{ left: currentTimelineLeft }}
                            title={`${currentProjectMilestone?.title ?? 'Current project marker'}: ${formatTimelineDate(currentScheduleDate)}`}
                          />
                          {sortedProjectMilestones.map(milestone => {
                            const milestoneOffset = getMilestoneOffset(milestone.date);
                            if (milestoneOffset < 1 || milestoneOffset > TIMELINE_TOTAL_DAYS) return null;

                            return (
                              <div
                                key={`${task.id}-${milestone.id}`}
                                className={`absolute top-0 bottom-0 w-px z-10 ${
                                  milestone.status === 'current' ? 'bg-wm-royal/60' : 'bg-shoutout-gold/55'
                                }`}
                                style={{ left: `${((milestoneOffset - 1) / TIMELINE_TOTAL_DAYS) * 100}%` }}
                                title={`${milestone.title}: ${formatTimelineDate(parseTimelineDate(milestone.date))}`}
                              />
                            );
                          })}
                          {/* Inner bar representing calendar window timeline block */}
                          <div 
                            className={`absolute h-7 top-1 rounded shadow-sm text-white font-mono text-[8.5px] font-bold flex items-center px-2 select-none overflow-hidden truncate transition-all duration-300 ${
                              isDone ? 'bg-[#28A745] hover:bg-[#218838]' :
                              task.status === 'progress' ? 'bg-[#0072CE] hover:bg-wm-royal' :
                              task.status === 'review' ? 'bg-[#F2A900] text-neutral-900 border border-amber-300 hover:bg-amber-500' :
                              task.status === 'backlog' ? 'bg-neutral-400 hover:bg-neutral-500' : 'bg-neutral-500'
                            }`}
                            style={getTimelineBarStyle(task)}
                            title={`${task.title}: ${formatTimelineDate(startDate)} - ${formatTimelineDate(endDate)}`}
                          >
                            <span className="truncate">{duration}d - {task.priority}</span>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* Task Details Interactive Popup Modal Dialogue */}
      {activeTaskDetails && (
        <TaskDetailModal
          task={activeTaskDetails}
          onClose={() => setSelectedTask(null)}
          onUpdateTask={handleUpdateTaskInBoard}
          onDeleteTask={handleDeleteTaskFromBoard}
          assignableUsers={summerInternUsers}
          currentUser={activeInternUser}
        />
      )}

    </div>
  );
}
