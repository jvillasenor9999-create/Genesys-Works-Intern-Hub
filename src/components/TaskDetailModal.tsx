import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Trash2, 
  UserPlus, 
  Sparkles, 
  CheckSquare, 
  MessageSquare,
  AlertTriangle,
  Flame,
  TrendingUp,
  Tag,
  Calendar,
  Layers,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Task, ManagedUser } from '../types';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (taskId: string) => void;
  assignableUsers: ManagedUser[];
  currentUser?: ManagedUser;
}

export default function TaskDetailModal({
  task,
  onClose,
  onUpdateTask,
  onDeleteTask,
  assignableUsers,
  currentUser
}: TaskDetailModalProps) {
  // Local edit states
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState<Task['status']>(task.status);
  const [type, setType] = useState<Task['type']>(task.type);
  const [priority, setPriority] = useState<Task['priority']>(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [progress, setProgress] = useState<number>(task.progress ?? (task.status === 'done' ? 100 : 0));
  const [comments, setComments] = useState(task.comments || []);
  const [newCommentText, setNewCommentText] = useState('');

  const initialAssigneeUserId = task.assigneeUserId
    || assignableUsers.find(user => user.name === task.assignee?.name)?.id
    || '';
  const [assigneeUserId, setAssigneeUserId] = useState(initialAssigneeUserId);
  const selectedAssignee = assignableUsers.find(user => user.id === assigneeUserId);

  const getAssigneeSnapshot = (userId: string) => {
    const user = assignableUsers.find(member => member.id === userId);
    return user ? { name: user.name, avatar: user.avatar } : undefined;
  };

  // Handle saving edits immediately to parent (reactive updates)
  const handleNotifyUpdate = (overrides: Partial<Task> = {}) => {
    const updated: Task = {
      ...task,
      title,
      description,
      status,
      type,
      priority,
      dueDate,
      progress: progress > 0 || task.progress !== undefined ? progress : undefined,
      assigneeUserId: assigneeUserId || undefined,
      assignee: getAssigneeSnapshot(assigneeUserId),
      comments,
      commentsCount: comments.length,
      ...overrides
    };
    onUpdateTask(updated);
  };

  // Dispatch change instantly on blur or selection changes
  const triggerBlurUpdate = () => {
    handleNotifyUpdate();
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment = {
      id: `comment-${Date.now()}`,
      author: currentUser ? `${currentUser.name} (You)` : 'Active Intern (You)',
      avatar: currentUser?.avatar || selectedAssignee?.avatar || '',
      text: newCommentText.trim(),
      date: 'Just now'
    };

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    setNewCommentText('');

    // Persist this immediately to the parent lists
    const updated: Task = {
      ...task,
      title,
      description,
      status,
      type,
      priority,
      dueDate,
      progress: progress > 0 || task.progress !== undefined ? progress : undefined,
      assigneeUserId: assigneeUserId || undefined,
      assignee: getAssigneeSnapshot(assigneeUserId),
      comments: updatedComments,
      commentsCount: updatedComments.length
    };
    onUpdateTask(updated);
  };

  const selectAssignee = (userId: string) => {
    setAssigneeUserId(userId);
    const updated: Task = {
      ...task,
      title,
      description,
      status,
      type,
      priority,
      dueDate,
      progress: progress > 0 || task.progress !== undefined ? progress : undefined,
      assigneeUserId: userId || undefined,
      assignee: getAssigneeSnapshot(userId),
      comments,
      commentsCount: comments.length
    };
    onUpdateTask(updated);
  };

  const handleToggleCompleted = () => {
    const nextStatus: Task['status'] = status === 'done' ? 'todo' : 'done';
    const nextProgress = nextStatus === 'done' ? 100 : 0;
    const nextType: Task['type'] = nextStatus === 'done' ? 'Completed' : 'Feature';

    setStatus(nextStatus);
    setProgress(nextProgress);
    setType(nextType);

    const updated: Task = {
      ...task,
      title,
      description,
      status: nextStatus,
      type: nextType,
      priority,
      dueDate,
      progress: nextProgress,
      assigneeUserId: assigneeUserId || undefined,
      assignee: getAssigneeSnapshot(assigneeUserId),
      comments,
      commentsCount: comments.length
    };
    onUpdateTask(updated);
  };

  // Match columns to select
  const statusLabels = {
    todo: 'To Do',
    progress: 'In Progress',
    review: 'In Review',
    done: 'Done'
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xl max-w-4xl w-full overflow-hidden text-left flex flex-col max-h-[90vh] animate-zoom-in">
        
        {/* Modal Primary Header */}
        <div className="bg-[#002B49] text-white p-5 px-6 shrink-0 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <CheckSquare className="w-5 h-5 text-shoutout-gold" />
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-300 tracking-wider font-mono">Task ID: {task.id}</span>
              <p className="text-[11px] text-gray-300 font-sans mt-0.5">Edit system coordinates and activity history thread</p>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={onClose} 
            className="text-white hover:opacity-85 p-1 bg-white/10 hover:bg-white/20 rounded-full transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Main Panel Grid (Content is scrollable) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* LEFT 8 COLUMNS: Information inputs & Comments conversation */}
          <div className="lg:col-span-8 p-6 lg:p-8 space-y-6 lg:border-r border-gray-150">
            
            {/* Click to Edit Task Title */}
            <div className="space-y-1">
              <label className="text-[9px] font-mono uppercase font-extrabold text-on-surface-variant flex items-center gap-1">
                <span>Task Title</span>
                <span className="text-gray-400 font-normal lowercase">(autosaves on blur)</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={triggerBlurUpdate}
                placeholder="Name your task item..."
                className="w-full text-base font-bold text-wm-navy bg-transparent hover:bg-neutral-50 focus:bg-white focus:ring-1 focus:ring-wm-royal p-1.5 -ml-1.5 rounded outline-none transition-colors"
              />
            </div>

            {/* Click to Edit Description */}
            <div className="space-y-1">
              <label className="text-[9px] font-mono uppercase font-extrabold text-on-surface-variant flex items-center gap-1">
                <span>Core Description</span>
                <span className="text-gray-400 font-normal lowercase">(autosaves on blur)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={triggerBlurUpdate}
                placeholder="Give more details for the assignment workload or steps required..."
                rows={4}
                className="w-full text-xs font-medium text-wm-navy bg-transparent hover:bg-neutral-50 focus:bg-white focus:ring-1 focus:ring-wm-royal p-2 -ml-2 rounded border border-transparent hover:border-gray-100 outline-none leading-relaxed transition-colors whitespace-pre-wrap"
              />
            </div>

            {/* Task Workload Progress Slider */}
            <div className="p-4 bg-neutral-50 border border-gray-200 rounded-xl space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-wm-navy select-none flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-status-progress"></span>
                  <span>Workload Progress Tracker</span>
                </span>
                <span className="font-mono text-[11px] font-bold text-wm-royal bg-blue-50 px-2 py-0.5 rounded">
                  {progress}% Complete
                </span>
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={progress}
                  onChange={(e) => {
                    const p = parseInt(e.target.value);
                    setProgress(p);
                    // Automatically transition status from Done if slider goes down, or conversely
                    let nextStatus = status;
                    let nextType = type;
                    if (p === 100 && status !== 'done') {
                      nextStatus = 'done';
                      nextType = 'Completed';
                    } else if (p < 100 && status === 'done') {
                      nextStatus = 'progress';
                      nextType = 'Feature';
                    }
                    setStatus(nextStatus);
                    setType(nextType);

                    // Notify changes
                    const updated: Task = {
                      ...task,
                      title,
                      description,
                      status: nextStatus,
                      type: nextType,
                      priority,
                      dueDate,
                      progress: p,
                      assigneeUserId: assigneeUserId || undefined,
                      assignee: getAssigneeSnapshot(assigneeUserId),
                      comments,
                      commentsCount: comments.length
                    };
                    onUpdateTask(updated);
                  }}
                  className="flex-1 accent-wm-royal h-1.5 bg-gray-200 rounded-lg cursor-ew-resize appearance-none"
                />

                {/* Progress bar render */}
                <div className="w-1/3 bg-neutral-200 h-2 rounded-full overflow-hidden shrink-0 hidden sm:block">
                  <div 
                    className="bg-status-progress h-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Live Comment Thread */}
            <div className="space-y-4 pt-3">
              <span className="text-[9px] font-mono uppercase font-extrabold text-on-surface-variant flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                <span>Discussion Board Thread ({comments.length})</span>
              </span>

              {/* Comment Thread listing */}
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 text-left p-2.5 rounded-lg bg-neutral-50/50 border border-gray-150 animate-fade-in">
                      <img
                        src={comment.avatar}
                        alt={comment.author}
                        className="w-7 h-7 rounded-full border border-gray-150 shrink-0 object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-wm-navy">{comment.author}</span>
                          <span className="text-[8.5px] font-mono text-on-surface-variant">{comment.date}</span>
                        </div>
                        <p className="text-[11px] text-on-surface-variant leading-relaxed">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 border border-dashed border-gray-150 bg-neutral-50 rounded-lg">
                    <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-1.5" />
                    <p className="text-[11px] text-on-surface-variant font-medium">No comments posted yet. Ask a mentor or teammate for advice!</p>
                  </div>
                )}
              </div>

              {/* Box to Post Comments */}
              <form onSubmit={handlePostComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a question or provide progress logs..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="flex-1 text-xs px-3.5 py-2.5 bg-[#F1F4F6] border-none rounded-lg focus:bg-white focus:ring-1 focus:ring-wm-royal outline-none"
                />
                <button
                  type="submit"
                  className="bg-wm-navy text-white px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-wm-navy/95 transition-all text-center shrink-0 cursor-pointer"
                >
                  Send
                </button>
              </form>
            </div>

          </div>

          {/* RIGHT 4 COLUMNS: Control Panel sidebar settings */}
          <div className="lg:col-span-4 p-6 lg:p-8 bg-neutral-50/70 space-y-5 flex flex-col text-left justify-between">
            
            <div className="space-y-5">
              <span className="text-[9px] font-mono uppercase font-extrabold text-on-surface-variant tracking-wider block">Properties Panel</span>

              {/* Status Dropper */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-wm-navy flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-gray-500" />
                  <span>Sprint Status</span>
                </label>
                <select
                  value={status}
                  onChange={(e) => {
                    const nextVal = e.target.value as Task['status'];
                    setStatus(nextVal);
                    // Match progress
                    let nextP = progress;
                    let nextT = type;
                    if (nextVal === 'done') {
                      nextP = 100;
                      nextT = 'Completed';
                    } else if (status === 'done') {
                      nextP = 0;
                      nextT = 'Feature';
                    }
                    setProgress(nextP);
                    setType(nextT);

                    const updated: Task = {
                      ...task,
                      title,
                      description,
                      status: nextVal,
                      type: nextT,
                      priority,
                      dueDate,
                      progress: nextP,
                      assigneeUserId: assigneeUserId || undefined,
                      assignee: getAssigneeSnapshot(assigneeUserId),
                      comments,
                      commentsCount: comments.length
                    };
                    onUpdateTask(updated);
                  }}
                  className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-lg cursor-pointer outline-none focus:ring-1 focus:ring-wm-royal shadow-3xs"
                >
                  <option value="todo">To Do</option>
                  <option value="progress">In Progress</option>
                  <option value="review">In Review</option>
                  <option value="done">Done</option>
                </select>
              </div>

              {/* Type Dropper */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-wm-navy flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-gray-500" />
                  <span>Work Class</span>
                </label>
                <select
                  value={type}
                  onChange={(e) => {
                    const nextVal = e.target.value as Task['type'];
                    setType(nextVal);
                    const updated: Task = {
                      ...task,
                      title,
                      description,
                      status,
                      type: nextVal,
                      priority,
                      dueDate,
                      progress: progress,
                      assigneeUserId: assigneeUserId || undefined,
                      assignee: getAssigneeSnapshot(assigneeUserId),
                      comments,
                      commentsCount: comments.length
                    };
                    onUpdateTask(updated);
                  }}
                  className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-lg cursor-pointer outline-none focus:ring-1 focus:ring-wm-royal shadow-3xs"
                >
                  <option value="Feature">Feature</option>
                  <option value="Bug Fix">Bug Fix</option>
                  <option value="Opportunity">Opportunity</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Target Due date input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-wm-navy flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-500" />
                  <span>Target Due Date</span>
                </label>
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  onBlur={triggerBlurUpdate}
                  placeholder="e.g. Sep 22"
                  className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-wm-royal shadow-3xs"
                />
              </div>

              {/* Priority State scale Buttons */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-wm-navy block">Priority Scale</label>
                <div className="flex gap-2">
                  {(['High', 'Medium', 'Low'] as Task['priority'][]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setPriority(p);
                        const updated: Task = {
                          ...task,
                          title,
                          description,
                          status,
                          type,
                          priority: p,
                          dueDate,
                          progress: progress,
                          assigneeUserId: assigneeUserId || undefined,
                          assignee: getAssigneeSnapshot(assigneeUserId),
                          comments,
                          commentsCount: comments.length
                        };
                        onUpdateTask(updated);
                      }}
                      className={`flex-1 py-1.5 rounded text-[10px] font-bold text-center border cursor-pointer select-none transition-all ${
                        priority === p
                          ? p === 'High'
                            ? 'bg-red-50 text-red-600 border-red-300 shadow-3xs'
                            : p === 'Medium'
                            ? 'bg-amber-50 text-amber-600 border-[#ffd981] shadow-3xs'
                            : 'bg-emerald-50 text-emerald-600 border-emerald-300 shadow-3xs'
                          : 'bg-white text-on-surface-variant hover:bg-neutral-100 border-gray-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Crew Assignee Grid selection list */}
              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-bold text-wm-navy block">Responsible Assignee</label>
                
                {/* Visual Chosen Assignee Indicator */}
                {selectedAssignee ? (
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={selectedAssignee.avatar}
                        alt={selectedAssignee.name}
                        className="w-7 h-7 rounded-full object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="text-[11px] font-bold text-wm-navy block leading-none">{selectedAssignee.name}</span>
                        <span className="text-[9px] text-on-surface-variant tracking-tight font-sans">Active Assignee</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => selectAssignee('')}
                      className="text-[9px] font-bold font-sans text-red-500 hover:underline uppercase"
                    >
                      Unassign
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-white border border-dashed border-gray-300 hover:border-wm-royal rounded-lg flex items-center justify-center gap-2 text-on-surface-variant cursor-pointer text-xs">
                    <UserPlus className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-[11px]">Unassigned Task</span>
                  </div>
                )}

                {/* Grid Roster for Quick Assign */}
                <div className="grid grid-cols-6 gap-1.5 pt-1.5 justify-items-center bg-white p-2 border border-gray-150 rounded-lg">
                  {assignableUsers.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => selectAssignee(member.id)}
                      title={`Assign to ${member.name}`}
                      className={`w-7.5 h-7.5 rounded-full overflow-hidden border-2 cursor-pointer transition-all ${
                        assigneeUserId === member.id ? 'border-[#0072CE] scale-110 shadow-3xs' : 'border-transparent hover:scale-105 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Actions of Property Panel */}
            <div className="space-y-2 pt-6 border-t border-gray-200 mt-6 select-none shrink-0">
              
              {/* Check complete state toggle */}
              <button
                type="button"
                onClick={handleToggleCompleted}
                className={`w-full py-2.5 rounded-lg text-xs font-bold font-sans flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  status === 'done'
                    ? 'bg-neutral-200 text-neutral-700 hover:bg-neutral-250'
                    : 'bg-[#FAFBCF]/10 hover:bg-emerald-100 bg-emerald-50 text-emerald-800 border border-emerald-250'
                }`}
              >
                {status === 'done' ? 'Mark Task Uncompleted' : '✓ Mark Completed'}
              </button>

              {/* Delete action */}
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete and remove task "${title}"?`)) {
                    onDeleteTask(task.id);
                  }
                }}
                className="w-full py-2.5 bg-red-50 hover:bg-red-100/60 text-red-600 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Task Card</span>
              </button>
            </div>

          </div>

        </div>

        {/* Modal Done Footer */}
        <div className="bg-neutral-50 px-6 py-4.5 border-t border-gray-150 flex justify-end shrink-0 select-none">
          <button
            type="button"
            onClick={onClose}
            className="bg-wm-royal text-white hover:opacity-95 px-6 py-2 rounded-lg font-bold text-xs shadow-sm cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
