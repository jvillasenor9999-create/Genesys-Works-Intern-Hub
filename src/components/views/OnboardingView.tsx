import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Lock, 
  Calendar, 
  PlaySquare, 
  BookOpen, 
  HelpCircle, 
  Star,
  Sparkles,
  Award
} from 'lucide-react';
import { RoadmapTask, UserRole, UserPermissions } from '../../types';

interface OnboardingViewProps {
  roadmap: RoadmapTask[];
  setRoadmap: React.Dispatch<React.SetStateAction<RoadmapTask[]>>;
  brandProgress: number; // overall progress e.g. 42
  setBrandProgress: (val: number) => void;
  userRole?: UserRole;
  permissions?: UserPermissions;
}

export default function OnboardingView({
  roadmap,
  setRoadmap,
  brandProgress,
  setBrandProgress,
  userRole = 'intern',
  permissions = {
    allowInternsToDeleteTasks: true,
    allowInternsToCreateFAQ: true,
    allowInternsToSyncMeetings: true,
    allowInternsToSelfApproveMilestones: true
  }
}: OnboardingViewProps) {
  
  // Calculate completed task counts dynamically
  const completedRoadmapsCount = roadmap.filter(r => r.status === 'completed').length;
  
  const handleToggleSubtask = (roadmapId: string, subtaskIndex: number) => {
    if (userRole === 'intern' && !permissions.allowInternsToSelfApproveMilestones) {
      alert("Access Blocked: Intern milestone self-approval is disabled under your active program parameters. Re-enable this in the Access & Permissions tab in Settings.");
      return;
    }
    let allChecklistsDone = false;

    setRoadmap(prev => prev.map(r => {
      if (r.id === roadmapId && r.subtasks) {
        const nextSubtasks = r.subtasks.map((st, idx) => {
          if (idx === subtaskIndex) {
            return { ...st, checked: !st.checked };
          }
          return st;
        });

        // If all checked, we can mark task as completed!
        const totalChecked = nextSubtasks.filter(st => st.checked).length;
        const totalSubtasks = nextSubtasks.length;
        allChecklistsDone = totalChecked === totalSubtasks;

        // Recalculate progress incrementally
        const basePercent = 42; 
        const addPercent = Math.round((totalChecked / totalSubtasks) * 23); // Workstation is worth 23%
        setBrandProgress(basePercent + addPercent);

        return {
          ...r,
          subtasks: nextSubtasks,
          status: allChecklistsDone ? 'completed' : 'current'
        };
      }
      return r;
    }));
  };

  const handleStartSetupAction = () => {
    alert("Initiating secure Duo Multi-Factor Authentication (MFA) wizard on your summer intern workstation...");
  };

  return (
    <div className="space-y-8 select-none text-left">
      
      {/* Hero Header with overall progress metrics */}
      <div className="bg-white p-8 rounded-xl border border-[#E1E4E8] shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex-1">
          <h2 className="text-xl font-display font-bold text-wm-navy mb-2">Welcome to West Monroe</h2>
          <p className="text-xs font-sans text-on-surface-variant max-w-2xl leading-relaxed">
            This is your personalized onboarding roadmap. Complete each step to ensure a smooth transition into your internship role and get access to all the tools you need.
          </p>
        </div>

        <div className="w-full md:w-64 space-y-2 shrink-0">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-mono text-wm-royal uppercase font-bold tracking-wider">Overall Progress</span>
            <span className="text-base font-sans font-extrabold text-wm-navy">{brandProgress}%</span>
          </div>
          <div className="h-3 w-full bg-[#ebeef0] rounded-full overflow-hidden">
            <div 
              className="h-full bg-wm-royal rounded-full transition-all duration-700" 
              style={{ width: `${brandProgress}%` }}
            ></div>
          </div>
          <p className="text-[10px] font-mono text-on-surface-variant text-right">
            {completedRoadmapsCount} of {roadmap.length} milestones complete
          </p>
        </div>
      </div>

      {/* 3 Step Roadmap Columns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Pre-arrival Milestone Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-status-success flex items-center justify-center text-white shrink-0">
              <Calendar className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-sm font-display font-bold text-wm-navy leading-none">Pre-arrival</h3>
          </div>

          <div className="space-y-4">
            {roadmap.filter(item => item.category === 'pre-arrival').map((item) => {
              const isCompleted = item.status === 'completed';
              const isCurrent = item.status === 'current';

              return (
                <div 
                  key={item.id} 
                  className={`bg-white p-5 rounded-xl border relative transition-all ${
                    isCurrent ? 'border-2 border-wm-royal shadow-md' : 'border-[#E1E4E8] hover:border-wm-royal/50'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="shrink-0 mt-0.5">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-status-success" />
                      ) : (
                        <Circle className="w-5 h-5 text-wm-royal shrink-0 animate-pulse" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-on-surface truncate">{item.title}</h4>
                      <p className="text-[11px] text-on-surface-variant mt-1.5 leading-relaxed">{item.description}</p>
                      
                      {/* Active embedded Workstation checklist if applicable */}
                      {item.subtasks && (
                        <div className="mt-4 bg-[#f1f4f6] p-4 rounded-lg border border-[#c3c7ce]/30 space-y-3">
                          {item.subtasks.map((st, idx) => (
                            <label key={idx} className="flex items-center gap-3 cursor-pointer select-none">
                              <input 
                                type="checkbox"
                                checked={st.checked}
                                onChange={() => handleToggleSubtask(item.id, idx)}
                                className="rounded border-gray-300 text-wm-royal focus:ring-wm-royal w-4 h-4 cursor-pointer"
                              />
                              <span className={`text-[11px] font-medium leading-none ${st.checked ? 'line-through text-on-surface-variant/70' : 'text-on-surface'}`}>
                                {st.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}

                      {/* CTA action buttons for workstation wizard setup */}
                      {isCurrent && item.actionLabel && (
                        <div className="flex gap-2 mt-4">
                          <button 
                            onClick={handleStartSetupAction}
                            className="bg-wm-royal hover:opacity-95 text-white px-3.5 py-2 rounded-lg text-[10px] font-bold"
                          >
                            {item.actionLabel}
                          </button>
                          <button 
                            onClick={() => alert("Loading workstation enrollment guide PDF...")}
                            className="bg-transparent border border-gray-300 text-on-surface-variant hover:bg-[#FAFBFD] px-3.5 py-2 rounded-lg text-[10px] font-bold"
                          >
                            {item.actionGuide || 'View Guide'}
                          </button>
                        </div>
                      )}

                      {/* Stamp badging */}
                      {isCompleted && (
                        <span className="inline-block mt-3 px-2 py-0.5 bg-green-50 text-status-success font-mono text-[9px] font-bold border border-green-200/55 rounded">
                          COMPLETED
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Week 1 Milestone Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-wm-royal flex items-center justify-center text-white shrink-0">
              <Award className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-sm font-display font-bold text-wm-navy leading-none">Week 1</h3>
          </div>

          <div className="space-y-4">
            {roadmap.filter(item => item.category === 'week-1').map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-xl border border-[#E1E4E8] hover:border-wm-royal/50 transition-all">
                <div className="flex gap-4">
                  <div className="shrink-0 mt-0.5 text-on-surface-variant">
                    <Circle className="w-5 h-5 text-gray-300 shrink-0" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-on-surface truncate">{item.title}</h4>
                    <p className="text-[11px] text-on-surface-variant mt-1.5 leading-relaxed">{item.description}</p>
                    <span className="inline-block mt-3 px-2 py-0.5 bg-gray-100 text-on-surface-variant font-mono text-[9px] font-bold rounded">
                      UPCOMING
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Embedded Culture & Values Card inside Week 1 column */}
            <div className="rounded-xl overflow-hidden border border-[#E1E4E8] aspect-[4/3] relative group shadow-sm select-none">
              <img 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpwiVuqP_7dU0L_sDMhL-oWoC6wrVvbdckTtla3BKs6NCjhiraRvhQqFztVBi8sigSg-6Rn0EKvoYMz9q-3tA106aSGESQiqsmx3EOS_NCnY9LQosNMw6E6DXo9I9IQqP0Pc1Jj_w88lHp76HAOMCNwdxyEvzu-AA8HkX8CbypZrzj9iJfpu6BVeRGc2F8vy8NHGkb9muAP4bEz6JUGsfaXmdREFAqVC81w47ZUOChfnI41C6xQk-maI8cl2s5JO6ur1diNieqktA" 
                alt="West Monroe Culture banner"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-wm-navy/90 to-transparent flex flex-col justify-end p-5">
                <h4 className="text-white font-display text-xs font-bold">Culture &amp; Values</h4>
                <p className="text-white/80 text-[10px] leading-relaxed font-sans mt-1">
                  Learn about the West Monroe mindset, organizational policies, and our long-term commitment to client delivery.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 30-Day Milestone Column (Locked / Future) */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-on-surface-variant flex items-center justify-center text-white shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-display font-bold text-wm-navy leading-none">30-Day Roadmap</h3>
          </div>

          <div className="space-y-4">
            {roadmap.filter(item => item.category === '30-day').map((item) => (
              <div key={item.id} className="bg-[#FAFBFD]/75 p-5 rounded-xl border border-[#E1E4E8] relative opacity-60 grayscale cursor-not-allowed">
                <div className="flex gap-4">
                  <div className="shrink-0 mt-0.5 text-on-surface-variant">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-on-surface truncate">{item.title}</h4>
                    <p className="text-[11px] text-on-surface-variant mt-1.5 leading-relaxed">{item.description}</p>
                    <span className="inline-block mt-3 px-2 py-0.5 bg-gray-50 text-gray-400 font-mono text-[9px] font-bold rounded">
                      LOCKED
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Spotlight Banner */}
            <div className="bg-[#FAFBCF]/20 dark:bg-tertiary-container p-6 rounded-xl border border-on-tertiary-container/10 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-shoutout-gold mb-3">
                  <Sparkles className="w-4 h-4 fill-shoutout-gold" />
                  <h4 className="font-display font-bold text-xs text-[#bf8500]">Intern Spotlight</h4>
                </div>
                <p className="text-[11px] text-[#281900] leading-relaxed mb-4 font-medium">
                  Complete your 30-day onboarding milestones to get recognized in the West Monroe monthly newsletter!
                </p>
              </div>
              <div className="flex -space-x-2.5 items-center">
                <img 
                  alt="Spotlight Intern 1" 
                  className="w-8 h-8 rounded-full ring-2 ring-white object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPRlCe-tKxkazEbHOT2lX2cChA2DfHJMQBJx9v9MphRcT5IH92Spwrcd-faZbvTODI-IXJTXr9rE5E4427-qu0EoR2Udi7UqAatmTLUW7Keg9yb0aDTx8oUBG10CP2b4LXJjSbofemAyj7kqntSkscfDltLXcZU-uxht4LAEU_m8klhErZVcjryH867M0nzRHWZ6t0W16tcnn73qk4YHVhldCDwkciHDzYsiwQrC1OzB8HphCD8Wi2O53HXj7DotWlfV-VPGiIFLY"
                  referrerPolicy="no-referrer"
                />
                <img 
                  alt="Spotlight Intern 2" 
                  className="w-8 h-8 rounded-full ring-2 ring-white object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyD50lZWNSYbirKnXD1usIjj5a5SUUtikQo-ciuziH5xsRinlf4fNiutNFt2Zy_ra1i-nc3Gcc3mgRMS0AeQ2O1xOWdOfrVocE8upYkjqYSFJbteEUIOImXiQ1iyDpWCvAudzFQVwRFGbB7OsSDrMKEXW6MjcbbdWgZu2CEnxg6QL86ZG-i6kvmLGDECHMfT6_LUh3HqB2a58cFOnI1krXxjGLeA5ACKKe5-CrLelsIDPzt0ra4tRz5pCKzNtzVT6ab59iQMGmb34"
                  referrerPolicy="no-referrer"
                />
                <img 
                  alt="Spotlight Intern 3" 
                  className="w-8 h-8 rounded-full ring-2 ring-white object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTfnp7QbM676Riov9Ek0F10CXibvAVgfEmukhxhoTkrWqUAehR07yBZlap-dV5nxQEe1ex-k3Msx3opI8e8K1pkEMmbNGnX6O5JwwtJbNHsuzYhrRv9oefB5FvXsfX4uNJF_VNE9tkZ4GqRx8onqv145KXtlLxfK8YAUMV3KzL4ZHZCbgxrcjZCZ4BuEPC5kVdzHn0i25_i_kQcfJln9vP9SIpkw7Zg2KerS53Zgm7KvydOH2gJLUXv5RkKWAqsMnGiWfqWHz7lgc"
                  referrerPolicy="no-referrer"
                />
                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-wm-navy ring-2 ring-white">+12</div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
