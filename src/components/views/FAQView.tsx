import React, { useState } from 'react';
import { 
  Plus, 
  Minus, 
  Mail, 
  Search, 
  HelpCircle, 
  Sparkles, 
  ChevronRight, 
  ArrowRight,
  Send,
  MessageSquare,
  ShieldAlert,
  Edit3,
  Save,
  X,
  CheckCircle2
} from 'lucide-react';
import { FaqItem, UserRole, UserPermissions } from '../../types';

interface FAQViewProps {
  faqItems: FaqItem[];
  setFaqItems: React.Dispatch<React.SetStateAction<FaqItem[]>>;
  searchQuery: string;
  userRole?: UserRole;
  permissions?: UserPermissions;
}

type FaqCategory = FaqItem['category'];

const FAQ_CATEGORIES: { id: FaqCategory; label: string }[] = [
  { id: 'scheduling', label: 'Work & Scheduling Rules' },
  { id: 'technical', label: 'Technical & System Support' },
  { id: 'professional', label: 'Professional Etiquette' }
];

export default function FAQView({
  faqItems,
  setFaqItems,
  searchQuery,
  userRole = 'intern',
  permissions = {
    allowInternsToDeleteTasks: true,
    allowInternsToCreateFAQ: true,
    allowInternsToSyncMeetings: true,
    allowInternsToSelfApproveMilestones: true
  }
}: FAQViewProps) {
  
  // States for toggling individual accordion rows
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');

  // Support inquiry submission state
  const [supportSubmitted, setSupportSubmitted] = useState(false);
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [supportCategory, setSupportCategory] = useState('General Onboarding');
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');

  // Diagnostic tool simulator states
  const [diagnosticState, setDiagnosticState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [diagnosticStage, setDiagnosticStage] = useState<string>('SSO Authenticator');
  const [diagnosticProgress, setDiagnosticProgress] = useState<number>(0);
  const [cacheToast, setCacheToast] = useState(false);

  // Category navigation state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [editCategory, setEditCategory] = useState<FaqCategory>('scheduling');
  const [answeringTicketId, setAnsweringTicketId] = useState<string | null>(null);
  const [ticketAnswer, setTicketAnswer] = useState('');
  const [adminFormError, setAdminFormError] = useState<string | null>(null);
  const [faqManagementMessage, setFaqManagementMessage] = useState<string | null>(null);

  const isAdmin = userRole === 'admin';
  const publishedFaqItems = faqItems.filter((item) => item.status !== 'pending');
  const pendingFaqItems = faqItems.filter((item) => item.status === 'pending');

  // Filter FAQs with searchQuery and selectedCategory
  const query = searchQuery.toLowerCase().trim();
  const filteredFaqs = publishedFaqItems.filter((f) => {
    const matchesSearch = !query || f.question.toLowerCase().includes(query) || f.answer.toLowerCase().includes(query);
    const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleToggleFaq = (id: string) => {
    setExpandedFaqId(prev => (prev === id ? null : id));
  };

  const handleShowFaqManagementMessage = (message: string) => {
    setFaqManagementMessage(message);
    setTimeout(() => setFaqManagementMessage(null), 3500);
  };

  const handleStartEditFaq = (faq: FaqItem) => {
    if (!isAdmin) return;
    setAnsweringTicketId(null);
    setTicketAnswer('');
    setEditingFaqId(faq.id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
    setEditCategory(faq.category);
    setAdminFormError(null);
  };

  const handleCancelEditFaq = () => {
    setEditingFaqId(null);
    setEditQuestion('');
    setEditAnswer('');
    setEditCategory('scheduling');
    setAdminFormError(null);
  };

  const handleSaveFaqEdit = (faqId: string) => {
    const trimmedQuestion = editQuestion.trim();
    const trimmedAnswer = editAnswer.trim();

    if (!trimmedQuestion || !trimmedAnswer) {
      setAdminFormError('Question and answer are required before saving.');
      return;
    }

    setFaqItems(prev => prev.map(item => (
      item.id === faqId
        ? {
            ...item,
            category: editCategory,
            question: trimmedQuestion,
            answer: trimmedAnswer,
            status: 'published'
          }
        : item
    )));
    setExpandedFaqId(faqId);
    handleCancelEditFaq();
    handleShowFaqManagementMessage('FAQ updated successfully.');
  };

  const handleStartAnswerTicket = (ticket: FaqItem) => {
    if (!isAdmin) return;
    setEditingFaqId(null);
    setAnsweringTicketId(ticket.id);
    setTicketAnswer(ticket.answer);
    setAdminFormError(null);
  };

  const handleCancelAnswerTicket = () => {
    setAnsweringTicketId(null);
    setTicketAnswer('');
    setAdminFormError(null);
  };

  const handlePublishTicketAnswer = (ticketId: string) => {
    const trimmedAnswer = ticketAnswer.trim();

    if (!trimmedAnswer) {
      setAdminFormError('Answer text is required before publishing.');
      return;
    }

    setFaqItems(prev => prev.map(item => (
      item.id === ticketId
        ? {
            ...item,
            answer: trimmedAnswer,
            status: 'published',
            answeredAt: new Date().toISOString()
          }
        : item
    )));
    setExpandedFaqId(ticketId);
    handleCancelAnswerTicket();
    handleShowFaqManagementMessage('Inquiry answered and published to the FAQ.');
  };

  const handleNewSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedSupportSubject = supportSubject.trim();
    const trimmedSupportMessage = supportMessage.trim();
    if (!trimmedSupportSubject || !trimmedSupportMessage) return;

    if (userRole === 'intern' && !permissions.allowInternsToCreateFAQ) {
      alert("Access Blocked: Intern FAQ creation is disabled by security configuration. Modify this under the Access & Permissions tab in Settings.");
      return;
    }

    setSubmittingInquiry(true);

    // Simulate database persist and response delay
    setTimeout(() => {
      setSubmittingInquiry(false);
      setSupportSubmitted(true);
      setSupportSubject('');
      setSupportMessage('');

      let resolvedCategory: 'scheduling' | 'technical' | 'professional' = 'scheduling';
      if (supportCategory === 'Technical Access & SSO') {
        resolvedCategory = 'technical';
      } else if (supportCategory === 'Mentor & Buddy Scheduling') {
        resolvedCategory = 'professional';
      }

      // Add questions dynamically to knowledge base as custom FAQs!
      const userFaq: FaqItem = {
        id: `faq-user-${Date.now()}`,
        category: resolvedCategory,
        question: trimmedSupportSubject,
        answer: '',
        status: 'pending',
        submittedDetails: trimmedSupportMessage
      };
      setFaqItems(prev => [...prev, userFaq]);

      setTimeout(() => setSupportSubmitted(false), 5000);
    }, 1200);
  };

  const handleRunDiagnostics = () => {
    setDiagnosticState('running');
    setDiagnosticProgress(15);
    setDiagnosticStage('SSO handshake authenticity');

    setTimeout(() => {
      setDiagnosticProgress(48);
      setDiagnosticStage('SSL Certificates validation');
    }, 800);

    setTimeout(() => {
      setDiagnosticProgress(75);
      setDiagnosticStage('VPN Tunnel route mapping');
    }, 1600);

    setTimeout(() => {
      setDiagnosticProgress(100);
      setDiagnosticState('completed');
    }, 2400);
  };

  const handleFlushDnsCache = () => {
    setCacheToast(true);
    setTimeout(() => setCacheToast(false), 4000);
    setDiagnosticState('idle');
  };

  return (
    <div className="space-y-8 select-none text-left pb-12">
      
      {/* Toast Support submission notifications */}
      {supportSubmitted && (
        <div className="fixed bottom-6 right-6 bg-[#d4edda] text-[#155724] border border-[#c3e6cb] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-bounce text-xs font-bold font-sans">
          <Sparkles className="w-5 h-5 text-status-success fill-status-success" />
          <span>Ticket logged! General coordinators notified. Response expected within 4 business hours.</span>
        </div>
      )}

      {faqManagementMessage && (
        <div className="fixed bottom-6 right-6 bg-[#002B49] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-bounce text-xs font-bold font-sans">
          <CheckCircle2 className="w-5 h-5 text-status-success" />
          <span>{faqManagementMessage}</span>
        </div>
      )}

      {/* Toast Cache Flush notification */}
      {cacheToast && (
        <div className="fixed bottom-6 right-6 bg-[#002B49] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-bounce text-xs font-bold font-sans">
          <Sparkles className="w-5 h-5 text-[#F2A900] fill-[#F2A900]" />
          <span>Workstation SAML tokens, cookie registers, and DNS caches flushed successfully. Ingress routing stable.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Accordion of filtered frequently-asked-questions */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-wm-royal" />
              <h3 className="font-display font-extrabold text-[#001c3a] text-base">Knowledge Base FAQs</h3>
            </div>
            
            {/* Topic Filter Tabs */}
            <div className="flex flex-wrap gap-1 bg-[#F1F4F6] p-1 rounded-lg shrink-0">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-md text-[10px] font-bold tracking-tight transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-wm-royal text-white shadow-xs'
                    : 'text-on-surface-variant hover:bg-[#FAFBCF]/5 select-none'
                }`}
              >
                All Topics
              </button>
              {FAQ_CATEGORIES.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setSelectedCategory(group.id)}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-bold tracking-tight transition-all cursor-pointer ${
                    selectedCategory === group.id
                      ? 'bg-wm-royal text-white shadow-xs'
                      : 'text-on-surface-variant hover:bg-[#FAFBCF]/5 select-none'
                  }`}
                >
                  {group.label.split(' & ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isExpanded = expandedFaqId === faq.id;
                const isEditing = editingFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="bg-white border border-[#E1E4E8] rounded-xl overflow-hidden shadow-xs hover:border-wm-royal transition-all"
                  >
                    {isEditing ? (
                      <div className="p-5 space-y-4 bg-neutral-50/70 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="md:col-span-2 space-y-1">
                            <label className="text-[9px] font-mono font-bold uppercase text-on-surface-variant">Question</label>
                            <input
                              type="text"
                              value={editQuestion}
                              onChange={(e) => setEditQuestion(e.target.value)}
                              className="w-full text-xs p-2.5 bg-white border border-[#E1E4E8] rounded-lg outline-none focus:border-wm-royal"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono font-bold uppercase text-on-surface-variant">Category</label>
                            <select
                              value={editCategory}
                              onChange={(e) => setEditCategory(e.target.value as FaqCategory)}
                              className="w-full text-xs p-2.5 bg-white border border-[#E1E4E8] rounded-lg outline-none focus:border-wm-royal cursor-pointer"
                            >
                              {FAQ_CATEGORIES.map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-mono font-bold uppercase text-on-surface-variant">Answer</label>
                          <textarea
                            rows={4}
                            value={editAnswer}
                            onChange={(e) => setEditAnswer(e.target.value)}
                            className="w-full text-xs p-2.5 bg-white border border-[#E1E4E8] rounded-lg outline-none focus:border-wm-royal leading-relaxed"
                          />
                        </div>

                        {adminFormError && (
                          <p className="text-[10px] font-bold text-status-blocked">{adminFormError}</p>
                        )}

                        <div className="flex flex-wrap justify-end gap-2">
                          <button
                            type="button"
                            onClick={handleCancelEditFaq}
                            className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-on-surface-variant text-[10px] font-bold flex items-center gap-1.5 hover:bg-neutral-100"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveFaqEdit(faq.id)}
                            className="px-3 py-2 rounded-lg bg-wm-royal text-white text-[10px] font-bold flex items-center gap-1.5 hover:opacity-95"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save FAQ</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-full px-6 py-4.5 flex justify-between items-center gap-3 hover:bg-[#FAFBCF]/5 select-none">
                          <button
                            type="button"
                            onClick={() => handleToggleFaq(faq.id)}
                            className="flex-1 flex justify-between items-center text-left focus:outline-none"
                          >
                            <h4 className="text-xs font-bold text-wm-navy leading-normal pr-4">{faq.question}</h4>
                            <span className="p-1 rounded bg-neutral-100 text-on-surface-variant group-hover:bg-wm-royal/5 shrink-0">
                              {isExpanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            </span>
                          </button>

                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => handleStartEditFaq(faq)}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-wm-royal text-[10px] font-bold flex items-center gap-1.5 border border-blue-100 hover:bg-blue-100"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                          )}
                        </div>

                        {isExpanded && (
                          <div className="px-6 pb-5 pt-1.5 border-t border-[#F1F4F6] bg-neutral-50/50 animate-fade-in text-xs leading-relaxed text-on-surface-variant">
                            <p className="font-sans font-medium">{faq.answer}</p>
                            <div className="flex flex-wrap items-center gap-2 mt-3">
                              <span className="inline-block px-2 py-0.5 bg-blue-50 text-wm-royal font-mono text-[9px] font-bold rounded capitalize border border-blue-100">
                                {faq.category}
                              </span>
                              {faq.answeredAt && (
                                <span className="inline-block px-2 py-0.5 bg-emerald-50 text-status-success font-mono text-[9px] font-bold rounded border border-emerald-100">
                                  Answered
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="bg-white p-12 border border-dashed border-gray-300 rounded-xl text-center">
                <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="font-display font-bold text-sm text-wm-navy">No Questions Found</h4>
                <p className="text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed mt-1">
                  Try altering your search keywords to locate answers block about schedules, spreadsheets, hours sheets, or IT.
                </p>
              </div>
            )}
          </div>

          {/* Active Support Tickets Session Tracker */}
          {pendingFaqItems.length > 0 && (
            <div className="bg-white border border-[#E1E4E8] rounded-xl p-5 shadow-xs mt-6">
              <div className="flex items-center justify-between border-b border-gray-150 pb-3 mb-4 select-none">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                  <h4 className="font-display font-bold text-wm-navy text-xs uppercase tracking-wider">Active Coordinator Inquiries</h4>
                </div>
                <span className="text-[10px] font-mono text-on-surface-variant font-bold">{pendingFaqItems.length} Pending</span>
              </div>
              <div className="space-y-3.5">
                {pendingFaqItems.map((ticket) => {
                  const isAnsweringTicket = answeringTicketId === ticket.id;

                  return (
                  <div key={ticket.id} className="p-4 bg-amber-50/20 border border-amber-200/50 rounded-lg text-left relative animate-fade-in space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded uppercase">
                          {ticket.category}
                        </span>
                        <h5 className="text-xs font-bold text-wm-navy mt-1">
                          {ticket.question}
                        </h5>
                        <p className="text-[11px] text-on-surface-variant leading-relaxed">
                          {ticket.submittedDetails || 'No details provided.'}
                        </p>
                      </div>
                      <div className="shrink-0 flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1.5 text-right mt-2 sm:mt-0">
                        <span className="text-[9px] font-bold text-white bg-slate-500 px-2.5 py-1 rounded-full text-center tracking-wide uppercase leading-none">
                          In Queue
                        </span>
                        {isAdmin ? (
                          <button
                            type="button"
                            onClick={() => handleStartAnswerTicket(ticket)}
                            className="text-[9px] text-wm-royal font-sans font-bold leading-none hover:underline"
                          >
                            Answer
                          </button>
                        ) : (
                          <span className="text-[9px] text-[#bf8500] font-sans font-bold leading-none">Response &lt;4h</span>
                        )}
                      </div>
                    </div>

                    {isAnsweringTicket && (
                      <div className="pt-3 border-t border-amber-200/60 space-y-2">
                        <label className="text-[9px] font-mono font-bold uppercase text-amber-700">Admin Answer</label>
                        <textarea
                          rows={4}
                          value={ticketAnswer}
                          onChange={(e) => setTicketAnswer(e.target.value)}
                          placeholder="Write the answer that should be published to the FAQ knowledge base..."
                          className="w-full text-xs p-2.5 bg-white border border-amber-200 rounded-lg outline-none focus:border-wm-royal leading-relaxed"
                        />
                        {adminFormError && (
                          <p className="text-[10px] font-bold text-status-blocked">{adminFormError}</p>
                        )}
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={handleCancelAnswerTicket}
                            className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-on-surface-variant text-[10px] font-bold flex items-center gap-1.5 hover:bg-neutral-100"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePublishTicketAnswer(ticket.id)}
                            className="px-3 py-2 rounded-lg bg-wm-royal text-white text-[10px] font-bold flex items-center gap-1.5 hover:opacity-95"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Publish Answer</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Direct Help Support coordinator submission ticket logging */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#E1E4E8] rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-2">
              <MessageSquare className="w-5 h-5 text-shoutout-gold" />
              <h4 className="font-display font-bold text-wm-navy text-xs uppercase tracking-wider">Contact Program Coordinators</h4>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-relaxed mb-6">
              Still looking for guidance? Log a secure support ticket. We respond directly to your intern email.
            </p>

            <form onSubmit={handleNewSupportSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-on-surface-variant uppercase font-bold">Inquiry Segment</label>
                <select 
                  value={supportCategory}
                  onChange={(e) => setSupportCategory(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#F1F4F6] border-none rounded focus:bg-white focus:ring-1 focus:ring-wm-royal outline-none cursor-pointer"
                >
                  <option>General Onboarding</option>
                  <option>Technical Access & SSO</option>
                  <option>Hours Tracking & Billing</option>
                  <option>Mentor & Buddy Scheduling</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono text-on-surface-variant uppercase font-bold">Subject Summary</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Broken hardware VPN credentials"
                  value={supportSubject}
                  onChange={(e) => setSupportSubject(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#F1F4F6] border-none rounded focus:bg-white focus:ring-1 focus:ring-wm-royal outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono text-on-surface-variant uppercase font-bold">Inquiry Details</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Elaborate on details, including browser cached state or error codes..."
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#F1F4F6] border-none rounded focus:bg-white focus:ring-1 focus:ring-wm-royal outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingInquiry}
                className="w-full bg-wm-royal text-white py-3 rounded-lg font-bold text-xs hover:opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
              >
                {submittingInquiry ? (
                  <span>Logging ticket...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Secure Inquiry</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="bg-amber-50/50 p-5 rounded-xl border border-amber-200/55 flex gap-3 text-left">
            <ShieldAlert className="w-5 h-5 text-shoutout-gold shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[10px] text-[#bf8500] uppercase tracking-wider">MFA Protocol Alert</p>
              <p className="text-[10px] text-on-surface-variant mt-1.5 leading-relaxed">
                Adhering to security compliance values, never send plain-text password characters through the inquiry form. Contact IT support directly for SSO bypass requests.
              </p>
            </div>
          </div>

          {/* Workstation Credentials Diagnosis Simulator */}
          <div className="bg-white border border-[#E1E4E8] rounded-xl p-5 shadow-xs space-y-4 text-left">
            <div className="flex items-center gap-2 select-none">
              <Sparkles className="w-4 h-4 text-wm-royal animate-pulse" />
              <h4 className="font-display font-bold text-wm-navy text-xs uppercase tracking-wider">Workstation Diagnostics</h4>
            </div>
            
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Verify SSO authenticity handshakes, active directory nodes, and secure ingress gateways.
            </p>

            {diagnosticState === 'idle' && (
              <button
                type="button"
                onClick={handleRunDiagnostics}
                className="w-full bg-[#f1f4f6] text-wm-navy border border-gray-200 py-3 rounded-lg text-xs font-bold hover:bg-[#e4e7e9] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Run Diagnostic Scan</span>
              </button>
            )}

            {diagnosticState === 'running' && (
              <div className="space-y-3 p-3 bg-neutral-100/60 rounded-lg border border-gray-150">
                <div className="flex items-center gap-2 text-[11px] font-bold text-wm-navy">
                  <div className="w-3.5 h-3.5 border-2 border-wm-royal border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing: {diagnosticStage}...</span>
                </div>
                <div className="w-full bg-neutral-200 h-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-wm-royal h-full transition-all duration-300"
                    style={{ width: `${diagnosticProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {diagnosticState === 'completed' && (
              <div className="space-y-3">
                <div className="p-3.5 bg-emerald-50 rounded-lg border border-emerald-200 space-y-2 select-none">
                  <div className="flex justify-between items-center text-xs font-extrabold text-emerald-800 border-b border-emerald-150 pb-1.5 mb-2">
                    <span>✓ System Health Secure</span>
                    <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 bg-emerald-150 rounded text-emerald-900 leading-none">OK</span>
                  </div>
                  <div className="space-y-1.5 text-[10px] text-emerald-700 font-medium font-mono">
                    <p className="flex justify-between leading-none">
                      <span>SAML Token:</span>
                      <b className="font-bold">Active (12h key)</b>
                    </p>
                    <p className="flex justify-between leading-none">
                      <span>VPN Gateway:</span>
                      <b className="font-bold">Connected (38ms)</b>
                    </p>
                    <p className="flex justify-between leading-none">
                      <span>SSO Port Ingress:</span>
                      <b className="font-bold">Port 3000 Verified</b>
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleRunDiagnostics}
                    className="flex-1 border border-gray-200 py-2 rounded text-[10px] font-bold hover:bg-neutral-50 transition-all text-on-surface-variant cursor-pointer text-center"
                  >
                    Re-Verify Node
                  </button>
                  <button
                    type="button"
                    onClick={handleFlushDnsCache}
                    className="flex-1 bg-wm-royal hover:opacity-95 text-white py-2 rounded text-[10px] font-bold transition-all cursor-pointer text-center"
                  >
                    Flush Cache & DNS
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
