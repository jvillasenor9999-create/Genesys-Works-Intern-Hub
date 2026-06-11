import React, { useState } from 'react';
import { 
  PlayCircle, 
  BookOpen, 
  Clock, 
  Users, 
  Terminal, 
  FileText, 
  Award, 
  ChevronRight, 
  Search, 
  Sparkles, 
  X,
  Smartphone,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { TechnicalGuide, ProfessionalSkill, InternalSystem, VideoTutorial } from '../../types';

interface LearningHubViewProps {
  technicalGuides: TechnicalGuide[];
  professionalSkills: ProfessionalSkill[];
  internalSystems: InternalSystem[];
  videoTutorials: VideoTutorial[];
  searchQuery: string;
}

export default function LearningHubView({
  technicalGuides,
  professionalSkills,
  internalSystems,
  videoTutorials,
  searchQuery
}: LearningHubViewProps) {
  
  // Interactive modal for resuming ServiceNow/Salesforce modules
  const [activeLesson, setActiveLesson] = useState<{ title: string; desc: string; progress: number } | null>(null);
  
  // Interactive guide detail modal
  const [selectedGuide, setSelectedGuide] = useState<TechnicalGuide | null>(null);

  // Filter content with Search Query
  const query = searchQuery.toLowerCase().trim();

  const filteredGuides = technicalGuides.filter(g => 
    g.title.toLowerCase().includes(query) || g.description.toLowerCase().includes(query)
  );

  const filteredSkills = professionalSkills.filter(s => 
    s.title.toLowerCase().includes(query) || s.description.toLowerCase().includes(query)
  );

  const filteredSystems = internalSystems.filter(sys => 
    sys.title.toLowerCase().includes(query) || sys.description.toLowerCase().includes(query) || sys.docType.toLowerCase().includes(query)
  );

  const filteredVideos = videoTutorials.filter(v => 
    v.title.toLowerCase().includes(query) || v.description.toLowerCase().includes(query)
  );

  const triggerResumeServiceNow = () => {
    setActiveLesson({
      title: 'ServiceNow Fundamentals',
      desc: 'Module 4: Automating Task Workflows with Flow Designer. Learn how to map visual triggers to conditional steps.',
      progress: 65
    });
  };

  const triggerFeaturedSalesforce = () => {
    setActiveLesson({
      title: 'Salesforce Administrator Badge',
      desc: 'Module 1: User Management, Roles & Profiles. Dive into sandbox instances and user access structures.',
      progress: 0
    });
  };

  // Icon switcher for technical guides
  const getGuideTypeIcon = (icon: string) => {
    switch (icon) {
      case 'terminal':
        return <Terminal className="w-4 h-4 text-wm-navy" />;
      case 'file':
        return <FileText className="w-4 h-4 text-wm-navy" />;
      case 'video':
        return <PlayCircle className="w-4 h-4 text-wm-navy" />;
      default:
        return <BookOpen className="w-4 h-4 text-wm-navy" />;
    }
  };

  // Icon switcher for professional skills
  const getSkillIcon = (iconName: string) => {
    switch (iconName) {
      case 'clock':
        return <Clock className="w-5 h-5 text-wm-royal" />;
      case 'users':
        return <Users className="w-5 h-5 text-wm-royal" />;
      default:
        return <BookOpen className="w-5 h-5 text-wm-royal" />;
    }
  };

  return (
    <div className="space-y-8 select-none text-left pb-12">
      
      {/* Top Learning Section: Resume Learning banner & Salesforce Admin Badge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ServiceNow Resume Module Box */}
        <div className="lg:col-span-8 bg-white border border-[#E1E4E8] p-6 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 group">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-wm-royal bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                RESUME LEARNING
              </span>
              <span className="text-[10px] font-mono text-on-surface-variant">• 65% Complete</span>
            </div>
            <h3 className="text-base font-display font-bold text-wm-navy group-hover:text-wm-royal transition-all">
              ServiceNow Fundamentals
            </h3>
            <p className="text-[11px] text-on-surface-variant max-w-lg leading-relaxed">
              Automated workflows, incident escalations, and SLA monitoring patterns inside the developer console.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={triggerResumeServiceNow}
              className="bg-wm-royal hover:opacity-95 text-white font-bold text-xs px-5 py-2.5 rounded-lg active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              Resume Module
            </button>
            <button 
              onClick={() => alert("Launching overall course outline and module sequence...")}
              className="border border-[#c3c7ce] hover:bg-neutral-50 px-4 py-2.5 rounded-lg text-xs font-bold text-on-surface"
            >
              View Outline
            </button>
          </div>
        </div>

        {/* Featured Salesforce Badge Card */}
        <div className="lg:col-span-4 bg-[#FFFAEC] border border-[#F2A900]/20 p-6 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <div className="space-y-1">
              <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#bf8500] fill-amber-100 flex items-center gap-1">
                <Sparkles className="w-3 h-3 fill-shoutout-gold" />
                <span>FEATURED BADGE</span>
              </span>
              <h4 className="font-display font-extrabold text-sm text-wm-navy">Salesforce Administrator</h4>
            </div>
            <Award className="w-8 h-8 text-shoutout-gold shrink-0" />
          </div>
          <p className="text-[10.5px] text-on-surface-variant leading-relaxed mb-4">
            Earn your professional administrator badge and showcase your expertise in global CRM layout solutions.
          </p>
          <button 
            onClick={triggerFeaturedSalesforce}
            className="w-full text-center bg-shoutout-gold text-wm-navy py-2 rounded-lg font-bold text-xs hover:opacity-95 transition-all cursor-pointer"
          >
            Get Started
          </button>
        </div>

      </div>

      {/* Grid: Technical Guides & Professional Skills columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Technical Guides Section (8cols) */}
        <div className="lg:col-span-8 space-y-5">
          <h4 className="text-sm font-mono font-bold text-on-surface-variant uppercase tracking-wider">Technical Guides</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGuides.map((guide) => (
              <div 
                key={guide.id}
                onClick={() => setSelectedGuide(guide)}
                className="bg-white border border-[#E1E4E8] rounded-xl overflow-hidden hover:border-wm-royal cursor-pointer group hover:shadow-md transition-all select-none"
              >
                <div className="h-40 w-full overflow-hidden relative">
                  <img 
                    src={guide.image} 
                    alt={guide.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle hover icon overlay */}
                  <div className="absolute inset-0 bg-wm-navy/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-wm-navy text-[10px] font-mono font-bold uppercase py-1.5 px-3 rounded-md shadow">
                      Open Module
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-1 text-left">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-mono font-bold text-wm-royal uppercase tracking-tighter">
                      {guide.typeLabel}
                    </span>
                    <span className="bg-[#f1f4f6] p-1 rounded">
                      {getGuideTypeIcon(guide.typeIcon)}
                    </span>
                  </div>
                  <h5 className="font-display font-extrabold text-xs text-wm-navy leading-normal mb-1">
                    {guide.title}
                  </h5>
                  <p className="text-[10px] text-on-surface-variant leading-relaxed line-clamp-2">
                    {guide.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Professional Skills Section (4cols) */}
        <div className="lg:col-span-4 space-y-5">
          <h4 className="text-sm font-mono font-bold text-on-surface-variant uppercase tracking-wider">Professional Skills</h4>
          
          <div className="bg-white border border-[#E1E4E8] rounded-xl p-5 shadow-sm divide-y divide-[#F1F4F6]">
            {filteredSkills.map((skill) => (
              <div key={skill.id} className="py-4.5 first:pt-0 last:pb-0 flex gap-4.5 items-start group">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  {getSkillIcon(skill.iconName)}
                </div>
                <div className="min-w-0">
                  <h5 className="text-xs font-bold text-wm-navy group-hover:text-wm-royal transition-all">
                    {skill.title}
                  </h5>
                  <p className="text-[10.5px] text-on-surface-variant mt-1 leading-relaxed">
                    {skill.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Internal Systems resources & Video library */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Internal Systems Resources Group */}
        <div className="lg:col-span-6 space-y-5">
          <h4 className="text-sm font-mono font-bold text-on-surface-variant uppercase tracking-wider">Internal Systems Info</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredSystems.map((sys) => (
              <div 
                key={sys.id}
                onClick={() => alert(`Launching ${sys.title} detail sheet...`)}
                className="bg-white border border-[#E1E4E8] p-4.5 rounded-xl hover:border-wm-royal cursor-pointer group hover:shadow-sm transition-all"
              >
                <span className="inline-block px-1.5 py-0.5 bg-neutral-100 text-on-surface-variant text-[8px] font-mono font-semibold rounded uppercase mb-2 border border-neutral-200">
                  {sys.docType}
                </span>
                <h5 className="text-xs font-bold text-wm-navy group-hover:text-wm-royal mb-1 truncate">{sys.title}</h5>
                <p className="text-[10px] text-on-surface-variant leading-relaxed line-clamp-2">{sys.description}</p>
                <div className="mt-3.5 flex items-center gap-1 text-[9px] font-bold text-wm-royal uppercase tracking-tighter">
                  <span>Access document</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Tutorial Library Grid */}
        <div className="lg:col-span-6 space-y-5">
          <h4 className="text-sm font-mono font-bold text-on-surface-variant uppercase tracking-wider">Video Tutorial Library</h4>
          
          <div className="bg-white border border-[#E1E4E8] rounded-xl p-5 shadow-sm space-y-4">
            {filteredVideos.map((vid) => (
              <div 
                key={vid.id}
                onClick={() => setActiveLesson({ title: vid.title, desc: vid.description, progress: 0 })}
                className="flex gap-4 cursor-pointer hover:bg-neutral-50 p-2 rounded-lg transition-colors text-left group"
              >
                <div className="w-24 h-15 bg-neutral-100 rounded overflow-hidden shrink-0 relative border border-gray-100">
                  <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-mono px-1 rounded">
                    {vid.duration}
                  </span>
                  <PlayCircle className="absolute inset-x-0 inset-y-0 w-6 h-6 text-white m-auto drop-shadow opacity-90 group-hover:scale-110 transition-transform" />
                </div>
                <div className="min-w-0 flex-1">
                  <h5 className="text-xs font-bold text-wm-navy group-hover:text-wm-royal truncate leading-snug">{vid.title}</h5>
                  <p className="text-[10px] text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">{vid.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Interactive module player modal */}
      {activeLesson && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-gray-200 shadow-2xl max-w-lg w-full overflow-hidden text-left animate-zoom-in space-y-4 select-none">
            <div className="bg-wm-navy p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-shoutout-gold" />
                <h4 className="text-sm font-display font-medium leading-none">{activeLesson.title}</h4>
              </div>
              <button onClick={() => setActiveLesson(null)} className="text-white/80 hover:text-white p-0.5">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-black/90 aspect-video rounded-lg overflow-hidden flex flex-col items-center justify-center p-8 relative border border-[#c3c7ce]">
                <div className="w-12 h-12 rounded-full bg-wm-royal text-white flex items-center justify-center animate-pulse shadow-md z-10 cursor-pointer">
                  <PlayCircle className="w-8 h-8" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <p className="absolute bottom-3 left-3 text-[10px] font-mono text-white/95 uppercase font-semibold">Lesson Sandbox Active Connection State ... ONLINE</p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-wm-navy">Lesson Content & Guide</p>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">{activeLesson.desc}</p>
              </div>

              <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-xs">
                {activeLesson.progress > 0 ? (
                  <span className="font-bold text-wm-royal">Completed {activeLesson.progress}% previously</span>
                ) : (
                  <span className="font-bold text-status-success flex items-center gap-1">
                    <Sparkles className="w-4 h-4 fill-status-success animate-pulse text-status-success" />
                    <span>Reward: West Monroe Badge point</span>
                  </span>
                )}
                <button 
                  onClick={() => {
                    alert("Module successfully synchronized and added to user training transcript.");
                    setActiveLesson(null);
                  }}
                  className="bg-wm-royal text-white px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-all text-left"
                >
                  Mark Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guide detail modal */}
      {selectedGuide && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-45">
          <div className="bg-white rounded-xl border border-gray-200 shadow-2xl max-w-lg w-full overflow-hidden text-left animate-zoom-in select-none">
            
            <div className="h-44 w-full relative">
              <img src={selectedGuide.image} alt={selectedGuide.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-5">
                <div className="space-y-1">
                  <span className="text-[10px] bg-wm-royal text-white font-mono font-bold px-2.5 py-0.5 rounded tracking-wider uppercase">
                    {selectedGuide.typeLabel}
                  </span>
                  <h4 className="text-white font-display font-extrabold text-base leading-snug">{selectedGuide.title}</h4>
                </div>
              </div>
              <button 
                onClick={() => setSelectedGuide(null)} 
                className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 p-1.5 rounded-full outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-bold text-wm-navy">Curriculum Overview</p>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  {selectedGuide.description} Learn practical real-world tricks and layout processes that our team deploys on customer engagements every single day.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-2 border-t border-b border-[#F1F4F6]">
                <div className="text-left">
                  <p className="text-[9px] font-mono text-on-surface-variant uppercase">Estimated Duration</p>
                  <p className="text-xs font-bold text-on-surface mt-0.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-on-surface-variant" />
                    <span>3 Hours • Self-Paced</span>
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-mono text-on-surface-variant uppercase">Experience Level</p>
                  <p className="text-xs font-bold text-on-surface mt-0.5">Beginner-to-Intermediate</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  onClick={() => setSelectedGuide(null)} 
                  className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:text-on-surface"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setSelectedGuide(null);
                    setActiveLesson({
                      title: selectedGuide.title,
                      desc: selectedGuide.description,
                      progress: 0
                    });
                  }}
                  className="bg-wm-royal text-white px-5 py-2 rounded-lg font-bold hover:opacity-90 transition-all text-left"
                >
                  Start Training
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
