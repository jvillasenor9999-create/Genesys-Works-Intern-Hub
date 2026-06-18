import React, { useState } from 'react';
import {
  Mail,
  MessageSquare,
  Linkedin,
  X,
  Send,
  Sparkles,
  Users,
  Filter,
  ArrowLeft,
  Check,
  Edit3,
  Save,
  ShieldCheck,
  UserPlus,
  ClipboardCheck
} from 'lucide-react';
import { Contact, MentorVolunteerRequest, UserRole } from '../../types';

type ContactRole = Contact['role'];
type ContactDepartment = Contact['department'];
type ContactStatus = Contact['status'];

interface ContactsViewProps {
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  mentorVolunteerRequests: MentorVolunteerRequest[];
  setMentorVolunteerRequests: React.Dispatch<React.SetStateAction<MentorVolunteerRequest[]>>;
  searchQuery: string;
  userRole: UserRole;
  triggerToast: (msg: string) => void;
}

const CONTACT_DEPARTMENTS: Array<'All' | ContactDepartment> = [
  'All',
  'Product Engineering',
  'Customer Experience',
  'Operations Excellence',
  'Data & Analytics'
];

const CONTACT_ROLES: Array<'All' | ContactRole> = ['All', 'Career Advisor', 'Mentor', 'Project Manager'];

const CONTACT_STATUSES: ContactStatus[] = ['Willing to help', 'In Meeting', 'Offline'];

const ROLE_OPTIONS = [
  'Intern Mentor',
  'Intern Career Advisor',
  'Capstone Lead',
  'Genesys Works Supervisory Team'
];

const getVolunteerAvatar = (name: string) => (
  `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`
);

const resolveRequestedContactRole = (interestedRoles: string[]): ContactRole => {
  if (interestedRoles.includes('Intern Career Advisor')) return 'Career Advisor';
  if (interestedRoles.includes('Genesys Works Supervisory Team') || interestedRoles.includes('Capstone Lead')) return 'Project Manager';
  return 'Mentor';
};

