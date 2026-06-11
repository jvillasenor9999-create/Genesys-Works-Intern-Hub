import React, { useState } from 'react';
import { 
  Mail, 
  MessageSquare, 
  Linkedin, 
  X, 
  Send, 
  Sparkles, 
  Users,
  Search,
  Filter,
  ArrowLeft,
  Check,
  Heart
} from 'lucide-react';
import { Contact } from '../../types';

interface ContactsViewProps {
  contacts: Contact[];
  searchQuery: string;
}

export default function ContactsView({
  contacts,
  searchQuery
}: ContactsViewProps) {
  
  // Local contacts state to dynamically show newly registered volunteers
  const [localContacts, setLocalContacts] = useState<Contact[]>(contacts);

  // States for filters
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedRole, setSelectedRole] = useState<string>('All');

  // Form states matching image specs
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // Chat conversation state
  const [chatRecipient, setChatRecipient] = useState<Contact | null>(null);
  const [typedMessage, setTypedMessage] = useState('');
  const [conversationHistory, setConversationHistory] = useState<Record<string, { sender: 'me' | 'recipient'; text: string; time: string }[]>>({});

  // Departments listing
  const departments = ['All', 'Product Engineering', 'Customer Experience', 'Operations Excellence', 'Data & Analytics'];

  // Roles listing
  const roles = ['All', 'Career Advisor', 'Mentor', 'Project Manager'];

  // Roles interest options from screenshot
  const roleOptions = [
    'Intern Mentor',
    'Intern Career Advisor',
    'Capstone Lead',
    'Genesys Works Supervisory Team'
  ];

  // Filter contacts by Search, Department, and Role
  const filteredContacts = localContacts.filter((c) => {
    // 1. Search Query
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      const matchName = c.name.toLowerCase().includes(query);
      const matchRole = c.role.toLowerCase().includes(query);
      const matchDept = c.department.toLowerCase().includes(query);
      if (!matchName && !matchRole && !matchDept) return false;
    }

    // 2. Department filter
    if (selectedDept !== 'All' && c.department !== selectedDept) return false;

    // 3. Role filter
    if (selectedRole !== 'All' && c.role !== selectedRole) return false;

    return true;
  });

  // Get status color styling
  const getStatusStyle = (status: string) => {
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
      // Seed default welcoming introductory message
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

    // Update history
    setConversationHistory(prev => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), userMsg]
    }));

    const cachedMessage = typedMessage;
    setTypedMessage('');

    // Trigger funny, clever automatic simulated advisory response after 1 second!
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
    if (selectedRoles.includes(roleOpt)) {
      setSelectedRoles(selectedRoles.filter(r => r !== roleOpt));
    } else {
      setSelectedRoles([...selectedRoles, roleOpt]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    // Map role strictly to the Contact's role union type ('Career Advisor' | 'Mentor' | 'Project Manager')
    let mappedRole: 'Career Advisor' | 'Mentor' | 'Project Manager' = 'Mentor';
    if (selectedRoles.includes('Intern Career Advisor')) {
      mappedRole = 'Career Advisor';
    } else if (selectedRoles.includes('Genesys Works Supervisory Team')) {
      mappedRole = 'Project Manager';
    }

    const newVolunteer: Contact = {
      id: `volunteer-${Date.now()}`,
      name: formName.trim(),
      role: mappedRole,
      department: 'Operations Excellence', // default matching community program sync
      status: 'Willing to help',
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(formName)}` // dynamic distinct modern svg avatar
    };

    // Dynamically insert the new self-appointed mentor directly into live directory state!
    setLocalContacts(prev => [newVolunteer, ...prev]);
    setIsFormSubmitted(true);
  };

  const handleResetForm = () => {
    setFormName('');
    setSelectedRoles([]);
    setIsFormSubmitted(false);
  };

  // ─── RENDERING SUB-PAGE FOR THE INTEREST FORM ───
  if (showForm) {
    return (
      <div className="space-y-6 text-left select-none pb-12 transition-all">
        {/* Navigation Return Banner */}
        <button 
          onClick={() => { setShowForm(false); handleResetForm(); }}
          className="flex items-center gap-2 text-xs font-semibold text-wm-navy hover:text-wm-royal transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Advisors Directory</span>
        </button>

        {/* Pale Purple background canvas matching screenshot mood */}
        <div className="bg-gradient-to-tr from-[#edeef9] via-[#e4e8fa] to-[#f4f1ff] p-6 md:p-12 rounded-2xl border border-[#d2d6f0] shadow-sm flex flex-col items-center">
          
          {/* Main Microsoft Forms style Card */}
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden relative border border-[#e1e4f3]/60 flex flex-col">
            
            {/* Purple Signature Header strip mimicking MS Forms */}
            <div className="h-2 bg-[#6c58be] w-full" />

            <div className="p-8 space-y-8">
              
              {!isFormSubmitted ? (
                <>
                  {/* Header Title */}
                  <div className="border-b border-[#E1E4E8] pb-5">
                    <h2 className="text-xl md:text-2xl font-bold text-[#323130] font-sans">
                      Genesys Works Intern Program Interest Form
                    </h2>
                  </div>

                  {/* The interactive questionnaire */}
                  <form onSubmit={handleFormSubmit} className="space-y-8 text-left">
                    
                    {/* Q1: First and Last Name */}
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

                    {/* Q2: Which are you interested in being? */}
                    <div className="space-y-4">
                      <label className="text-[14px] font-bold text-[#323130] flex items-start gap-1 font-sans">
                        <span>2. Which are you interested in being?</span>
                      </label>

                      <div className="space-y-3 pl-1">
                        {roleOptions.map((option) => {
                          const isChecked = selectedRoles.includes(option);
                          return (
                            <div 
                              key={option}
                              onClick={() => handleToggleRoleSelection(option)}
                              className="flex items-center gap-3 group cursor-pointer select-none"
                            >
                              <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
                                isChecked 
                                  ? 'bg-[#6c58be] border-[#6c58be] text-white shadow-sm' 
                                  : 'border-gray-350 bg-white group-hover:border-[#6c58be]'
                              }`}>
                                {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                              <span className="text-xs font-semibold text-gray-700 font-sans group-hover:text-black">
                                {option}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Action submit row */}
                    <div className="pt-6 border-t border-[#E1E4E8] flex flex-col sm:flex-row items-center gap-3">
                      <button 
                        type="submit" 
                        disabled={!formName.trim()}
                        className="w-full sm:w-auto bg-[#6c58be] hover:bg-[#5b49a5] disabled:opacity-50 text-white font-extrabold text-xs px-6 py-3 rounded-lg shadow-md transition-all cursor-pointer"
                      >
                        Submit Response
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
                /* Success/Acknowledgment State mimicking Forms */
                <div className="py-8 text-center space-y-6">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto border border-green-100 shadow-sm animate-zoom-in">
                    <Check className="w-8 h-8 text-[#28A745] stroke-[2.5]" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-800">Thanks!</h3>
                    <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
                      Your response was submitted successfully for the Genesys Works Intern Program. We appreciate your valuable contribution!
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#F1F4F6] flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <button 
                      onClick={() => { setShowForm(false); }}
                      className="bg-wm-navy hover:bg-wm-navy/90 text-white font-bold text-xs px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-sm"
                    >
                      <Users className="w-4 h-4" />
                      <span>See Directory with Your Profile</span>
                    </button>
                    <button 
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

  // ─── RENDERING MAIN DIRECTORY VIEW PAGE ───
  return (
    <div className="space-y-6 text-left select-none pb-12">
      
      {/* ─── Hero Program Support Banner with CTA Button ─── */}
      <div className="bg-gradient-to-r from-wm-navy via-[#003b6d] to-wm-royal rounded-xl p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
        <div className="space-y-1.5 text-left">
          <span className="text-[10px] font-mono tracking-widest text-[#FAFBCF] uppercase font-bold">Community Support Coalition</span>
          <h2 className="text-lg font-bold font-display text-white">Advisors &amp; Cohort Volunteers</h2>
          <p className="text-xs text-white/80 max-w-2xl leading-relaxed">
            Connect with seasoned professionals eager to assist with technical guides, workplace dynamics, and career advisories. You can also volunteer yourself as an active mentor!
          </p>
        </div>
        <button
          id="become-mentor-btn"
          onClick={() => setShowForm(true)}
          className="bg-[#FAFBCF] text-wm-navy hover:bg-[#FAF9E0] font-extrabold text-xs py-2.5 px-4.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-sm select-none shrink-0 hover:scale-[1.02] active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-[#F2A900] fill-[#F2A900]" />
          <span>Become a Mentor / Volunteer</span>
        </button>
      </div>

      {/* Category filter dashboard selectors */}
      <div className="bg-white p-6 border border-[#E1E4E8] rounded-xl shadow-sm space-y-4">
        
        {/* Department Filters Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-on-surface-variant font-bold uppercase tracking-wider">Department Segments</span>
            <div className="flex flex-wrap gap-2.5">
              {departments.map((dept) => (
                <button
                  key={dept}
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

          {/* Quick Stats widget */}
          <div className="bg-surface-container-low px-4.5 py-2.5 rounded-lg border border-[#EBEFF2] hidden xl:flex items-center gap-3 shrink-0 text-xs text-on-surface-variant font-medium">
            <Users className="w-5 h-5 text-wm-royal" />
            <div>
              <p className="font-bold text-wm-navy">{filteredContacts.length} Synced Advisors</p>
              <p className="text-[10px] mt-0.5">Online &amp; sync-ready for Q3</p>
            </div>
          </div>
        </div>

        {/* Roles Filter Row */}
        <div className="pt-3 border-t border-[#F1F4F6]">
          <span className="text-[10px] font-mono text-on-surface-variant font-bold uppercase tracking-wider block mb-2">Filter Roles</span>
          <div className="flex flex-wrap gap-2.5">
            {roles.map((role) => (
              <button
                key={role}
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

      {/* Grid of contact cards matching design system layouts */}
      {filteredContacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredContacts.map((c) => {
            const style = getStatusStyle(c.status);

            return (
              <div 
                key={c.id} 
                className="bg-white border border-[#E1E4E8] rounded-xl overflow-hidden hover:border-wm-royal hover:shadow-md transition-all flex flex-col justify-between"
              >
                
                {/* Member card top banner & primary details */}
                <div className="p-6 text-center flex flex-col items-center">
                  <div className="relative mb-4">
                    <img 
                      src={c.avatar} 
                      alt={c.name} 
                      className="w-18 h-18 rounded-full border-2 border-white object-cover shadow-sm bg-neutral-100"
                      referrerPolicy="no-referrer"
                    />
                    {/* Status Dot */}
                    <span 
                      className={`absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${style.dot}`}
                      title={c.status}
                    ></span>
                  </div>

                  <h4 className="font-display font-extrabold text-sm text-wm-navy leading-snug">{c.name}</h4>
                  <p className="text-[10.5px] font-semibold text-wm-royal mt-1">{c.role}</p>
                  
                  <p className="text-[10px] text-on-surface-variant uppercase font-mono tracking-wider mt-3">
                    {c.department}
                  </p>
                </div>

                {/* Footer details: contact status details and Direct email trigger */}
                <div className="bg-[#FAFBCF]/10 border-t border-[#F1F4F6] p-4 flex gap-2 justify-between items-center bg-surface-container-low font-sans">
                  <span className={`px-2.5 py-1 text-[9px] font-mono rounded-full font-extrabold uppercase shrink-0 ${style.pill}`}>
                    {c.status}
                  </span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <a 
                      href={`mailto:${c.name.toLowerCase().replace(' ', '.')}@westmonroe.com`}
                      className="p-2 border border-[#c3c7ce] hover:bg-white rounded-lg text-on-surface-variant hover:text-on-surface hover:border-wm-royal transition-all"
                      title="Send Outlook Email"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleOpenChat(c)}
                      className="bg-wm-royal hover:opacity-95 text-white font-bold text-xs py-2 px-3.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>

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

      {/* Embedded Live chat box modal */}
      {chatRecipient && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-gray-200 shadow-2xl max-w-md w-full overflow-hidden flex flex-col h-[500px] text-left animate-zoom-in select-none">
            
            {/* Header info */}
            <div className="bg-wm-navy text-white px-5 py-4 flex justify-between items-center select-none shrink-0 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={chatRecipient.avatar} alt={chatRecipient.name} className="w-9 h-9 rounded-full object-cover border border-white" referrerPolicy="no-referrer" />
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-wm-navy ${getStatusStyle(chatRecipient.status).dot}`}></span>
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold font-sans text-white leading-none">{chatRecipient.name}</h4>
                  <p className="text-[9px] font-sans text-white/85 uppercase font-medium tracking-wider mt-1">{chatRecipient.role} • {chatRecipient.department}</p>
                </div>
              </div>
              <button onClick={() => setChatRecipient(null)} className="text-white/80 hover:text-white p-0.5 outline-none">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Chat list history body container */}
            <div className="flex-1 overflow-y-auto p-5 bg-[#FAFBCF]/10 space-y-4">
              {(conversationHistory[chatRecipient.id] || []).map((msg, idx) => {
                const isUser = msg.sender === 'me';
                return (
                  <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
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

            {/* Submit chat message input form */}
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
