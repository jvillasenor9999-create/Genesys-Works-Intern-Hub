import React, { useState } from 'react';
import { 
  Zap, 
  Grid, 
  Cpu, 
  Share2, 
  AlarmClock, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Star, 
  Calendar, 
  PlusSquare, 
  PlusCircle,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { Task, Shoutout, QuickLink, Meeting } from '../../types';

interface DashboardViewProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  shoutouts: Shoutout[];
  setShoutouts: React.Dispatch<React.SetStateAction<Shoutout[]>>;
  quickLinks: QuickLink[];
  meetings: Meeting[];
  brandProgress: number; // overall progress e.g., 42
  onNavigateToTab: (tab: string) => void;
  onOpenNewTaskModal: () => void;
  onOpenMeetingsModal: () => void;
}

export default function DashboardView({
  tasks,
  setTasks,
  shoutouts,
  setShoutouts,
  quickLinks,
  meetings,
  brandProgress,
  onNavigateToTab,
  onOpenNewTaskModal,
  onOpenMeetingsModal
}: DashboardViewProps) {
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  
  // New Shoutout input states
  const [showShoutoutForm, setShowShoutoutForm] = useState(false);
  const [shoutoutNominee, setShoutoutNominee] = useState('');
  const [shoutoutText, setShoutoutText] = useState('');

  // Local states for Outlook-style Calendar
  const [calMonth, setCalMonth] = useState<number>(9); // 0-indexed, default is October (9)
  const [calYear, setCalYear] = useState<number>(2026);
  const [selectedDay, setSelectedDay] = useState<number>(24);
  const [viewMode, setViewMode] = useState<'calendar' | 'agenda'>('calendar');

  const MONTHS_MAP: { [key: string]: number } = {
    JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
    JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11
  };
  const MONTHS_FULL_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const activeTasks = tasks.filter(t => t.status !== 'done').slice(0, 3);

  // Toggle tasks completion as requested in JS simulations
  const handleToggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status: t.status === 'progress' ? 'todo' : 'progress' };
      }
      return t;
    }));
    triggerFeedback('Task status updated!');
  };

  const handleStarShoutout = (shoutoutId: string) => {
    setShoutouts(prev => prev.map(s => {
      if (s.id === shoutoutId) {
        return { ...s, starred: !s.starred };
      }
      return s;
    }));
  };

  const triggerFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const submitNewShoutout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shoutoutNominee || !shoutoutText) return;

    const newShout: Shoutout = {
      id: `shoutout-${Date.now()}`,
      nominee: shoutoutNominee,
      nomineeAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGdqcGBvWzX4W0pLtK6WK5xNDjzekwKynlTNOnSVihl0q0SrKpTV5UsU7Fgh7mdUCozYXSZzbcHKXnry8SQwoOIo3_MqdxFlC44NrKItrmou3Ip_3ywtFIOUV2mTk6wij7Lurwx64hu8f1ncQk9bMg5KctsKGNp-omd4g3H1CfK1sLqNdUGZWIM1QjZnb-LbVlz13B60JJ_n8eEmNxiavXUEhB3JZAIEVwjGbe2ABjV-ZQ_Ndwc_x5oe44U2PPSrCMDDD65BITo0w',
      text: `"${shoutoutText}"`,
      recognizedBy: 'Alex Rivera',
      timeAgo: 'Just now',
      starred: true
    };

    setShoutouts([newShout, ...shoutouts]);
    setShoutoutNominee('');
    setShoutoutText('');
    setShowShoutoutForm(false);
    triggerFeedback('ShoutOut created! Thank you for reinforcing company excellence.');
  };

  // Helper matching Lucide icon string to component
  const renderQuickLinkIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-5 h-5 text-wm-navy" />;
      case 'Grid':
        return <Grid className="w-5 h-5 text-wm-navy" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-wm-navy" />;
      case 'Share2':
        return <Share2 className="w-5 h-5 text-wm-navy" />;
      default:
        return <Cpu className="w-5 h-5 text-wm-navy" />;
    }
  };

  // Onboarding circular SVG parameters
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (brandProgress / 100) * circumference;

  return (
    <div className="space-y-8 select-none">
      {/* Toast Feedback */}
      {feedbackMsg && (
        <div className="fixed bottom-6 right-6 bg-wm-navy text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 z-50 text-xs animate-bounce font-medium">
          <Sparkles className="w-4.5 h-4.5 text-shoutout-gold" strokeWidth={2} />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="text-left">
          <h3 className="text-3xl font-display font-bold text-wm-navy">Welcome back, Alex</h3>
          <p className="text-sm font-sans text-on-surface-variant max-w-xl mt-1.5 leading-relaxed">
            You're making great progress in your internship. Here's a quick look at where things stand today at West Monroe.
          </p>
        </div>

        {/* Onboarding Overview progress circle widget */}
        <div 
          onClick={() => onNavigateToTab('onboarding')}
          className="bg-white border border-[#E1E4E8] p-5 rounded-xl flex items-center gap-4 min-w-[280px] shadow-sm hover:border-wm-royal transition-all cursor-pointer group"
        >
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle className="text-[#ebeef0]" cx="32" cy="32" fill="transparent" r={radius} stroke="currentColor" strokeWidth="6"></circle>
              <circle className="text-status-success transition-all duration-700" cx="32" cy="32" fill="transparent" r={radius} stroke="currentColor" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeWidth="6"></circle>
            </svg>
            <span className="absolute text-[11px] font-mono font-bold text-on-surface">{brandProgress}%</span>
          </div>
          <div className="text-left">
            <p className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider mb-0.5">Onboarding Progress</p>
            <p className="text-xs font-bold text-on-surface group-hover:text-wm-royal transition-colors">30-day roadmap complete</p>
          </div>
        </div>
      </section>

      {/* Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column (Tasks and Shoutouts) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active Tasks list matching Dashboard design */}
          <div className="bg-white border border-[#E1E4E8] rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-base font-display font-bold text-wm-navy">Active Tasks</h4>
              <button 
                onClick={() => onNavigateToTab('project-board')}
                className="text-wm-royal text-xs font-bold hover:underline"
              >
                View Project Board
              </button>
            </div>

            <div className="space-y-3 text-left">
              {activeTasks.length > 0 ? (
                activeTasks.map((task) => {
                  const isInProgress = task.status === 'progress';
                  const isBlocked = task.dueDate.includes('Blocked') || task.title.includes('Excel');
                  
                  return (
                    <div 
                      key={task.id}
                      onClick={() => handleToggleTaskStatus(task.id)}
                      className="flex items-center gap-4 p-4 border border-[#E1E4E8] rounded-lg hover:border-wm-royal transition-all cursor-pointer group hover:bg-[#FAFBFD]"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        isInProgress ? 'bg-[#d4e3ff] text-status-progress' : 'bg-[#fff0f2] text-status-blocked'
                      }`}>
                        {isInProgress ? <AlarmClock className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold text-on-surface truncate group-hover:text-wm-royal transition-all ${
                          task.status === 'done' ? 'line-through opacity-50' : ''
                        }`}>
                          {task.title}
                        </p>
                        <p className="text-[10px] font-mono text-on-surface-variant mt-0.5 uppercase tracking-wider">
                          {task.dueDate}
                        </p>
                      </div>

                      <span className={`px-2.5 py-1 text-[10px] font-mono rounded-full uppercase shrink-0 font-bold ${
                        isInProgress 
                          ? 'bg-blue-50 text-wm-royal border border-blue-100'
                          : isBlocked 
                          ? 'bg-red-50 text-status-blocked border border-red-100' 
                          : 'bg-[#F1F4F6] text-on-surface-variant'
                      }`}>
                        {isInProgress ? 'In Progress' : 'To Do'}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-on-surface-variant italic py-2">No active tasks. Create a task or claim empty opportunity cards!</p>
              )}
            </div>
          </div>

          {/* Recent ShoutOuts Gradient Box */}
          <div className="bg-white border border-[#E1E4E8] rounded-xl overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-shoutout-gold to-[#FFD700] p-6 text-wm-navy flex justify-between items-center">
              <div className="text-left">
                <h4 className="text-lg font-display font-bold leading-none mb-1">Recent ShoutOuts</h4>
                <p className="text-xs opacity-90 font-sans">Celebrating our intern community excellence</p>
              </div>
              <button 
                onClick={() => setShowShoutoutForm(!showShoutoutForm)}
                className="bg-wm-navy text-white hover:bg-wm-navy/90 text-xs px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all shadow-md shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Give ShoutOut</span>
              </button>
            </div>

            {/* Shoutout Form */}
            {showShoutoutForm && (
              <form onSubmit={submitNewShoutout} className="p-6 bg-amber-50/50 border-b border-[#E1E4E8] text-left animate-fade-in space-y-4">
                <h5 className="text-xs font-bold text-wm-navy uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#F2A900]" />
                  <span>Recognize a fellow intern</span>
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-on-surface-variant uppercase">Nominee Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g., Jordan Smith"
                      value={shoutoutNominee}
                      onChange={(e) => setShoutoutNominee(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded focus:ring-1 focus:ring-wm-royal outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-on-surface-variant uppercase">Your Words of Praise</label>
                    <textarea 
                      required
                      placeholder="Recognize their late night support, code debugging, or presentation help..."
                      value={shoutoutText}
                      onChange={(e) => setShoutoutText(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded focus:ring-1 focus:ring-wm-royal outline-none"
                      rows={2}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button 
                    type="button" 
                    onClick={() => setShowShoutoutForm(false)}
                    className="px-3.5 py-1.5 text-xs font-bold text-on-surface-variant hover:text-on-surface"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-1.5 text-xs font-bold bg-wm-royal text-white rounded hover:opacity-95"
                  >
                    Post Shoutout
                  </button>
                </div>
              </form>
            )}

            {/* Shoutouts Feed List */}
            <div className="p-6 space-y-6 text-left">
              {shoutouts.map((shout) => (
                <div key={shout.id} className="flex gap-4 items-start group">
                  <img 
                    src={shout.nomineeAvatar} 
                    alt={shout.nominee} 
                    className="w-12 h-12 rounded-full border-2 border-shoutout-gold shrink-0 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 bg-white border border-[#E1E4E8] p-4 rounded-xl relative hover:shadow-sm transition-all">
                    {/* Arrow call-out triangle */}
                    <div className="absolute -left-2 top-4 w-4 h-4 bg-white border-l border-b border-[#E1E4E8] rotate-45"></div>
                    
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs font-bold text-wm-navy">
                        {shout.nominee} 
                        <span className="font-normal text-on-surface-variant ml-2">• {shout.timeAgo}</span>
                      </p>
                      <button 
                        onClick={() => handleStarShoutout(shout.id)} 
                        className="transition-transform active:scale-125 p-0.5"
                      >
                        <Star className={`w-4 h-4 ${shout.starred ? 'fill-shoutout-gold text-shoutout-gold' : 'text-gray-300'}`} />
                      </button>
                    </div>
                    <p className="text-xs italic text-on-surface-variant line-clamp-3 font-sans">
                      {shout.text}
                    </p>
                    <p className="mt-2 text-[9px] font-mono text-wm-royal uppercase font-bold">
                      - Recognized by {shout.recognizedBy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column (Quick Links, Upcoming Meetings) */}
        <div className="lg:col-span-4 space-y-6 text-left">
          
          {/* Quick Links Card */}
          <div className="bg-white border border-[#E1E4E8] rounded-xl p-6 shadow-sm">
            <h4 className="text-base font-display font-bold text-wm-navy mb-5">Quick Links</h4>
            <div className="grid grid-cols-1 gap-3">
              {quickLinks.map((link) => (
                <div
                  key={link.id}
                  onClick={() => triggerFeedback(`Loading ${link.title} sandbox space...`)}
                  className="flex items-center justify-between p-4 bg-[#FAFBCF]/10 hover:bg-[#d4e3ff] border border-[#E1E4E8]/20 rounded-lg hover:border-wm-royal transition-all cursor-pointer group bg-surface-container-low"
                >
                  <div className="flex items-center gap-3">
                    {renderQuickLinkIcon(link.iconName)}
                    <span className="text-xs font-bold text-on-surface leading-none truncate">{link.title}</span>
                  </div>
                  <span className="text-xs font-bold text-wm-royal group-hover:translate-x-1 transition-transform">→</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Meetings Outlook Card */}
          <div className="bg-white border border-[#E1E4E8] rounded-xl overflow-hidden shadow-sm flex flex-col">
            
            {/* Outlook Top Blue Header bar */}
            <div className="bg-[#0078d4] text-white px-4 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-white" />
                <span className="text-sm font-sans font-bold tracking-tight">Outlook Calendar</span>
              </div>
              <div className="flex bg-[#005a9e] rounded p-0.5 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setViewMode('calendar')}
                  className={`px-2 py-1 rounded transition-all ${
                    viewMode === 'calendar' ? 'bg-white text-[#0078d4]' : 'text-white hover:bg-white/10'
                  }`}
                >
                  Month
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('agenda')}
                  className={`px-2 py-1 rounded transition-all ${
                    viewMode === 'agenda' ? 'bg-white text-[#0078d4]' : 'text-white hover:bg-white/10'
                  }`}
                >
                  Agenda
                </button>
              </div>
            </div>

            {viewMode === 'calendar' ? (
              <div className="p-4 space-y-4">
                {/* Month Picker Header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800 font-sans">
                    {MONTHS_FULL_NAMES[calMonth]} {calYear}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (calMonth === 0) {
                          setCalMonth(11);
                          setCalYear(prev => prev - 1);
                        } else {
                          setCalMonth(prev => prev - 1);
                        }
                      }}
                      className="p-1 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                      title="Previous Month"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCalMonth(9);
                        setCalYear(2026);
                        setSelectedDay(24);
                      }}
                      className="text-[10px] font-semibold text-[#0078d4] hover:underline px-1.5"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (calMonth === 11) {
                          setCalMonth(0);
                          setCalYear(prev => prev + 1);
                        } else {
                          setCalMonth(prev => prev + 1);
                        }
                      }}
                      className="p-1 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                      title="Next Month"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Calendar Days grid */}
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-400 font-sans uppercase">
                  <div>S</div>
                  <div>M</div>
                  <div>T</div>
                  <div>W</div>
                  <div>T</div>
                  <div>F</div>
                  <div>S</div>
                </div>

                {/* Grid Cells */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {(() => {
                    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
                    const firstDayIndex = new Date(calYear, calMonth, 1).getDay();
                    
                    const prevMonthIndex = calMonth === 0 ? 11 : calMonth - 1;
                    const prevMonthYear = calMonth === 0 ? calYear - 1 : calYear;
                    const daysInPrevMonth = new Date(prevMonthYear, prevMonthIndex + 1, 0).getDate();
                    
                    const cells = [];
                    
                    // Fills with leading days from last month
                    for (let i = firstDayIndex - 1; i >= 0; i--) {
                      cells.push({
                        day: daysInPrevMonth - i,
                        monthIndex: prevMonthIndex,
                        year: prevMonthYear,
                        isCurrentMonth: false,
                      });
                    }
                    
                    // Current month days
                    for (let i = 1; i <= daysInMonth; i++) {
                      cells.push({
                        day: i,
                        monthIndex: calMonth,
                        year: calYear,
                        isCurrentMonth: true,
                      });
                    }
                    
                    // Remaining blank cells filled from next month
                    const totalCells = cells.length > 35 ? 42 : 35;
                    let nextMonthDay = 1;
                    const nextMonthIndex = calMonth === 11 ? 0 : calMonth + 1;
                    const nextMonthYear = calMonth === 11 ? calYear + 1 : calYear;
                    while (cells.length < totalCells) {
                      cells.push({
                        day: nextMonthDay++,
                        monthIndex: nextMonthIndex,
                        year: nextMonthYear,
                        isCurrentMonth: false,
                      });
                    }

                    return cells.map((cell, idx) => {
                      const isSelected = selectedDay === cell.day && calMonth === cell.monthIndex;
                      
                      // Find if any meeting matches this cell date
                      const hasMeetings = meetings.some(m => {
                        const mMonth = MONTHS_MAP[m.dateMonth.toUpperCase()];
                        const mDay = parseInt(m.dateDay, 10);
                        return mMonth === cell.monthIndex && mDay === cell.day;
                      });

                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            setSelectedDay(cell.day);
                            if (cell.monthIndex !== calMonth) {
                              setCalMonth(cell.monthIndex);
                              setCalYear(cell.year);
                            }
                          }}
                          className={`aspect-square flex flex-col items-center justify-center rounded-lg text-xs font-semibold relative cursor-pointer transition-all hover:bg-gray-150 ${
                            !cell.isCurrentMonth
                              ? 'text-gray-300'
                              : isSelected
                              ? 'bg-[#0078d4] text-white font-extrabold shadow-sm'
                              : hasMeetings
                              ? 'bg-[#deecf9] text-[#0078d4] border border-[#a8d3f7]'
                              : 'text-gray-755 hover:bg-gray-100'
                          }`}
                        >
                          <span>{cell.day}</span>
                          {hasMeetings && !isSelected && (
                            <span className="absolute bottom-1 w-1.5 h-1.5 bg-[#0078d4] rounded-full"></span>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>

                {/* Selected Day Agenda Panel */}
                <div className="border-t border-[#E1E4E8] pt-4.5 space-y-3">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
                    <span>Events: {MONTHS_FULL_NAMES[calMonth]} {selectedDay}</span>
                    <span className="text-[#0078d4] font-semibold text-[9px] lowercase hover:underline cursor-pointer" onClick={() => setViewMode('agenda')}>
                      Show all
                    </span>
                  </p>

                  {(() => {
                    const dayEvents = meetings.filter(m => {
                      const mMonth = MONTHS_MAP[m.dateMonth.toUpperCase()];
                      const mDay = parseInt(m.dateDay, 10);
                      return mMonth === calMonth && mDay === selectedDay;
                    });

                    if (dayEvents.length > 0) {
                      return (
                        <div className="space-y-2.5 max-h-[170px] overflow-y-auto pr-1">
                          {dayEvents.map(m => (
                            <div key={m.id} className="border-l-4 border-[#0078d4] bg-blue-50/40 p-2.5 rounded-r-lg space-y-1 text-left">
                              <p className="text-xs font-extrabold text-[#0078d4] leading-tight truncate">{m.title}</p>
                              <div className="flex items-center gap-2 text-[10px] text-on-surface-variant">
                                <span className="flex items-center gap-0.5 font-mono">
                                  <Clock className="w-3 h-3 text-gray-400" />
                                  {m.time}
                                </span>
                                <span className="flex items-center gap-0.5 font-mono truncate">
                                  <MapPin className="w-3 h-3 text-gray-400" />
                                  {m.location}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => triggerFeedback(`Redirecting to live meeting room "${m.title}"...`)}
                                className="mt-1.5 text-[9px] font-bold text-[#0078d4] hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <span>Join Outlook Meeting</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      );
                    } else {
                      return (
                        <div className="text-center py-5 bg-neutral-50 rounded-lg border border-[#E1E4E8]/40">
                          <p className="text-xs text-on-surface-variant font-medium">No events scheduled today.</p>
                          {meetings.length > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                const nextEvent = meetings[0];
                                const mMonth = MONTHS_MAP[nextEvent.dateMonth.toUpperCase()];
                                const mDay = parseInt(nextEvent.dateDay, 10);
                                setCalMonth(mMonth);
                                setSelectedDay(mDay);
                              }}
                              className="text-[10px] text-[#0078d4] hover:underline font-bold mt-1.5 cursor-pointer"
                            >
                              Jump to Next: {meetings[0].title}
                            </button>
                          )}
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>
            ) : (
              /* Sleek Vertical Microsoft Outlook Agenda View List */
              <div className="p-4 space-y-4">
                <span className="text-[10px] font-mono text-on-surface-variant uppercase font-bold tracking-wider">Sync Agenda List ({meetings.length} items)</span>
                <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
                  {meetings.length > 0 ? (
                    meetings.map((m) => (
                      <div 
                        key={m.id} 
                        className="flex gap-3 hover:bg-[#FAFBCF]/10 p-2.5 rounded-lg border border-[#E1E4E8]/35 hover:border-[#0078d4] transition-all cursor-pointer"
                        onClick={() => {
                          const mMonth = MONTHS_MAP[m.dateMonth.toUpperCase()];
                          const mDay = parseInt(m.dateDay, 10);
                          setCalMonth(mMonth);
                          setSelectedDay(mDay);
                          setViewMode('calendar');
                        }}
                      >
                        <div className="flex flex-col items-center justify-center w-11 h-11 bg-[#deecf9] text-[#0078d4] rounded-lg shrink-0 select-none">
                          <span className="text-[8px] font-mono font-bold uppercase">{m.dateMonth}</span>
                          <span className="text-sm font-semibold leading-none mt-0.5">{m.dateDay}</span>
                        </div>
                        <div className="min-w-0 text-left flex-1 space-y-0.5">
                          <p className="text-xs font-bold text-[#0078d4] truncate hover:underline">{m.title}</p>
                          <p className="text-[10px] font-mono text-on-surface-variant leading-none">{m.time} • {m.location}</p>
                          <span className="text-[8px] font-sans font-semibold text-emerald-600 block mt-1">✓ Synced to outlook</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-on-surface-variant italic py-4">No active Outlook meetings synced.</p>
                  )}
                </div>
              </div>
            )}

            {/* Bottom Admin Exchange actions and trigger buttons */}
            <div className="border-t border-[#E1E4E8] p-3.5 bg-slate-50 flex flex-col gap-2">
              <button 
                onClick={onOpenMeetingsModal}
                className="w-full text-center bg-[#0078d4] hover:bg-[#106ebe] text-white font-bold py-2 rounded-lg text-xs transition-colors cursor-pointer shadow-sm"
              >
                Sync Exchange Contacts & Event Schedules
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Floating Action Button (Lower Right) */}
      <button 
        onClick={onOpenNewTaskModal}
        className="fixed bottom-8 right-8 w-14 h-14 bg-wm-royal text-white rounded-full shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center group z-40 cursor-pointer" 
        title="Add New Task"
      >
        <PlusSquare className="w-7 h-7 text-white" />
        <span className="absolute right-16 bg-wm-navy text-white px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
          New Task
        </span>
      </button>
    </div>
  );
}
