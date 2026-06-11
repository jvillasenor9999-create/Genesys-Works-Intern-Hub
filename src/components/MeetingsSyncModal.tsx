import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  RotateCw, 
  Check, 
  Trash2, 
  Plus, 
  Info,
  ExternalLink,
  Sparkles,
  Search
} from 'lucide-react';
import { Meeting, UserRole, UserPermissions } from '../types';

interface MeetingsSyncModalProps {
  meetings: Meeting[];
  setMeetings: React.Dispatch<React.SetStateAction<Meeting[]>>;
  onClose: () => void;
  triggerToast: (msg: string) => void;
  userRole?: UserRole;
  permissions?: UserPermissions;
}

export default function MeetingsSyncModal({
  meetings,
  setMeetings,
  onClose,
  triggerToast,
  userRole = 'intern',
  permissions = {
    allowInternsToDeleteTasks: true,
    allowInternsToCreateFAQ: true,
    allowInternsToSyncMeetings: true,
    allowInternsToSelfApproveMilestones: true
  }
}: MeetingsSyncModalProps) {
  // Sync Simulation States
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle');
  const [syncMessage, setSyncMessage] = useState<string>('');
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(null);

  // Search Filter
  const [meetingSearch, setMeetingSearch] = useState('');

  // Add Custom Event State
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [month, setMonth] = useState('OCT');
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('Zoom');

  // Sync timeline simulator
  const handleSyncWithOutlook = () => {
    if (syncStatus === 'syncing') return;

    if (userRole === 'intern' && !permissions.allowInternsToSyncMeetings) {
      alert("Access Blocked: Active Directory Calendar synchronization is locked for Intern roles. Switch to Administrator simulated role, or adjust Active directory permissions under Settings.");
      return;
    }

    setSyncStatus('syncing');
    setSyncMessage('Connecting to West Monroe ActiveDirectory Exchange servers...');

    // Stage 1: Auth
    setTimeout(() => {
      setSyncMessage('Verifying Single Sign-On secure handshake certificates...');
    }, 1000);

    // Stage 2: Sync comparison
    setTimeout(() => {
      setSyncMessage(`Compiling rosters for ${meetings.length} scheduled event blocks...`);
    }, 2200);

    // Stage 3: Writing DB
    setTimeout(() => {
      setSyncMessage('Publishing client token keys to Exchange server databases...');
    }, 3400);

    // Stage 4: Finished!
    setTimeout(() => {
      const now = new Date();
      const formatTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setSyncStatus('synced');
      setLastSyncedTime(formatTime);
      setSyncMessage(`Synced successfully with Microsoft Outlook client!`);
      triggerToast('All calendar items successfully synchronized with Microsoft Outlook.');
    }, 4500);
  };

  // Add Meeting Block
  const handleAddMeetingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !day.trim() || !time.trim()) {
      triggerToast('Please complete all scheduling fields.');
      return;
    }

    const newMeeting: Meeting = {
      id: `meeting-${Date.now()}`,
      title,
      dateMonth: month.toUpperCase(),
      dateDay: day,
      time,
      location
    };

    setMeetings(prev => [...prev, newMeeting]);
    setTitle('');
    setDay('');
    setTime('');
    setLocation('Zoom');
    setShowAddForm(false);
    triggerToast(`Added "${newMeeting.title}" to internship schedule roster.`);

    // If already synced, auto reset to idle so they know they should sync again to pick up changes
    if (syncStatus === 'synced') {
      setSyncStatus('idle');
    }
  };

  // Delete Meeting Block
  const handleDeleteMeeting = (meetingId: string, meetingTitle: string) => {
    setMeetings(prev => prev.filter(m => m.id !== meetingId));
    triggerToast(`Cancelled and deleted meeting: "${meetingTitle}"`);
    if (syncStatus === 'synced') {
      setSyncStatus('idle');
    }
  };

  const filteredMeetings = meetings.filter(m => 
    m.title.toLowerCase().includes(meetingSearch.toLowerCase()) ||
    m.location.toLowerCase().includes(meetingSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xl max-w-2xl w-full overflow-hidden text-left animate-zoom-in select-none flex flex-col max-h-[85vh]">
        
        {/* Modal Banner Header */}
        <div className="bg-wm-navy p-5 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-shoutout-gold" />
            <div>
              <h4 className="text-sm font-display font-medium leading-none">Intern Calendar & Exchange Sync</h4>
              <p className="text-[10px] text-gray-300 font-sans mt-1">Manage and sync workshop rosters with Outlook Exchange servers</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:opacity-80 p-0.5 outline-none cursor-pointer">
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Security / System compliance alert */}
          <div className="bg-blue-50/50 rounded-xl border border-blue-200/50 p-4 flex gap-3 text-left">
            <Info className="w-5 h-5 text-wm-royal shrink-0 mt-0.5" />
            <div className="text-xs text-on-surface-variant leading-relaxed">
              <span className="font-bold text-wm-navy block mb-0.5">SSO-Fed Exchange Sync Active</span>
              Your intern calendar coordinates with your West Monroe Outlook client. Sync matches training workshops, team buddy syncs, and coordinator mentoring sessions.
            </div>
          </div>

          {/* Outlook Sync Controller Section */}
          <div className="bg-neutral-50/60 p-4 py-4.5 border border-gray-200 rounded-xl">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="text-left">
                <span className="text-[10px] font-mono text-on-surface-variant uppercase font-bold tracking-wider">Sync Mechanism</span>
                <p className="text-xs font-bold text-wm-navy mt-0.5">
                  {syncStatus === 'idle' && 'Not synced for active session'}
                  {syncStatus === 'syncing' && 'Establishing secure data sync...'}
                  {syncStatus === 'synced' && 'Outlook Calendar Synchronized'}
                </p>
                {syncMessage && (
                  <p className="text-[11px] text-on-surface-variant font-mono mt-1 flex items-center gap-1.5 animate-pulse">
                    {syncStatus === 'syncing' && <RotateCw className="w-3 h-3 text-wm-royal animate-spin" />}
                    <span>{syncMessage}</span>
                  </p>
                )}
                {lastSyncedTime && syncStatus === 'synced' && (
                  <p className="text-[10px] text-status-success font-medium mt-1">
                    ✓ Exchange registers matches local indices. Last updated at {lastSyncedTime}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleSyncWithOutlook}
                disabled={syncStatus === 'syncing'}
                className={`px-5 py-2.5 rounded-lg font-bold text-xs shrink-0 flex items-center gap-2 cursor-pointer transition-all ${
                  syncStatus === 'syncing' 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : syncStatus === 'synced'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100/55'
                    : 'bg-wm-royal text-white hover:opacity-95 shadow-sm'
                }`}
              >
                {syncStatus === 'syncing' ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Syncing...</span>
                  </>
                ) : syncStatus === 'synced' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Sync Again</span>
                  </>
                ) : (
                  <>
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Sync Outlook Client</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Search Table & Add Trigger Header */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center pt-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search meeting title or location..."
                value={meetingSearch}
                onChange={(e) => setMeetingSearch(e.target.value)}
                className="w-full text-xs pl-9 pr-4 py-2 bg-[#F1F4F6] border-none rounded-lg focus:bg-white focus:ring-1 focus:ring-wm-royal outline-none"
              />
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-wm-navy hover:bg-wm-navy/95 text-white py-2 px-4 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule Event</span>
            </button>
          </div>

          {/* Accordion Form for scheduling new calendar instances */}
          {showAddForm && (
            <form onSubmit={handleAddMeetingSubmit} className="p-5 border border-dashed border-gray-300 bg-amber-50/10 rounded-xl space-y-4 animate-fade-in text-left">
              <h5 className="text-xs font-bold text-wm-navy capitalize flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#F2A900] fill-[#F2A900]" />
                <span>Schedule New Internship Meeting Slot</span>
              </h5>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono font-bold uppercase text-on-surface-variant">Meeting Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Q4 Intern Consulting Review"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-xs p-2.5 bg-neutral-100 border-none rounded focus:bg-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-bold uppercase text-on-surface-variant">Month</label>
                    <select
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      className="w-full text-xs p-2.5 bg-neutral-100 border-none rounded cursor-pointer outline-none"
                    >
                      <option>JAN</option>
                      <option>FEB</option>
                      <option>MAR</option>
                      <option>APR</option>
                      <option>MAY</option>
                      <option>JUN</option>
                      <option>JUL</option>
                      <option>AUG</option>
                      <option>SEP</option>
                      <option>OCT</option>
                      <option>NOV</option>
                      <option>DEC</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-bold uppercase text-on-surface-variant">Day Number</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={31}
                      placeholder="e.g. 25"
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                      className="w-full text-xs p-2.5 bg-neutral-100 border-none rounded focus:bg-white outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-bold uppercase text-on-surface-variant">Start Time</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 02:00 PM"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full text-xs p-2.5 bg-neutral-100 border-none rounded focus:bg-white outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-bold uppercase text-on-surface-variant">Room or Location</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Room 311 or Zoom"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full text-xs p-2.5 bg-neutral-100 border-none rounded focus:bg-white outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-1.5">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3.5 py-1.5 text-xs text-on-surface-variant hover:text-on-surface font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-wm-royal text-white py-1.5 px-4 rounded font-bold text-xs"
                >
                  Confirm Reservation
                </button>
              </div>
            </form>
          )}

          {/* List of Meetings */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono text-on-surface-variant uppercase font-bold tracking-wider">Scheduled Events ({filteredMeetings.length})</span>
            
            {filteredMeetings.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 max-h-[280px] overflow-y-auto pr-1">
                {filteredMeetings.map((m) => (
                  <div 
                    key={m.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-wm-royal transition-all gap-4 text-left"
                  >
                    <div className="flex items-center gap-4">
                      {/* Calendar Date Block */}
                      <div className="flex flex-col items-center justify-center w-12 h-12 bg-wm-navy text-white rounded-lg select-none shrink-0">
                        <span className="text-[9px] font-mono font-bold uppercase">{m.dateMonth}</span>
                        <span className="text-sm font-semibold leading-none mt-0.5">{m.dateDay}</span>
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-wm-navy truncate">{m.title}</h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-on-surface-variant mt-1">
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-gray-400" />
                            {m.time}
                          </span>
                          <span className="flex items-center gap-1 font-mono">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            {m.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => triggerToast(`Tunneling secured web-view. Joining online room for "${m.title}"...`)}
                        className="px-3 py-1.5 bg-[#FAFBCF]/10 hover:bg-[#d4e3ff] text-wm-navy border border-gray-200 rounded text-[10px] font-bold flex items-center gap-1.5 cursor-pointer hover:border-wm-royal transition-all"
                      >
                        <span>Join Room</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteMeeting(m.id, m.title)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                        title="Cancel Meeting"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-gray-200 rounded-xl bg-neutral-50/50">
                <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-on-surface-variant font-medium">No scheduled events align with your search criteria.</p>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer actions */}
        <div className="bg-neutral-50 border-t border-gray-150 p-4.5 px-6 flex justify-between items-center shrink-0">
          <p className="text-[10px] text-on-surface-variant leading-none font-medium">
            Active session synchronized: <b className="font-semibold text-wm-navy">{syncStatus === 'synced' ? 'Matches Outlook Server' : 'Local copy only'}</b>
          </p>
          <button 
            type="button" 
            onClick={onClose}
            className="bg-wm-royal text-white hover:opacity-95 px-5 py-2 rounded-lg font-bold text-xs shadow-sm cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
