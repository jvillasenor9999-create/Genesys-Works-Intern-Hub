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
  Activity,
  UserCheck
} from 'lucide-react';
import { Task, UserRole, UserPermissions } from '../../types';
import TaskDetailModal from '../TaskDetailModal';

interface ProjectBoardViewProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  searchQuery: string;
  onOpenNewTaskModal: () => void;
  subTab?: 'board' | 'backlog' | 'timeline';
  setSubTab?: (subTab: 'board' | 'backlog' | 'timeline') => void;
  userRole?: UserRole;
  permissions?: UserPermissions;
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
  }
}: ProjectBoardViewProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Drag and drop states for Kanban Board
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [isDraggingOverCol, setIsDraggingOverCol] = useState<string | null>(null);

  // Inline backlog task creation state
  const [backlogInputTitle, setBacklogInputTitle] = useState('');
  const [backlogInputPriority, setBacklogInputPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [backlogInputType, setBacklogInputType] = useState<'Feature' | 'Bug Fix' | 'Opportunity'>('Feature');

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
          assignee: {
            name: 'Alex Rivera',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPyTh4ZqA7kjWPwR-sCujEJOhg7n16iz7uA67wBEeBWF36WSGZlp0qDliA4zF--C5o_NSxHdnHVGf1DKIQGNsX-bPH7Rd8qDv6XNTxjvx8B98mnsyVk9yHECSaAfB6F6FqGS4zRVOh90q5RnmBG-XnDT-mmtHBH828nU0RT397Ca_IB8kRBYOjoOeTnuWX1OzJhypYPxUQR01GgUe6l3hizgg8vpyipfCa2mfORJTcFZcOu5yVdbcTMroqeSVJSCyoigqx7w0tkJ8'
          }
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
      progress: 0
    };

    setTasks(prev => [newTask, ...prev]);
    setBacklogInputTitle('');
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
                      const hasAssignee = !!task.assignee;
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
                              <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200 ml-1.5 shrink-0" title={task.assignee?.name}>
                                <img 
                                  src={task.assignee?.avatar} 
                                  alt={task.assignee?.name} 
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
                  sprintTasks.map(task => (
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
                        
                        {task.assignee ? (
                          <div className="flex items-center gap-1.5">
                            <img src={task.assignee.avatar} className="w-4 h-4 rounded-full" referrerPolicy="no-referrer" />
                            <span className="font-medium text-on-surface text-[9.5px]">{task.assignee.name}</span>
                          </div>
                        ) : (
                          <span className="text-[9px] font-mono text-neutral-400">Unassigned</span>
                        )}
                      </div>
                    </div>
                  ))
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
        <div id="timeline-view-section" className="flex-1 overflow-y-auto p-10 bg-[#FAFBCF]/10 bg-[#F4F7F9] text-left">
          
          {/* Gantt Header explanatory block */}
          <div className="bg-white border border-[#E1E4E8] rounded-xl p-6 shadow-sm mb-8 font-sans">
            <h3 className="font-bold text-base text-wm-navy flex items-center gap-2">
              <CalendarDays className="w-5.5 h-5.5 text-wm-royal" />
              <span>Program Schedule Mapping</span>
            </h3>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              Drag start offset sliders and adjust workload durations on the sidebar panels. Changes are reactive and dynamically adjust horizontal timeline bars to trace workload overlap metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 font-sans">
            
            {/* SIDEBAR SCHEDULING FORM INTERFACES (xl:col-span-5) */}
            <div className="xl:col-span-5 bg-white border border-[#E1E4E8] rounded-xl p-6 shadow-sm">
              <div className="pb-3 border-b border-[#F1F4F6] mb-5">
                <span className="text-[9.5px] font-bold font-mono text-on-surface-variant uppercase tracking-wider">Workload Schedule Configuration</span>
                <h4 className="font-bold text-sm text-wm-navy mt-1">Interactive Gantt Gantt-Adjusters</h4>
              </div>

              {/* Tasks schedule adjusters */}
              <div className="space-y-5 max-h-[500px] overflow-y-auto pr-2">
                {tasks.map(task => {
                  const currentStart = task.startDaysOffset || 2;
                  const currentDuration = task.durationDays || 5;

                  return (
                    <div key={task.id} className="p-3.5 border border-neutral-100 bg-neutral-50/50 rounded-lg hover:bg-neutral-50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-bold text-xs text-wm-navy line-clamp-1 max-w-[240px]">{task.title}</h5>
                        <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          task.status === 'done' ? 'bg-[#d4edda] text-status-success' :
                          task.status === 'progress' ? 'bg-[#e7f3ff] text-wm-royal' : 'bg-gray-100 text-on-surface-variant'
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
                            max="14"
                            value={currentStart}
                            onChange={(e) => handleUpdateScheduleOffset(task.id, parseInt(e.target.value))}
                            className="flex-1 accent-wm-royal"
                          />
                          <span className="text-[10px] font-mono font-extrabold w-8 text-right text-wm-royal">Day {currentStart}</span>
                        </div>

                        {/* Duration controls */}
                        <div className="flex items-center justify-between gap-3">
                          <label className="text-[9px] font-mono text-on-surface-variant font-bold uppercase w-20 shrink-0">Duration Scope:</label>
                          <input
                            type="range"
                            min="2"
                            max="14"
                            value={currentDuration}
                            onChange={(e) => handleUpdateScheduleDuration(task.id, parseInt(e.target.value))}
                            className="flex-1 accent-shoutout-gold"
                          />
                          <span className="text-[10px] font-mono font-extrabold w-8 text-right text-shoutout-gold">{currentDuration}d</span>
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
                  <div className="col-span-2 border-l border-gray-100">Week 1 (Sep 15)</div>
                  <div className="col-span-3 border-l border-gray-100">Week 2 (Sep 22)</div>
                  <div className="col-span-2 border-l border-gray-100">Week 3 (Sep 29)</div>
                  <div className="col-span-2 border-l border-gray-100">Week 4 (Oct 06)</div>
                </div>

                {/* Vertical Gantt list plot lines */}
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                  {tasks.map(task => {
                    const offset = task.startDaysOffset || 2;
                    const duration = task.durationDays || 5;
                    const isDone = task.status === 'done';

                    // Compute grid percentages or classes (e.g. 15 columns for the timeline)
                    // We allocate 9 columns of the timeline grid for drawing bars, since total columns are 12, and 3 are for title prefix!
                    return (
                      <div key={task.id} className="grid grid-cols-12 items-center min-h-[38px] hover:bg-neutral-50 rounded pl-1 pr-1 py-1">
                        
                        {/* Title col (span 3) */}
                        <div className="col-span-3 text-left pr-2 text-xs font-bold text-wm-navy line-clamp-1" title={task.title}>
                          {task.title}
                        </div>

                        {/* Gantt space columns (span 9 allocated) */}
                        <div className="col-span-9 h-6 relative bg-gray-50 border border-gray-100 rounded-md overflow-hidden">
                          {/* Inner bar representing calendar window timeline block */}
                          <div 
                            className={`absolute h-5 top-0.5 rounded shadow-sm text-white font-mono text-[8px] font-bold flex items-center px-2 select-none overflow-hidden truncate transition-all duration-300 ${
                              isDone ? 'bg-[#28A745] hover:bg-[#218838]' :
                              task.status === 'progress' ? 'bg-[#0072CE] hover:bg-wm-royal' :
                              task.status === 'review' ? 'bg-[#F2A900] text-neutral-900 border border-amber-300 hover:bg-amber-500' :
                              task.status === 'backlog' ? 'bg-neutral-400 hover:bg-neutral-500' : 'bg-neutral-500'
                            }`}
                            style={{ 
                              left: `${(offset / 15) * 100}%`, 
                              width: `${(duration / 15) * 100}%` 
                            }}
                          >
                            <span className="truncate">{task.priority} Priority • {duration}d</span>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

                {/* Milestone timeline markers */}
                <div className="mt-8 border-t border-neutral-200 pt-5 select-none font-sans text-xs">
                  <h4 className="font-bold text-xs text-wm-navy uppercase tracking-wider mb-3">Commitment Milestones Scheduled</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 bg-neutral-50 p-2.5 rounded border border-gray-150">
                      <span className="text-[10px] font-mono font-bold bg-[#E1E4E8] text-on-surface-variant px-2 py-0.5 rounded">WEEK 1</span>
                      <p className="font-bold text-xs text-wm-navy">SSO Integration Architecture Handshake</p>
                    </div>
                    <div className="flex items-center gap-3 bg-neutral-50 p-2.5 rounded border border-gray-150">
                      <span className="text-[10px] font-mono font-bold bg-[#FAFBCF] text-on-surface px-2 py-0.5 rounded border border-[#E1E468]">WEEK 3</span>
                      <p className="font-bold text-xs text-wm-navy">Mid-Term Intern Deliverables Coordinator Audit</p>
                    </div>
                    <div className="flex items-center gap-3 bg-neutral-50 p-2.5 rounded border border-gray-150">
                      <span className="text-[10px] font-mono font-bold bg-[#e7f3ff] text-wm-royal px-2 py-0.5 rounded">WEEK 4</span>
                      <p className="font-bold text-xs text-wm-navy">Consulting Case Presentation Cohort Rehearsal</p>
                    </div>
                  </div>
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
        />
      )}

    </div>
  );
}
