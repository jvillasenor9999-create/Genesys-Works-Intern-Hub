import React, { useState } from 'react';
import { 
  ArrowLeft,
  ArrowRight,
  CheckCircle2, 
  Circle, 
  Lock, 
  Calendar, 
  BookOpen, 
  Star,
  Sparkles,
  Award,
  ShieldCheck,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { RoadmapTask, UserRole, UserPermissions, OnboardingCultureValuesContent, OnboardingContentSlot } from '../../types';

interface OnboardingViewProps {
  roadmap: RoadmapTask[];
  setRoadmap: React.Dispatch<React.SetStateAction<RoadmapTask[]>>;
  cultureValuesContent: OnboardingCultureValuesContent;
  setCultureValuesContent: React.Dispatch<React.SetStateAction<OnboardingCultureValuesContent>>;
  brandProgress: number; // overall progress e.g. 42
  setBrandProgress: (val: number) => void;
  userRole?: UserRole;
  permissions?: UserPermissions;
  triggerToast: (msg: string) => void;
}

type OnboardingSubView = 'roadmap' | 'culture-values';
type CultureValuesSection = 'expectations' | 'values';
type CultureValuesTextField = 'eyebrow' | 'title' | 'description' | 'footerNote';
type CultureValuesSlotField = 'title' | 'description';

export default function OnboardingView({
  roadmap,
  setRoadmap,
  cultureValuesContent,
  setCultureValuesContent,
  brandProgress,
  setBrandProgress,
  userRole = 'intern',
  permissions = {
    allowInternsToDeleteTasks: true,
    allowInternsToCreateFAQ: true,
    allowInternsToSyncMeetings: true,
    allowInternsToSelfApproveMilestones: true
  },
  triggerToast
}: OnboardingViewProps) {
  const [activeOnboardingSubView, setActiveOnboardingSubView] = useState<OnboardingSubView>('roadmap');
  const [isEditingCultureValues, setIsEditingCultureValues] = useState(false);
  const [draftCultureValuesContent, setDraftCultureValuesContent] = useState<OnboardingCultureValuesContent>(cultureValuesContent);
  const [cultureValuesFormError, setCultureValuesFormError] = useState<string | null>(null);
  const isAdmin = userRole === 'admin';
  const displayedCultureValuesContent = isEditingCultureValues ? draftCultureValuesContent : cultureValuesContent;
  
  // Calculate completed task counts dynamically
  const completedRoadmapsCount = roadmap.filter(r => r.status === 'completed').length;

  React.useEffect(() => {
    if (!isEditingCultureValues) {
      setDraftCultureValuesContent(cultureValuesContent);
    }
  }, [cultureValuesContent, isEditingCultureValues]);

  React.useEffect(() => {
    if (!isAdmin && isEditingCultureValues) {
      setIsEditingCultureValues(false);
      setDraftCultureValuesContent(cultureValuesContent);
      setCultureValuesFormError(null);
    }
  }, [cultureValuesContent, isAdmin, isEditingCultureValues]);

  const handleStartEditCultureValues = () => {
    setDraftCultureValuesContent(cultureValuesContent);
    setCultureValuesFormError(null);
    setIsEditingCultureValues(true);
  };

  const handleCancelEditCultureValues = () => {
    setDraftCultureValuesContent(cultureValuesContent);
    setCultureValuesFormError(null);
    setIsEditingCultureValues(false);
  };

  const handleUpdateDraftCultureField = (field: CultureValuesTextField, value: string) => {
    setDraftCultureValuesContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateDraftSlot = (
    section: CultureValuesSection,
    slotId: string,
    field: CultureValuesSlotField,
    value: string
  ) => {
    setDraftCultureValuesContent(prev => ({
      ...prev,
      [section]: prev[section].map(item => (
        item.id === slotId ? { ...item, [field]: value } : item
      ))
    }));
  };

  const handleAddDraftSlot = (section: CultureValuesSection) => {
    const isExpectation = section === 'expectations';
    const newSlot: OnboardingContentSlot = {
      id: `${section}-${Date.now()}`,
      title: isExpectation ? 'New Intern Expectation' : 'New West Monroe Value',
      description: 'Approved wording pending.'
    };

    setDraftCultureValuesContent(prev => ({
      ...prev,
      [section]: [...prev[section], newSlot]
    }));
    setCultureValuesFormError(null);
  };

  const handleRemoveDraftSlot = (section: CultureValuesSection, slotId: string) => {
    if (draftCultureValuesContent[section].length <= 1) {
      setCultureValuesFormError('Each section needs at least one card.');
      return;
    }

    setDraftCultureValuesContent(prev => ({
      ...prev,
      [section]: prev[section].filter(item => item.id !== slotId)
    }));
    setCultureValuesFormError(null);
  };

  const handleMoveDraftSlot = (section: CultureValuesSection, slotId: string, direction: 'up' | 'down') => {
    setDraftCultureValuesContent(prev => {
      const nextItems = [...prev[section]];
      const currentIndex = nextItems.findIndex(item => item.id === slotId);
      const nextIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

      if (currentIndex < 0 || nextIndex < 0 || nextIndex >= nextItems.length) {
        return prev;
      }

      const [movedItem] = nextItems.splice(currentIndex, 1);
      if (!movedItem) return prev;

      nextItems.splice(nextIndex, 0, movedItem);

      return {
        ...prev,
        [section]: nextItems
      };
    });
    setCultureValuesFormError(null);
  };

  const validateCultureValuesDraft = () => {
    if (!draftCultureValuesContent.title.trim()) {
      return 'Page title is required before saving.';
    }

    const hasBlankExpectation = draftCultureValuesContent.expectations.some(item => (
      !item.title.trim() || !item.description.trim()
    ));
    if (hasBlankExpectation) {
      return 'All intern expectation titles and descriptions are required.';
    }

    const hasBlankValue = draftCultureValuesContent.values.some(item => (
      !item.title.trim() || !item.description.trim()
    ));
    if (hasBlankValue) {
      return 'All West Monroe value titles and descriptions are required.';
    }

    return null;
  };

  const trimContentSlot = (item: OnboardingContentSlot): OnboardingContentSlot => ({
    ...item,
    title: item.title.trim(),
    description: item.description.trim()
  });

  const handleSaveCultureValuesContent = () => {
    const validationError = validateCultureValuesDraft();
    if (validationError) {
      setCultureValuesFormError(validationError);
      return;
    }

    const sanitizedContent: OnboardingCultureValuesContent = {
      eyebrow: draftCultureValuesContent.eyebrow.trim(),
      title: draftCultureValuesContent.title.trim(),
      description: draftCultureValuesContent.description.trim(),
      expectations: draftCultureValuesContent.expectations.map(trimContentSlot),
      values: draftCultureValuesContent.values.map(trimContentSlot),
      footerNote: draftCultureValuesContent.footerNote.trim()
    };

    setCultureValuesContent(sanitizedContent);
    setDraftCultureValuesContent(sanitizedContent);
    setCultureValuesFormError(null);
    setIsEditingCultureValues(false);
    triggerToast('Culture & Values page updated.');
  };
  
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

  const handleOpenCultureValues = () => {
    setActiveOnboardingSubView('culture-values');
  };

  const handleBackToRoadmap = () => {
    setActiveOnboardingSubView('roadmap');
  };

  if (activeOnboardingSubView === 'culture-values') {
    return (
      <div className="space-y-6 select-none text-left">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleBackToRoadmap}
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#E1E4E8] bg-white px-4 py-2 text-xs font-bold text-on-surface-variant shadow-sm transition-all hover:border-wm-royal hover:text-wm-royal focus:outline-none focus:ring-2 focus:ring-wm-royal focus:ring-offset-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Roadmap
          </button>

          {isAdmin && (
            <div className="flex flex-wrap gap-2 sm:justify-end">
              {isEditingCultureValues ? (
                <>
                  <button
                    type="button"
                    onClick={handleCancelEditCultureValues}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#D1D5DB] bg-white px-4 py-2 text-xs font-bold text-on-surface-variant transition-all hover:border-wm-royal hover:text-wm-royal focus:outline-none focus:ring-2 focus:ring-wm-royal focus:ring-offset-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCultureValuesContent}
                    className="inline-flex items-center gap-2 rounded-lg bg-wm-royal px-4 py-2 text-xs font-bold text-white transition-all hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-wm-royal focus:ring-offset-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Page
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleStartEditCultureValues}
                  className="inline-flex items-center gap-2 rounded-lg bg-wm-navy px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-wm-royal focus:ring-offset-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Page
                </button>
              )}
            </div>
          )}
        </div>

        {isEditingCultureValues && (
          <section className="rounded-xl border border-[#E1E4E8] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-wm-royal">
                <Edit3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant">Admin Editor</p>
                <h3 className="text-sm font-display font-extrabold text-wm-navy">Culture &amp; Values Page Content</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant">Page Eyebrow</label>
                <input
                  type="text"
                  value={draftCultureValuesContent.eyebrow}
                  onChange={(e) => handleUpdateDraftCultureField('eyebrow', e.target.value)}
                  className="w-full rounded-lg border border-[#D1D5DB] bg-[#FAFBFD] px-3 py-2 text-xs font-medium text-on-surface outline-none transition-all focus:border-wm-royal focus:bg-white focus:ring-2 focus:ring-wm-royal/15"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant">Page Title</label>
                <input
                  type="text"
                  value={draftCultureValuesContent.title}
                  onChange={(e) => handleUpdateDraftCultureField('title', e.target.value)}
                  className="w-full rounded-lg border border-[#D1D5DB] bg-[#FAFBFD] px-3 py-2 text-xs font-medium text-on-surface outline-none transition-all focus:border-wm-royal focus:bg-white focus:ring-2 focus:ring-wm-royal/15"
                />
              </div>

              <div className="space-y-1 lg:col-span-2">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant">Page Description</label>
                <textarea
                  rows={3}
                  value={draftCultureValuesContent.description}
                  onChange={(e) => handleUpdateDraftCultureField('description', e.target.value)}
                  className="w-full resize-none rounded-lg border border-[#D1D5DB] bg-[#FAFBFD] px-3 py-2 text-xs font-medium leading-relaxed text-on-surface outline-none transition-all focus:border-wm-royal focus:bg-white focus:ring-2 focus:ring-wm-royal/15"
                />
              </div>

              <div className="space-y-1 lg:col-span-2">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant">Footer Note</label>
                <textarea
                  rows={2}
                  value={draftCultureValuesContent.footerNote}
                  onChange={(e) => handleUpdateDraftCultureField('footerNote', e.target.value)}
                  className="w-full resize-none rounded-lg border border-[#D1D5DB] bg-[#FAFBFD] px-3 py-2 text-xs font-medium leading-relaxed text-on-surface outline-none transition-all focus:border-wm-royal focus:bg-white focus:ring-2 focus:ring-wm-royal/15"
                />
              </div>
            </div>

            {cultureValuesFormError && (
              <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-bold text-status-blocked">
                {cultureValuesFormError}
              </p>
            )}
          </section>
        )}

        <section className="bg-wm-navy text-white rounded-xl border border-wm-navy shadow-sm overflow-hidden">
          <div className="p-8 md:p-10 grid grid-cols-1 lg:grid-cols-[1fr_18rem] gap-8 items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-white/85">
                <ShieldCheck className="w-3.5 h-3.5 text-shoutout-gold" />
                {displayedCultureValuesContent.eyebrow}
              </span>
              <h2 className="mt-5 text-2xl md:text-3xl font-display font-extrabold leading-tight">
                {displayedCultureValuesContent.title}
              </h2>
              <p className="mt-3 text-sm text-white/75 leading-relaxed max-w-2xl">
                {displayedCultureValuesContent.description}
              </p>
            </div>

            <div className="rounded-xl border border-white/15 bg-white/10 p-5">
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-shoutout-gold">
                {isEditingCultureValues ? 'Draft preview' : 'Read-only guidance'}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-white/75">
                {isEditingCultureValues
                  ? 'Changes are previewed here before they are saved for interns.'
                  : 'Review this guidance alongside your onboarding roadmap. Reading this page does not affect onboarding progress.'}
              </p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <section className="bg-white rounded-xl border border-[#E1E4E8] shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-wm-royal border border-blue-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant">Section 01</p>
                <h3 className="text-base font-display font-extrabold text-wm-navy">Intern Expectations</h3>
              </div>
            </div>

            <div className="space-y-3">
              {displayedCultureValuesContent.expectations.map((item, index) => (
                isEditingCultureValues ? (
                  <article key={item.id} className="rounded-xl border border-[#E1E4E8] bg-[#FAFBFD] p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#E1E4E8] bg-white font-mono text-[10px] font-bold text-wm-royal">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveDraftSlot('expectations', item.id, 'up')}
                          disabled={index === 0}
                          aria-label="Move intern expectation up"
                          className={`flex h-8 w-8 items-center justify-center rounded-lg border border-[#D1D5DB] bg-white text-on-surface-variant transition-all hover:border-wm-royal hover:text-wm-royal focus:outline-none focus:ring-2 focus:ring-wm-royal focus:ring-offset-2 ${index === 0 ? 'cursor-not-allowed opacity-40' : ''}`}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveDraftSlot('expectations', item.id, 'down')}
                          disabled={index === displayedCultureValuesContent.expectations.length - 1}
                          aria-label="Move intern expectation down"
                          className={`flex h-8 w-8 items-center justify-center rounded-lg border border-[#D1D5DB] bg-white text-on-surface-variant transition-all hover:border-wm-royal hover:text-wm-royal focus:outline-none focus:ring-2 focus:ring-wm-royal focus:ring-offset-2 ${index === displayedCultureValuesContent.expectations.length - 1 ? 'cursor-not-allowed opacity-40' : ''}`}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveDraftSlot('expectations', item.id)}
                          disabled={displayedCultureValuesContent.expectations.length <= 1}
                          aria-label="Remove intern expectation"
                          className={`flex h-8 w-8 items-center justify-center rounded-lg border border-[#D1D5DB] bg-white text-status-blocked transition-all hover:border-status-blocked focus:outline-none focus:ring-2 focus:ring-status-blocked/40 focus:ring-offset-2 ${displayedCultureValuesContent.expectations.length <= 1 ? 'cursor-not-allowed opacity-40' : ''}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant">Card Title</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdateDraftSlot('expectations', item.id, 'title', e.target.value)}
                          className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-xs font-medium text-on-surface outline-none transition-all focus:border-wm-royal focus:ring-2 focus:ring-wm-royal/15"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant">Card Description</label>
                        <textarea
                          rows={3}
                          value={item.description}
                          onChange={(e) => handleUpdateDraftSlot('expectations', item.id, 'description', e.target.value)}
                          className="w-full resize-none rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-xs font-medium leading-relaxed text-on-surface outline-none transition-all focus:border-wm-royal focus:ring-2 focus:ring-wm-royal/15"
                        />
                      </div>
                    </div>
                  </article>
                ) : (
                  <article key={item.id} className="rounded-xl border border-[#E1E4E8] bg-[#FAFBFD] p-4 flex gap-4">
                    <span className="w-8 h-8 rounded-full bg-white border border-[#E1E4E8] text-wm-royal font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-on-surface">{item.title}</h4>
                      <p className="mt-1 text-[11px] leading-relaxed text-on-surface-variant">{item.description}</p>
                    </div>
                  </article>
                )
              ))}
              {isEditingCultureValues && (
                <button
                  type="button"
                  onClick={() => handleAddDraftSlot('expectations')}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-wm-royal/40 bg-blue-50/40 px-4 py-3 text-xs font-bold text-wm-royal transition-all hover:border-wm-royal hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-wm-royal focus:ring-offset-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Intern Expectation
                </button>
              )}
            </div>
          </section>

          <section className="bg-white rounded-xl border border-[#E1E4E8] shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-[#FAFBCF]/60 text-[#bf8500] border border-[#F2A900]/25 flex items-center justify-center">
                <Star className="w-5 h-5 fill-shoutout-gold text-shoutout-gold" />
              </div>
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant">Section 02</p>
                <h3 className="text-base font-display font-extrabold text-wm-navy">West Monroe Values</h3>
              </div>
            </div>

            <div className="space-y-3">
              {displayedCultureValuesContent.values.map((item, index) => (
                isEditingCultureValues ? (
                  <article key={item.id} className="rounded-xl border border-[#E1E4E8] bg-[#FAFBFD] p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#E1E4E8] bg-white font-mono text-[10px] font-bold text-[#bf8500]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveDraftSlot('values', item.id, 'up')}
                          disabled={index === 0}
                          aria-label="Move West Monroe value up"
                          className={`flex h-8 w-8 items-center justify-center rounded-lg border border-[#D1D5DB] bg-white text-on-surface-variant transition-all hover:border-wm-royal hover:text-wm-royal focus:outline-none focus:ring-2 focus:ring-wm-royal focus:ring-offset-2 ${index === 0 ? 'cursor-not-allowed opacity-40' : ''}`}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveDraftSlot('values', item.id, 'down')}
                          disabled={index === displayedCultureValuesContent.values.length - 1}
                          aria-label="Move West Monroe value down"
                          className={`flex h-8 w-8 items-center justify-center rounded-lg border border-[#D1D5DB] bg-white text-on-surface-variant transition-all hover:border-wm-royal hover:text-wm-royal focus:outline-none focus:ring-2 focus:ring-wm-royal focus:ring-offset-2 ${index === displayedCultureValuesContent.values.length - 1 ? 'cursor-not-allowed opacity-40' : ''}`}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveDraftSlot('values', item.id)}
                          disabled={displayedCultureValuesContent.values.length <= 1}
                          aria-label="Remove West Monroe value"
                          className={`flex h-8 w-8 items-center justify-center rounded-lg border border-[#D1D5DB] bg-white text-status-blocked transition-all hover:border-status-blocked focus:outline-none focus:ring-2 focus:ring-status-blocked/40 focus:ring-offset-2 ${displayedCultureValuesContent.values.length <= 1 ? 'cursor-not-allowed opacity-40' : ''}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant">Card Title</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdateDraftSlot('values', item.id, 'title', e.target.value)}
                          className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-xs font-medium text-on-surface outline-none transition-all focus:border-wm-royal focus:ring-2 focus:ring-wm-royal/15"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant">Card Description</label>
                        <textarea
                          rows={3}
                          value={item.description}
                          onChange={(e) => handleUpdateDraftSlot('values', item.id, 'description', e.target.value)}
                          className="w-full resize-none rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-xs font-medium leading-relaxed text-on-surface outline-none transition-all focus:border-wm-royal focus:ring-2 focus:ring-wm-royal/15"
                        />
                      </div>
                    </div>
                  </article>
                ) : (
                  <article key={item.id} className="rounded-xl border border-[#E1E4E8] bg-[#FAFBFD] p-4 flex gap-4">
                    <span className="w-8 h-8 rounded-full bg-white border border-[#E1E4E8] text-[#bf8500] font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-on-surface">{item.title}</h4>
                      <p className="mt-1 text-[11px] leading-relaxed text-on-surface-variant">{item.description}</p>
                    </div>
                  </article>
                )
              ))}
              {isEditingCultureValues && (
                <button
                  type="button"
                  onClick={() => handleAddDraftSlot('values')}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#F2A900]/60 bg-[#FAFBCF]/30 px-4 py-3 text-xs font-bold text-[#8a6200] transition-all hover:border-[#F2A900] hover:bg-[#FAFBCF]/60 focus:outline-none focus:ring-2 focus:ring-[#F2A900]/70 focus:ring-offset-2"
                >
                  <Plus className="h-4 w-4" />
                  Add West Monroe Value
                </button>
              )}
            </div>
          </section>
        </div>

        <div className="bg-[#FAFBCF]/30 border border-[#F2A900]/25 rounded-xl p-5 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-shoutout-gold fill-shoutout-gold shrink-0 mt-0.5" />
          <p className="text-[11px] text-on-surface-variant leading-relaxed font-medium">
            {displayedCultureValuesContent.footerNote}
          </p>
        </div>
      </div>
    );
  }

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
            <button
              type="button"
              onClick={handleOpenCultureValues}
              className="w-full rounded-xl overflow-hidden border border-[#E1E4E8] aspect-[4/3] relative group shadow-sm select-none text-left transition-all hover:border-wm-royal hover:shadow-md focus:outline-none focus:ring-2 focus:ring-wm-royal focus:ring-offset-2"
              aria-label="Open Culture and Values onboarding page"
            >
              <img 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpwiVuqP_7dU0L_sDMhL-oWoC6wrVvbdckTtla3BKs6NCjhiraRvhQqFztVBi8sigSg-6Rn0EKvoYMz9q-3tA106aSGESQiqsmx3EOS_NCnY9LQosNMw6E6DXo9I9IQqP0Pc1Jj_w88lHp76HAOMCNwdxyEvzu-AA8HkX8CbypZrzj9iJfpu6BVeRGc2F8vy8NHGkb9muAP4bEz6JUGsfaXmdREFAqVC81w47ZUOChfnI41C6xQk-maI8cl2s5JO6ur1diNieqktA" 
                alt="West Monroe Culture banner"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-wm-navy/90 to-transparent flex flex-col justify-end p-5">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-white font-display text-xs font-bold">Culture &amp; Values</h4>
                  <span className="w-8 h-8 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-white transition-all group-hover:bg-white group-hover:text-wm-navy">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
                <p className="text-white/80 text-[10px] leading-relaxed font-sans mt-1">
                  Learn about the West Monroe mindset, organizational policies, and our long-term commitment to client delivery.
                </p>
              </div>
            </button>
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