export default function ContactsView({
  contacts,
  setContacts,
  mentorVolunteerRequests,
  setMentorVolunteerRequests,
  searchQuery,
  userRole,
  triggerToast
}: ContactsViewProps) {
  const isAdmin = userRole === 'admin';

  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedRole, setSelectedRole] = useState<string>('All');

  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formLinkedinUrl, setFormLinkedinUrl] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [volunteerFormError, setVolunteerFormError] = useState<string | null>(null);

  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editLinkedinUrl, setEditLinkedinUrl] = useState('');
  const [editRole, setEditRole] = useState<ContactRole>('Mentor');
  const [editDepartment, setEditDepartment] = useState<ContactDepartment>('Product Engineering');
  const [editStatus, setEditStatus] = useState<ContactStatus>('Willing to help');
  const [adminFormError, setAdminFormError] = useState<string | null>(null);

  const [reviewingRequestId, setReviewingRequestId] = useState<string | null>(null);
  const [approvalName, setApprovalName] = useState('');
  const [approvalEmail, setApprovalEmail] = useState('');
  const [approvalLinkedinUrl, setApprovalLinkedinUrl] = useState('');
  const [approvalRole, setApprovalRole] = useState<ContactRole>('Mentor');
  const [approvalDepartment, setApprovalDepartment] = useState<ContactDepartment>('Operations Excellence');
  const [approvalStatus, setApprovalStatus] = useState<ContactStatus>('Willing to help');

  const [chatRecipient, setChatRecipient] = useState<Contact | null>(null);
  const [typedMessage, setTypedMessage] = useState('');
  const [conversationHistory, setConversationHistory] = useState<Record<string, { sender: 'me' | 'recipient'; text: string; time: string }[]>>({});

  const pendingRequests = mentorVolunteerRequests.filter((request) => request.status === 'pending');

  const filteredContacts = contacts.filter((contact) => {
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      const matchesSearch = (
        contact.name.toLowerCase().includes(query) ||
        contact.role.toLowerCase().includes(query) ||
        contact.department.toLowerCase().includes(query) ||
        contact.email.toLowerCase().includes(query)
      );
      if (!matchesSearch) return false;
    }

    if (selectedDept !== 'All' && contact.department !== selectedDept) return false;
    if (selectedRole !== 'All' && contact.role !== selectedRole) return false;

    return true;
  });

  const getStatusStyle = (status: ContactStatus) => {
    switch (status) {
      case 'Willing to help':
        return { dot: 'bg-status-success shadow-[0_0_8px_#28A745]', pill: 'bg-green-50 text-status-success border border-green-100' };
      case 'In Meeting':
        return { dot: 'bg-shoutout-gold shadow-[0_0_8px_#F2A900]', pill: 'bg-amber-50 text-shoutout-gold border border-amber-100' };
      default:
        return { dot: 'bg-gray-400', pill: 'bg-neutral-50 text-on-surface-variant border border-neutral-150' };
    }
  };

  const handleOpenChat = (contact: Contact) => {
    setChatRecipient(contact);
    if (!conversationHistory[contact.id]) {
      setConversationHistory(prev => ({
        ...prev,
        [contact.id]: [
          {
            sender: 'recipient',
            text: `Hi Alex! Great to connect. As your ${contact.role} with the West Monroe ${contact.department} team, I am here to help. Drop me some questions about ServiceNow guides, client cases, or work schedules!`,
            time: 'Just now'
          }
        ]
      }));
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !chatRecipient) return;

    const contactId = chatRecipient.id;
    const userMsg = { sender: 'me' as const, text: typedMessage, time: 'Just now' };

    setConversationHistory(prev => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), userMsg]
    }));

    const cachedMessage = typedMessage;
    setTypedMessage('');

    setTimeout(() => {
      let automatedResponse = "Awesome question Alex! Focus on finishing your Pre-arrival Hardware checklist first. Let's schedule a Zoom 1-on-1 to review it!";

      if (cachedMessage.toLowerCase().includes('excel') || cachedMessage.toLowerCase().includes('formula')) {
        automatedResponse = "Ah, Excel formulas! VLOOKUP and INDEX MATCH are vital. Review the 'Advanced Excel' guide inside the Learning Hub module - it covers our client guidelines perfectly.";
      } else if (cachedMessage.toLowerCase().includes('servicenow') || cachedMessage.toLowerCase().includes('sandbox')) {
        automatedResponse = "ServiceNow training is crucial. Don't worry if the flow designer feels complex at first! Make sure to review our ServiceNow Fundamentals guide.";
      } else if (cachedMessage.toLowerCase().includes('work') || cachedMessage.toLowerCase().includes('hours')) {
        automatedResponse = "Record those hours! Submit your timesheet in the Project Board tab by EOD every Friday. Submit them accurately under the internal codes.";
      }

      const receivedMsg = { sender: 'recipient' as const, text: automatedResponse, time: 'Just now' };
      setConversationHistory(prev => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), receivedMsg]
      }));
    }, 1200);
  };

  const handleToggleRoleSelection = (roleOpt: string) => {
    setSelectedRoles(prev => (
      prev.includes(roleOpt)
        ? prev.filter(role => role !== roleOpt)
        : [...prev, roleOpt]
    ));
  };

  const handleResetForm = () => {
    setFormName('');
    setFormEmail('');
    setFormLinkedinUrl('');
    setSelectedRoles([]);
    setIsFormSubmitted(false);
    setVolunteerFormError(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = formName.trim();
    const trimmedEmail = formEmail.trim();
    const trimmedLinkedinUrl = formLinkedinUrl.trim();

    if (!trimmedName || !trimmedEmail) {
      setVolunteerFormError('Name and email are required before submitting.');
      return;
    }

    const normalizedEmail = trimmedEmail.toLowerCase();
    const hasExistingContact = contacts.some(contact => contact.email.toLowerCase() === normalizedEmail);
    const hasPendingRequest = pendingRequests.some(request => request.email.toLowerCase() === normalizedEmail);

    if (hasExistingContact || hasPendingRequest) {
      setVolunteerFormError('That email is already listed in Contacts or waiting for admin review.');
      return;
    }

    const newRequest: MentorVolunteerRequest = {
      id: `volunteer-request-${Date.now()}`,
      name: trimmedName,
      email: trimmedEmail,
      linkedinUrl: trimmedLinkedinUrl || undefined,
      interestedRoles: selectedRoles,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    setMentorVolunteerRequests(prev => [newRequest, ...prev]);
    setIsFormSubmitted(true);
    setVolunteerFormError(null);
    triggerToast(`Volunteer request submitted for admin review: ${newRequest.name}`);
  };

  const handleStartEditContact = (contact: Contact) => {
    if (!isAdmin) return;
    setReviewingRequestId(null);
    setApprovalName('');
    setApprovalEmail('');
    setApprovalLinkedinUrl('');
    setEditingContactId(contact.id);
    setEditName(contact.name);
    setEditEmail(contact.email);
    setEditLinkedinUrl(contact.linkedinUrl ?? '');
    setEditRole(contact.role);
    setEditDepartment(contact.department);
    setEditStatus(contact.status);
    setAdminFormError(null);
  };

  const handleCancelEditContact = () => {
    setEditingContactId(null);
    setEditName('');
    setEditEmail('');
    setEditLinkedinUrl('');
    setEditRole('Mentor');
    setEditDepartment('Product Engineering');
    setEditStatus('Willing to help');
    setAdminFormError(null);
  };

  const handleSaveContactEdit = (contactId: string) => {
    const trimmedName = editName.trim();
    const trimmedEmail = editEmail.trim();
    const trimmedLinkedinUrl = editLinkedinUrl.trim();

    if (!trimmedName || !trimmedEmail) {
      setAdminFormError('Name and email are required before saving.');
      return;
    }

    const normalizedEmail = trimmedEmail.toLowerCase();
    const isDuplicateEmail = contacts.some(contact => (
      contact.id !== contactId && contact.email.toLowerCase() === normalizedEmail
    ));

    if (isDuplicateEmail) {
      setAdminFormError('Another contact already uses this email.');
      return;
    }

    setContacts(prev => prev.map(contact => (
      contact.id === contactId
        ? {
            ...contact,
            name: trimmedName,
            email: trimmedEmail,
            linkedinUrl: trimmedLinkedinUrl || undefined,
            role: editRole,
            department: editDepartment,
            status: editStatus
          }
        : contact
    )));

    triggerToast(`Contact updated: ${trimmedName}`);
    handleCancelEditContact();
  };

  const handleStartReviewRequest = (request: MentorVolunteerRequest) => {
    if (!isAdmin) return;
    setEditingContactId(null);
    setEditName('');
    setEditEmail('');
    setEditLinkedinUrl('');
    setReviewingRequestId(request.id);
    setApprovalName(request.name);
    setApprovalEmail(request.email);
    setApprovalLinkedinUrl(request.linkedinUrl ?? '');
    setApprovalRole(resolveRequestedContactRole(request.interestedRoles));
    setApprovalDepartment('Operations Excellence');
    setApprovalStatus('Willing to help');
    setAdminFormError(null);
  };

  const handleCancelReviewRequest = () => {
    setReviewingRequestId(null);
    setApprovalName('');
    setApprovalEmail('');
    setApprovalLinkedinUrl('');
    setApprovalRole('Mentor');
    setApprovalDepartment('Operations Excellence');
    setApprovalStatus('Willing to help');
    setAdminFormError(null);
  };

  const handleApproveRequest = (requestId: string) => {
    const trimmedName = approvalName.trim();
    const trimmedEmail = approvalEmail.trim();
    const trimmedLinkedinUrl = approvalLinkedinUrl.trim();

    if (!trimmedName || !trimmedEmail) {
      setAdminFormError('Name and email are required before approval.');
      return;
    }

    const normalizedEmail = trimmedEmail.toLowerCase();
    const isDuplicateEmail = contacts.some(contact => contact.email.toLowerCase() === normalizedEmail);

    if (isDuplicateEmail) {
      setAdminFormError('A contact with this email already exists.');
      return;
    }

    const newContact: Contact = {
      id: `contact-${Date.now()}`,
      name: trimmedName,
      email: trimmedEmail,
      linkedinUrl: trimmedLinkedinUrl || undefined,
      role: approvalRole,
      department: approvalDepartment,
      status: approvalStatus,
      avatar: getVolunteerAvatar(trimmedName)
    };

    setContacts(prev => [newContact, ...prev]);
    setMentorVolunteerRequests(prev => prev.map(request => (
      request.id === requestId ? { ...request, status: 'approved' } : request
    )));

    triggerToast(`Approved volunteer and added contact: ${newContact.name}`);
    handleCancelReviewRequest();
  };

  const handleDeclineRequest = (request: MentorVolunteerRequest) => {
    if (!isAdmin) return;

    setMentorVolunteerRequests(prev => prev.map(item => (
      item.id === request.id ? { ...item, status: 'declined' } : item
    )));
    if (reviewingRequestId === request.id) handleCancelReviewRequest();
    triggerToast(`Declined volunteer request for ${request.name}`);
  };

  if (showForm) {
    return (
      <div className="space-y-6 text-left select-none pb-12 transition-all">
        <button
          type="button"
          onClick={() => { setShowForm(false); handleResetForm(); }}
          className="flex items-center gap-2 text-xs font-semibold text-wm-navy hover:text-wm-royal transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Advisors Directory</span>
        </button>

        <div className="bg-gradient-to-tr from-[#edeef9] via-[#e4e8fa] to-[#f4f1ff] p-6 md:p-12 rounded-2xl border border-[#d2d6f0] shadow-sm flex flex-col items-center">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden relative border border-[#e1e4f3]/60 flex flex-col">
            <div className="h-2 bg-[#6c58be] w-full" />

            <div className="p-8 space-y-8">
              {!isFormSubmitted ? (
                <>
                  <div className="border-b border-[#E1E4E8] pb-5">
                    <h2 className="text-xl md:text-2xl font-bold text-[#323130] font-sans">
                      Genesys Works Intern Program Interest Form
                    </h2>
                    <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                      Submissions are reviewed by administrators before anyone is added to the public Contacts directory.
                    </p>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-7 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="text-[14px] font-bold text-[#323130] flex items-center gap-1.5 font-sans">
                          <span>1. First and Last Name</span>
                          <span className="text-red-600 font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Enter your answer"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          className="w-full text-xs p-3.5 bg-[#F3F4F6] text-gray-800 rounded-lg border border-transparent outline-none focus:bg-white focus:border-[#6c58be]/40 focus:ring-1 focus:ring-[#6c58be]/20 transition-all placeholder:text-[#a1a1a1]"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-[14px] font-bold text-[#323130] flex items-center gap-1.5 font-sans">
                          <span>2. Email</span>
                          <span className="text-red-600 font-bold">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="name@company.com"
                          value={formEmail}
                          onChange={(e) => setFormEmail(e.target.value)}
                          className="w-full text-xs p-3.5 bg-[#F3F4F6] text-gray-800 rounded-lg border border-transparent outline-none focus:bg-white focus:border-[#6c58be]/40 focus:ring-1 focus:ring-[#6c58be]/20 transition-all placeholder:text-[#a1a1a1]"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[14px] font-bold text-[#323130] flex items-center gap-1.5 font-sans">
                        <span>3. LinkedIn URL</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://www.linkedin.com/in/..."
                        value={formLinkedinUrl}
                        onChange={(e) => setFormLinkedinUrl(e.target.value)}
                        className="w-full text-xs p-3.5 bg-[#F3F4F6] text-gray-800 rounded-lg border border-transparent outline-none focus:bg-white focus:border-[#6c58be]/40 focus:ring-1 focus:ring-[#6c58be]/20 transition-all placeholder:text-[#a1a1a1]"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-[14px] font-bold text-[#323130] flex items-start gap-1 font-sans">
                        <span>4. Which are you interested in being?</span>
                      </label>

                      <div className="space-y-3 pl-1">
                        {ROLE_OPTIONS.map((option) => {
                          const isChecked = selectedRoles.includes(option);
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => handleToggleRoleSelection(option)}
                              className="flex items-center gap-3 group cursor-pointer select-none text-left"
                            >
                              <span className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
                                isChecked
                                  ? 'bg-[#6c58be] border-[#6c58be] text-white shadow-sm'
                                  : 'border-gray-350 bg-white group-hover:border-[#6c58be]'
                              }`}>
                                {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </span>
                              <span className="text-xs font-semibold text-gray-700 font-sans group-hover:text-black">
                                {option}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {volunteerFormError && (
                      <p className="text-[11px] font-bold text-status-blocked">{volunteerFormError}</p>
                    )}

                    <div className="pt-6 border-t border-[#E1E4E8] flex flex-col sm:flex-row items-center gap-3">
                      <button
                        type="submit"
                        disabled={!formName.trim() || !formEmail.trim()}
                        className="w-full sm:w-auto bg-[#6c58be] hover:bg-[#5b49a5] disabled:opacity-50 text-white font-extrabold text-xs px-6 py-3 rounded-lg shadow-md transition-all cursor-pointer"
                      >
                        Submit for Admin Review
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowForm(false); handleResetForm(); }}
                        className="w-full sm:w-auto bg-[#F1F4F6] hover:bg-[#E2E6E9] text-on-surface-variant font-bold text-xs px-6 py-3 rounded-lg transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="py-8 text-center space-y-6">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto border border-green-100 shadow-sm animate-zoom-in">
                    <ClipboardCheck className="w-8 h-8 text-[#28A745] stroke-[2.5]" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-800">Submitted for review</h3>
                    <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
                      Your volunteer interest was sent to administrators. The Contacts directory will update only after an admin approves and assigns the final role.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#F1F4F6] flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <button
                      type="button"
                      onClick={() => { setShowForm(false); handleResetForm(); }}
                      className="bg-wm-navy hover:bg-wm-navy/90 text-white font-bold text-xs px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-sm"
                    >
                      <Users className="w-4 h-4" />
                      <span>Return to Directory</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="text-wm-royal hover:underline text-xs font-semibold py-2 px-4 transition-all"
                    >
                      Submit another response
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

  return (
    <div className="space-y-6 text-left select-none pb-12">
      <div className="bg-gradient-to-r from-wm-navy via-[#003b6d] to-wm-royal rounded-xl p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
        <div className="space-y-1.5 text-left">
          <span className="text-[10px] font-mono tracking-widest text-[#FAFBCF] uppercase font-bold">Community Support Coalition</span>
          <h2 className="text-lg font-bold font-display text-white">Advisors &amp; Cohort Volunteers</h2>
          <p className="text-xs text-white/80 max-w-2xl leading-relaxed">
            Connect with seasoned professionals eager to assist with technical guides, workplace dynamics, and career advisories. Volunteer submissions now enter admin review before directory publication.
          </p>
        </div>
        <button
          id="become-mentor-btn"
          type="button"
          onClick={() => setShowForm(true)}
          className="bg-[#FAFBCF] text-wm-navy hover:bg-[#FAF9E0] font-extrabold text-xs py-2.5 px-4.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-sm select-none shrink-0 hover:scale-[1.02] active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-[#F2A900] fill-[#F2A900]" />
          <span>Become a Mentor / Volunteer</span>
        </button>
      </div>

      {isAdmin && (
        <div className="bg-white border border-[#E1E4E8] rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#F1F4F6] bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-wm-royal flex items-center justify-center border border-blue-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[9px] font-mono font-bold uppercase text-wm-royal tracking-wider">Administrator Review</span>
                <h3 className="font-display font-bold text-wm-navy text-sm">Volunteer Request Queue</h3>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Review submissions before adding people to the public Contacts directory.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-1 rounded-full font-bold uppercase">
              {pendingRequests.length} Pending
            </span>
          </div>

          {pendingRequests.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {pendingRequests.map((request) => {
                const isReviewingRequest = reviewingRequestId === request.id;

                return (
                  <div key={request.id} className="p-5 space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div>
                          <h4 className="font-display font-bold text-sm text-wm-navy">{request.name}</h4>
                          <p className="text-[11px] text-on-surface-variant font-mono">{request.email}</p>
                          {request.linkedinUrl && (
                            <a href={request.linkedinUrl} target="_blank" rel="noreferrer" className="text-[11px] text-wm-royal font-bold hover:underline">
                              LinkedIn profile
                            </a>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(request.interestedRoles.length > 0 ? request.interestedRoles : ['No preference selected']).map((role) => (
                            <span key={role} className="px-2 py-0.5 rounded-full bg-neutral-100 border border-neutral-200 text-[9px] font-mono font-bold text-on-surface-variant">
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStartReviewRequest(request)}
                          className="px-3 py-2 rounded-lg bg-wm-royal text-white text-[10px] font-bold flex items-center gap-1.5 hover:opacity-95"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeclineRequest(request)}
                          className="px-3 py-2 rounded-lg border border-red-100 bg-red-50 text-status-blocked text-[10px] font-bold flex items-center gap-1.5 hover:bg-red-100"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                      </div>
                    </div>

                    {isReviewingRequest && (
                      <div className="bg-neutral-50 border border-[#E1E4E8] rounded-xl p-4 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                          <input value={approvalName} onChange={(e) => setApprovalName(e.target.value)} className="text-xs p-2.5 bg-white border border-[#E1E4E8] rounded-lg outline-none focus:border-wm-royal" placeholder="Name" />
                          <input type="email" value={approvalEmail} onChange={(e) => setApprovalEmail(e.target.value)} className="text-xs p-2.5 bg-white border border-[#E1E4E8] rounded-lg outline-none focus:border-wm-royal" placeholder="Email" />
                          <input type="url" value={approvalLinkedinUrl} onChange={(e) => setApprovalLinkedinUrl(e.target.value)} className="text-xs p-2.5 bg-white border border-[#E1E4E8] rounded-lg outline-none focus:border-wm-royal" placeholder="LinkedIn URL" />
                          <select value={approvalRole} onChange={(e) => setApprovalRole(e.target.value as ContactRole)} className="text-xs p-2.5 bg-white border border-[#E1E4E8] rounded-lg outline-none focus:border-wm-royal cursor-pointer">
                            {CONTACT_ROLES.filter((role): role is ContactRole => role !== 'All').map((role) => <option key={role} value={role}>{role}</option>)}
                          </select>
                          <select value={approvalDepartment} onChange={(e) => setApprovalDepartment(e.target.value as ContactDepartment)} className="text-xs p-2.5 bg-white border border-[#E1E4E8] rounded-lg outline-none focus:border-wm-royal cursor-pointer">
                            {CONTACT_DEPARTMENTS.filter((department): department is ContactDepartment => department !== 'All').map((department) => <option key={department} value={department}>{department}</option>)}
                          </select>
                          <select value={approvalStatus} onChange={(e) => setApprovalStatus(e.target.value as ContactStatus)} className="text-xs p-2.5 bg-white border border-[#E1E4E8] rounded-lg outline-none focus:border-wm-royal cursor-pointer">
                            {CONTACT_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                          </select>
                        </div>
                        {adminFormError && <p className="text-[10px] font-bold text-status-blocked">{adminFormError}</p>}
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={handleCancelReviewRequest} className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-on-surface-variant text-[10px] font-bold flex items-center gap-1.5 hover:bg-neutral-100">
                            <X className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                          <button type="button" onClick={() => handleApproveRequest(request.id)} className="px-3 py-2 rounded-lg bg-wm-royal text-white text-[10px] font-bold flex items-center gap-1.5 hover:opacity-95">
                            <Save className="w-3.5 h-3.5" />
                            <span>Approve Contact</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-on-surface-variant">
              No volunteer requests are waiting for admin review.
            </div>
          )}
        </div>
      )}

      <div className="bg-white p-6 border border-[#E1E4E8] rounded-xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-on-surface-variant font-bold uppercase tracking-wider">Department Segments</span>
            <div className="flex flex-wrap gap-2.5">
              {CONTACT_DEPARTMENTS.map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold select-none transition-all ${
                    selectedDept === dept
                      ? 'bg-wm-navy text-white shadow-sm'
                      : 'bg-[#F1F4F6] text-on-surface-variant hover:bg-[#EBEFF2] hover:text-on-surface'
                  }`}
                >
                  {dept === 'All' ? 'All Departments' : dept}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-low px-4.5 py-2.5 rounded-lg border border-[#EBEFF2] hidden xl:flex items-center gap-3 shrink-0 text-xs text-on-surface-variant font-medium">
            <Users className="w-5 h-5 text-wm-royal" />
            <div>
              <p className="font-bold text-wm-navy">{filteredContacts.length} Synced Advisors</p>
              <p className="text-[10px] mt-0.5">Online &amp; sync-ready for Q3</p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[#F1F4F6]">
          <span className="text-[10px] font-mono text-on-surface-variant font-bold uppercase tracking-wider block mb-2">Filter Roles</span>
          <div className="flex flex-wrap gap-2.5">
            {CONTACT_ROLES.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                  selectedRole === role
                    ? 'border-wm-royal bg-blue-50 text-wm-royal font-bold'
                    : 'border-[#E1E4E8] text-on-surface-variant hover:bg-neutral-50'
                }`}
              >
                {role === 'All' ? 'All Roles' : role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredContacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredContacts.map((contact) => {
            const style = getStatusStyle(contact.status);
            const isEditingContact = editingContactId === contact.id;

            return (
              <div
                key={contact.id}
                className="bg-white border border-[#E1E4E8] rounded-xl overflow-hidden hover:border-wm-royal hover:shadow-md transition-all flex flex-col justify-between"
              >
                {isEditingContact ? (
                  <div className="p-5 space-y-3 bg-neutral-50/70">
                    <div className="flex items-center justify-between border-b border-gray-150 pb-3">
                      <span className="text-[10px] font-mono font-bold uppercase text-wm-royal">Edit Contact</span>
                      <button type="button" onClick={handleCancelEditContact} className="text-on-surface-variant hover:text-on-surface">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full text-xs p-2.5 bg-white border border-[#E1E4E8] rounded-lg outline-none focus:border-wm-royal" placeholder="Name" />
                    <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="w-full text-xs p-2.5 bg-white border border-[#E1E4E8] rounded-lg outline-none focus:border-wm-royal" placeholder="Email" />
                    <input type="url" value={editLinkedinUrl} onChange={(e) => setEditLinkedinUrl(e.target.value)} className="w-full text-xs p-2.5 bg-white border border-[#E1E4E8] rounded-lg outline-none focus:border-wm-royal" placeholder="LinkedIn URL" />
                    <select value={editRole} onChange={(e) => setEditRole(e.target.value as ContactRole)} className="w-full text-xs p-2.5 bg-white border border-[#E1E4E8] rounded-lg outline-none focus:border-wm-royal cursor-pointer">
                      {CONTACT_ROLES.filter((role): role is ContactRole => role !== 'All').map((role) => <option key={role} value={role}>{role}</option>)}
                    </select>
                    <select value={editDepartment} onChange={(e) => setEditDepartment(e.target.value as ContactDepartment)} className="w-full text-xs p-2.5 bg-white border border-[#E1E4E8] rounded-lg outline-none focus:border-wm-royal cursor-pointer">
                      {CONTACT_DEPARTMENTS.filter((department): department is ContactDepartment => department !== 'All').map((department) => <option key={department} value={department}>{department}</option>)}
                    </select>
                    <select value={editStatus} onChange={(e) => setEditStatus(e.target.value as ContactStatus)} className="w-full text-xs p-2.5 bg-white border border-[#E1E4E8] rounded-lg outline-none focus:border-wm-royal cursor-pointer">
                      {CONTACT_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                    {adminFormError && <p className="text-[10px] font-bold text-status-blocked">{adminFormError}</p>}
                    <button type="button" onClick={() => handleSaveContactEdit(contact.id)} className="w-full bg-wm-royal text-white py-2.5 rounded-lg font-bold text-xs hover:opacity-95 flex items-center justify-center gap-1.5">
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Contact</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="p-6 text-center flex flex-col items-center relative">
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => handleStartEditContact(contact)}
                          className="absolute top-4 right-4 p-2 rounded-lg bg-blue-50 text-wm-royal border border-blue-100 hover:bg-blue-100"
                          title="Edit contact"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}

                      <div className="relative mb-4">
                        <img
                          src={contact.avatar}
                          alt={contact.name}
                          className="w-18 h-18 rounded-full border-2 border-white object-cover shadow-sm bg-neutral-100"
                          referrerPolicy="no-referrer"
                        />
                        <span className={`absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${style.dot}`} title={contact.status}></span>
                      </div>

                      <h4 className="font-display font-extrabold text-sm text-wm-navy leading-snug">{contact.name}</h4>
                      <p className="text-[10.5px] font-semibold text-wm-royal mt-1">{contact.role}</p>
                      <p className="text-[10px] text-on-surface-variant uppercase font-mono tracking-wider mt-3">
                        {contact.department}
                      </p>
                      <p className="text-[10px] text-on-surface-variant font-mono mt-2 break-all">
                        {contact.email}
                      </p>
                    </div>

                    <div className="bg-[#FAFBCF]/10 border-t border-[#F1F4F6] p-4 flex gap-2 justify-between items-center bg-surface-container-low font-sans">
                      <span className={`px-2.5 py-1 text-[9px] font-mono rounded-full font-extrabold uppercase shrink-0 ${style.pill}`}>
                        {contact.status}
                      </span>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {contact.linkedinUrl && (
                          <a
                            href={contact.linkedinUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 border border-[#c3c7ce] hover:bg-white rounded-lg text-on-surface-variant hover:text-wm-royal hover:border-wm-royal transition-all"
                            title="Open LinkedIn Profile"
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                        <a
                          href={`mailto:${contact.email}`}
                          className="p-2 border border-[#c3c7ce] hover:bg-white rounded-lg text-on-surface-variant hover:text-on-surface hover:border-wm-royal transition-all"
                          title="Send Outlook Email"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleOpenChat(contact)}
                          className="bg-wm-royal hover:opacity-95 text-white font-bold text-xs py-2 px-3.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Chat</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-xl border border-dashed border-[#c3c7ce] text-center max-w-md mx-auto animate-fade-in">
          <Filter className="w-12 h-12 text-[#73777e] mx-auto mb-4" />
          <h4 className="font-display font-bold text-wm-navy text-sm mb-1">No advisors match your search</h4>
          <p className="text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
            Try adjusting your department buttons, role filters, or search terms to uncover West Monroe team advisors.
          </p>
        </div>
      )}

      {chatRecipient && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-gray-200 shadow-2xl max-w-md w-full overflow-hidden flex flex-col h-[500px] text-left animate-zoom-in select-none">
            <div className="bg-wm-navy text-white px-5 py-4 flex justify-between items-center select-none shrink-0 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={chatRecipient.avatar} alt={chatRecipient.name} className="w-9 h-9 rounded-full object-cover border border-white" referrerPolicy="no-referrer" />
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-wm-navy ${getStatusStyle(chatRecipient.status).dot}`}></span>
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold font-sans text-white leading-none">{chatRecipient.name}</h4>
                  <p className="text-[9px] font-sans text-white/85 uppercase font-medium tracking-wider mt-1">{chatRecipient.role} - {chatRecipient.department}</p>
                </div>
              </div>
              <button type="button" onClick={() => setChatRecipient(null)} className="text-white/80 hover:text-white p-0.5 outline-none">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 bg-[#FAFBCF]/10 space-y-4">
              {(conversationHistory[chatRecipient.id] || []).map((msg, idx) => {
                const isUser = msg.sender === 'me';
                return (
                  <div key={`${msg.time}-${idx}`} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                    <div className={`max-w-[85%] rounded-xl px-4 py-2.5 text-xs ${
                      isUser
                        ? 'bg-wm-royal text-white rounded-tr-none'
                        : 'bg-white border border-[#E1E4E8] text-on-surface rounded-tl-none shadow-xs'
                    }`}>
                      <p className="leading-relaxed font-sans">{msg.text}</p>
                      <span className={`text-[8px] font-mono mt-1 block text-right font-medium ${isUser ? 'text-white/70' : 'text-on-surface-variant'}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-[#E1E4E8] shrink-0 flex gap-2">
              <input
                type="text"
                required
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                placeholder="Type your message (e.g. excel formulas)..."
                className="flex-1 bg-[#F1F4F6] text-xs p-2.5 rounded-lg border-none focus:bg-white outline-none focus:ring-1 focus:ring-wm-royal transition-all placeholder:text-on-surface-variant"
              />
              <button
                type="submit"
                className="bg-wm-royal text-white hover:opacity-95 rounded-lg p-2.5 flex items-center justify-center shrink-0 cursor-pointer shadow-sm hover:scale-105 active:scale-95 transition-all text-left"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
