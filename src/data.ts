import { Task, Shoutout, QuickLink, Meeting, RoadmapTask, TechnicalGuide, ProfessionalSkill, InternalSystem, VideoTutorial, Contact, FaqItem } from './types';

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Develop API documentation for User Auth module',
    status: 'todo',
    type: 'Feature',
    priority: 'High',
    dueDate: 'Sep 22',
    description: 'Create a comprehensive OpenAPI/Swagger reference specification detailing SSO auth endpoints, header structures, dynamic token refresh handshakes, and response models. Coordinate with the core platform engineering team for security gate audits.',
    assignee: {
      name: 'Amos Rivera',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmEVf4Rp70djzKh_JfrtcGH8gV04tp3CmE1NwqNq7pHaICO8fSR-ccV_jO6D-mU3ZE3i5zbdVQp55rBuSkxJNKY1PcxsRht4wxDsJPJzNK1PbSOCxdR7wb39NV5rz59mxEmvK1-AuaHeHG9OULZuqrlIGzZG5qmbf35Chldy0K1d9O0aSjDH2Qa-0Z9AdzL5xfokjEbirSPNhNFeGiVlvi2akR4fyRylnr4BRcgKD8gINPStgJTys052RF_KnaNg8fkfq1Ua0n2uk'
    },
    comments: [
      {
        id: 'c1-1',
        author: 'Sarah Anderson',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmwwOwBpBgsYSE1SoGXp1Wa7o_edMgDb7qj4xRspqVRNb5EdBl32A40gQj1ZJrL6Od9tZVzh6G27x8T9XL3Zw0r9ePCTrbcVt-VhSNIM-61Nr0YnAlEnKwEk7fb0-WWuE20Wg6rf4cDnqq0PbYmyVB_EjxKbQXKqZffdowXXHbFsqOzgpIUsL90dPkYnmYTN_ZtUOWwhZvbt2-4jTMURjCZAqG9YM0gycWTQyJpzafPlCzxgBFwjLZZvitek1BD8niZSu9hXNqt9g',
        text: 'Make sure to explicitly document the active JWT refresh token policy, as key duration differs across standard and supervisor access layers.',
        date: 'Yesterday'
      }
    ]
  },
  {
    id: 'task-2',
    title: "Research competitors' dashboard layout best practices",
    status: 'backlog',
    type: 'Opportunity',
    priority: 'Low',
    dueDate: 'Future Sprint',
    description: 'Inquire client telemetry layouts used across top Salesforce CRM dashboards. Draft a 3-slide analysis prioritizing spatial efficiency, dark/light contrast configurations, and modular bento layout options.',
    comments: []
  },
  {
    id: 'task-3',
    title: 'Update ServiceNow Dashboard Mockups',
    status: 'progress',
    type: 'Feature',
    priority: 'High',
    dueDate: 'Due tomorrow • Project: Internal UX',
    description: 'Iterate mockup layers on Figma integrating internal client comments. Refine critical metric alignments, navigation spacing ratios, and custom branding palette tokens matching the West Monroe style matrix.',
    assignee: {
      name: 'Alex Rivera',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPyTh4ZqA7kjWPwR-sCujEJOhg7n16iz7uA67wBEeBWF36WSGZlp0qDliA4zF--C5o_NSxHdnHVGf1DKIQGNsX-bPH7Rd8qDv6XNTxjvx8B98mnsyVk9yHECSaAfB6F6FqGS4zRVOh90q5RnmBG-XnDT-mmtHBH828nU0RT397Ca_IB8kRBYOjoOeTnuWX1OzJhypYPxUQR01GgUe6l3hizgg8vpyipfCa2mfORJTcFZcOu5yVdbcTMroqeSVJSCyoigqx7w0tkJ8'
    },
    comments: [
      {
        id: 'c3-1',
        author: 'Marcus Chen',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqQoFrciSutG-llI_5OmFesWaHSbfKbJ89PWvuoCpGtAGdAhoNIFwe6Op-LyyZWK-gHRo8DS_fj-7qI7FBrxz7hJ7hpHAyiWlUPp7VObpvLExELVn6XntTeXw4hX1hDW6aH1fKXemmsccxJC4ng1B5SzEiozR2oTeRVNBq4rKjopSGkfLBC38v1hcawwN5mA1SBQXNNtf23O2stHfICljEhzzjifaiSRDGR3EEuBoqgFpcTXgCw6sAFu_TlzhQQ-pYGXWJrJFxdM8',
        text: 'Double check the grid. On some viewport settings, cards should stack dynamically into vertical lists.',
        date: '3 hours ago'
      }
    ]
  },
  {
    id: 'task-4',
    title: 'Fix broken responsiveness on Learning Hub mobile view',
    status: 'progress',
    type: 'Bug Fix',
    priority: 'Medium',
    dueDate: 'Tomorrow',
    progress: 66,
    description: 'Address overlapping viewport boundaries in CSS flexbox layers on screen sizes below 640px. Make sure learning list modules scroll independently and sidebar folds cleanly without breaking the flow.',
    assignee: {
      name: 'Marcus Chen',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqQoFrciSutG-llI_5OmFesWaHSbfKbJ89PWvuoCpGtAGdAhoNIFwe6Op-LyyZWK-gHRo8DS_fj-7qI7FBrxz7hJ7hpHAyiWlUPp7VObpvLExELVn6XntTeXw4hX1hDW6aH1fKXemmsccxJC4ng1B5SzEiozR2oTeRVNBq4rKjopSGkfLBC38v1hcawwN5mA1SBQXNNtf23O2stHfICljEhzzjifaiSRDGR3EEuBoqgFpcTXgCw6sAFu_TlzhQQ-pYGXWJrJFxdM8'
    },
    comments: [
      {
        id: 'c4-1',
        author: 'Thomas Wright',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlFZmdGnXv88Iq2TLd4u47C1qVJKNlcNnWUH6Y8l7-SvFHMUH1zH1AAvi6AtCowAqRHIO-0tmyIma9Pff_OX34Fl_mJRmzFJeulL8_JTc7lwvhM_B5QPjGv-VNbIjjZGjZ_B4PQrxkyOjuVmhaRm4CPIwZ2gffZawnHJOOl8QaQIF85yibmOP6geQ8TIg5hfGL7tmaRX9TXcVJeDMdlONWgEJHw4K3FoqQy_8_L7RD76ogYVkAYX63Vzr9spX08CIo-WW01p6Lo_k',
        text: 'Tested this on iOS Safari. Transition looks smooth now, just check the header layout padding next.',
        date: 'Yesterday'
      }
    ]
  },
  {
    id: 'task-5',
    title: 'Review Excel Formulas for Client Q3 Report',
    status: 'todo',
    type: 'Bug Fix',
    priority: 'High',
    dueDate: 'Due Fri • Project: Client Analytics',
    description: 'Audit macro formulas across three main data worksheets. Clean up unresolved name references and static lookups, substituting them with dynamic XLOOKUP operations for high security and performance.',
    comments: []
  },
  {
    id: 'task-6',
    title: 'Drafting initial project scope for Q4 planning',
    status: 'review',
    type: 'Feature',
    priority: 'High',
    dueDate: 'Oct 30',
    commentsCount: 3,
    description: 'Document core engineering workflows, target deliverables, user validation timelines, and team budget allocations for Q4 planning review with executive project sponsors.',
    assignee: {
      name: 'Sarah Anderson',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmwwOwBpBgsYSE1SoGXp1Wa7o_edMgDb7qj4xRspqVRNb5EdBl32A40gQj1ZJrL6Od9tZVzh6G27x8T9XL3Zw0r9ePCTrbcVt-VhSNIM-61Nr0YnAlEnKwEk7fb0-WWuE20Wg6rf4cDnqq0PbYmyVB_EjxKbQXKqZffdowXXHbFsqOzgpIUsL90dPkYnmYTN_ZtUOWwhZvbt2-4jTMURjCZAqG9YM0gycWTQyJpzafPlCzxgBFwjLZZvitek1BD8niZSu9hXNqt9g'
    },
    comments: [
      {
        id: 'c6-1',
        author: 'Amos Rivera',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmEVf4Rp70djzKh_JfrtcGH8gV04tp3CmE1NwqNq7pHaICO8fSR-ccV_jO6D-mU3ZE3i5zbdVQp55rBuSkxJNKY1PcxsRht4wxDsJPJzNK1PbSOCxdR7wb39NV5rz59mxEmvK1-AuaHeHG9OULZuqrlIGzZG5qmbf35Chldy0K1d9O0aSjDH2Qa-0Z9AdzL5xfokjEbirSPNhNFeGiVlvi2akR4fyRylnr4BRcgKD8gINPStgJTys052RF_KnaNg8fkfq1Ua0n2uk',
        text: 'Draft looks highly realistic and accurate. I added small notes about Cloud platform estimates.',
        date: '2 Oct'
      },
      {
        id: 'c6-2',
        author: 'Thomas Wright',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlFZmdGnXv88Iq2TLd4u47C1qVJKNlcNnWUH6Y8l7-SvFHMUH1zH1AAvi6AtCowAqRHIO-0tmyIma9Pff_OX34Fl_mJRmzFJeulL8_JTc7lwvhM_B5QPjGv-VNbIjjZGjZ_B4PQrxkyOjuVmhaRm4CPIwZ2gffZawnHJOOl8QaQIF85yibmOP6geQ8TIg5hfGL7tmaRX9TXcVJeDMdlONWgEJHw4K3FoqQy_8_L7RD76ogYVkAYX63Vzr9spX08CIo-WW01p6Lo_k',
        text: 'Let us make sure the training hours budgets are accounted for correctly.',
        date: '4 Oct'
      }
    ]
  },
  {
    id: 'task-7',
    title: 'Initial Onboarding documentation review',
    status: 'done',
    type: 'Completed',
    priority: 'Low',
    dueDate: 'Sep 12',
    description: 'Verify signature tasks on W-4 forms, standard compliance handbooks, security clearances, and system portal password setup actions. Complete final onboarding quiz check.',
    assignee: {
      name: 'Thomas Wright',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlFZmdGnXv88Iq2TLd4u47C1qVJKNlcNnWUH6Y8l7-SvFHMUH1zH1AAvi6AtCowAqRHIO-0tmyIma9Pff_OX34Fl_mJRmzFJeulL8_JTc7lwvhM_B5QPjGv-VNbIjjZGjZ_B4PQrxkyOjuVmhaRm4CPIwZ2gffZawnHJOOl8QaQIF85yibmOP6geQ8TIg5hfGL7tmaRX9TXcVJeDMdlONWgEJHw4K3FoqQy_8_L7RD76ogYVkAYX63Vzr9spX08CIo-WW01p6Lo_k'
    },
    comments: [
      {
        id: 'c7-1',
        author: 'Sarah Anderson',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmwwOwBpBgsYSE1SoGXp1Wa7o_edMgDb7qj4xRspqVRNb5EdBl32A40gQj1ZJrL6Od9tZVzh6G27x8T9XL3Zw0r9ePCTrbcVt-VhSNIM-61Nr0YnAlEnKwEk7fb0-WWuE20Wg6rf4cDnqq0PbYmyVB_EjxKbQXKqZffdowXXHbFsqOzgpIUsL90dPkYnmYTN_ZtUOWwhZvbt2-4jTMURjCZAqG9YM0gycWTQyJpzafPlCzxgBFwjLZZvitek1BD8niZSu9hXNqt9g',
        text: 'Welcome on board! Terrific to have you on our team.',
        date: 'Sep 12'
      }
    ]
  },
  {
    id: 'task-8',
    title: 'Finalize Intern Case Study Presentation',
    status: 'todo',
    type: 'Feature',
    priority: 'Medium',
    dueDate: 'Due next week • Internal Development',
    description: 'Assemble key program milestones, technical skill growth metrics, client service highlights, and final recommendations into a 15-minute presentation slides structure for cohort review.',
    comments: []
  },
  {
    id: 'task-9',
    title: 'Design interactive playground for Excel formulas',
    status: 'backlog',
    type: 'Feature',
    priority: 'Medium',
    dueDate: 'Oct 15',
    description: 'Set up a client-side reactive sandbox where interns can practice lookup constructs, conditional formatting strategies, and pivot table query exercises in standard environments.',
    comments: []
  },
  {
    id: 'task-10',
    title: 'Draft security guidelines for CRM platform usage',
    status: 'backlog',
    type: 'Bug Fix',
    priority: 'High',
    dueDate: 'Oct 02',
    description: 'Formulate safe-handling parameters regarding client identity, PII masking triggers, export logs auditing metrics, and credential retention procedures inside internal Salesforce tenants.',
    comments: []
  },
  {
    id: 'task-11',
    title: 'Investigate PowerBI visualization templates',
    status: 'backlog',
    type: 'Opportunity',
    priority: 'Low',
    dueDate: 'Oct 28',
    description: 'Explore template styling layouts utilizing West Monroe theme matrices for executive summary metrics dashboards, client billing reports, and employee utilization analytics.',
    comments: []
  }
];

export const SHOUTOUTS: Shoutout[] = [
  {
    id: 'shoutout-1',
    nominee: 'Jordan Smith',
    nomineeAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiyUO3zp8KV6FgDRsPNx6bafm6SeVAbBrJqNr_eyW7r-yUVU6ePXQlR_Dj1ls9xKJAixEBDVBL3Iwnca7XklHlYAEKFhWph6Um1E3JCkEzt4R-Y3Q4SBlXKHW6O8mDY2pFX-CCwhhRxFJvUaimM2Di0XGq5_EgXl9893Xbxb-_P-RfxiYUCQK5IKYD7xI7FJ1K7OFWpc3pouiQjf_roFkRo0a547ONbmL-GiLhy3sHVaUHDV-zNTFPrDY2Js0QcceVgr_PA--l8pU',
    text: '"Huge thanks to Jordan for staying late to help me debug the AI model integration. Your Excel wizardry saved our team hours of work!"',
    recognizedBy: 'Sarah Jenkins',
    timeAgo: '2 hours ago',
    starred: true
  },
  {
    id: 'shoutout-2',
    nominee: 'Marcus Chen',
    nomineeAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3jUJT4YLI8zuumDGtKgjR-ZrbJ7vcBMqmXyxIQoYTrQcTs6ldPz_PE1V1IFEzrnrLdIq1i07OejbX1jM5PNrff5l133cRLg6CQhsMkbGh5gXHq_pZf2a9yEf1gpCvLf39by9-KVm_xPgXv4RbkLrA7XMRjIwIjOHlugYaENTBfrEqOihp5Haszo3tT55HehcJYp91uwY1EizjB_gNKh0oSMDf1zX4s3iytEr03o8IUDmgvvFmd8sD5OgB1QVseiH6Aip6_-egEBE',
    text: '"Marcus did an incredible job presenting the Q2 findings to the leadership team. Professional, clear, and data-driven!"',
    recognizedBy: 'Mike Ross',
    timeAgo: 'Yesterday',
    starred: true
  }
];

export const QUICK_LINKS: QuickLink[] = [
  { id: 'ql-1', title: 'ServiceNow Training', iconName: 'Zap' },
  { id: 'ql-2', title: 'Excel Mastery', iconName: 'Grid' },
  { id: 'ql-3', title: 'AI Tools Sandbox', iconName: 'Cpu' },
  { id: 'ql-4', title: 'West Monroe Connect', iconName: 'Share2' }
];

export const MEETINGS: Meeting[] = [
  {
    id: 'meeting-1',
    title: 'Weekly Intern Sync',
    dateMonth: 'OCT',
    dateDay: '24',
    time: '09:00 AM',
    location: 'Zoom'
  },
  {
    id: 'meeting-2',
    title: 'Excel Workshop',
    dateMonth: 'OCT',
    dateDay: '25',
    time: '01:30 PM',
    location: 'Room 402'
  }
];

export const ONBOARDING_ROADMAP: RoadmapTask[] = [
  {
    id: 'rb-1',
    title: 'Signed Offer Documents',
    description: 'Ensure all Genesys Works and WM digital signatures are finalized.',
    status: 'completed',
    category: 'pre-arrival'
  },
  {
    id: 'rb-2',
    title: 'Hardware Selection',
    description: 'Choose your workstation preference (PC/Mac) and delivery address.',
    status: 'completed',
    category: 'pre-arrival'
  },
  {
    id: 'rb-3',
    title: 'Workstation Setup',
    description: 'Setting up your West Monroe workstation and configuring security protocols.',
    status: 'current',
    category: 'pre-arrival',
    actionLabel: 'Start MFA Setup',
    actionGuide: 'View Guide',
    subtasks: [
      { label: 'Unbox Hardware', checked: true },
      { label: 'Initial Login & MFA', checked: false },
      { label: 'Install Office 365', checked: false }
    ]
  },
  {
    id: 'rb-4',
    title: 'Meet Your Buddy',
    description: 'Schedule your first 1-on-1 with your assigned WM Intern Buddy.',
    status: 'upcoming',
    category: 'week-1'
  },
  {
    id: 'rb-5',
    title: 'Time Entry Training',
    description: 'Learn how to accurately track and submit your weekly hours.',
    status: 'upcoming',
    category: 'week-1'
  },
  {
    id: 'rb-6',
    title: 'Client Site Visit',
    description: 'Participate in your first shadow experience at a client engagement site.',
    status: 'locked',
    category: '30-day'
  },
  {
    id: 'rb-7',
    title: 'Internal Case Study',
    description: 'Begin contributing to an internal research or development project.',
    status: 'locked',
    category: '30-day'
  }
];

export const TECHNICAL_GUIDES: TechnicalGuide[] = [
  {
    id: 'guide-1',
    title: 'ServiceNow Guide',
    description: 'Learn ticketing, incident management, and automated workflows.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxq0Y6Rliy80npCTVTPF3Wq20aY1Vs2R3u7HWYayIxHrS1CeYydqZP_XfeVerOQ7-y5ntoFIvq1QLc_TmvnDA4Xi_b9LGe7AYd1I7-aC0W5QPKYsWwBLVaeQumg40g-anKMlmNVM9m5dGNQCl70b6Jkp4LQGSDRA3dQoioD5lo4mFC3u2_MqpIizrU4N4RfkYVRu8iQdbqZOOxIubBLJnTIj178tSbqYqPq87USLNy98wiPOgihcY9jw8H49zDxEhJS7Z99PwLk0I',
    typeLabel: '12 Modules',
    typeIcon: 'book'
  },
  {
    id: 'guide-2',
    title: 'Salesforce CRM',
    description: 'Master lead tracking, reporting, and customer relationship data.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwzu85FdTe1azBS6p0BiginPrlm0o-QumBWe3kFO48dL40ttH5ueChYohqZ7VUQ4cL65PIKOz4cvsxZIReLODM2qJdm81eXbvxvbaOren1VktExn8rPKWHd0a7Nm-fCuSe15lCa2_RAjo45bdtOwG5MafO33nDdSnz2lzs46jMPQq6rkFg5CnRTPzPyiyCFOaqum8NY9zmDXXMtGgBixVw3gMkHcEns99qbepyqr1pqttx6PHoCeWBW-MSVSQTCFLpBe1LCboC8RM',
    typeLabel: '8 Videos',
    typeIcon: 'video'
  },
  {
    id: 'guide-3',
    title: 'Advanced Excel',
    description: 'VLOOKUP, Pivot Tables, and advanced data modeling techniques.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxnstdrjWWYQnZ-qjIECjRQ99-8A4-cDu_IHiGXFJvJql9U-Wm4mE2OiKGNyoqG7SJ2dAQZG56FqoiEGambclwwvB--KLsQjGRPdCRbcgvzq1zKhwSQ4EZFAgN2y_Clgy79Sf4JAvQKRoQe5jjpb8g9tBRysRq5mwi0UOcOogXW9VoxLR6coB15i2ehZmhWg6uoIPs7590BI1qsY9B1AmERM9dJHaKqY3K5BRgXhvEO_4qgYCn6hpL0Qk41qqx4ic5Orz_AVraJgY',
    typeLabel: 'Documentation',
    typeIcon: 'file'
  },
  {
    id: 'guide-4',
    title: 'SQL Basics',
    description: 'Introduction to relational databases and basic querying.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYaEdJ34FCPDWcMudfHfjj9M5EjXNShpNftkIy4YrPxaIQCMqktq-8ucU7m5aPJAUgGlEgKxz8B6kiVGQWrdPpcfYUCM44kaGp4VZzzBb4zZrJz_KJVCI3u0VUJ9n8-T8saiK0un2BwdI5I7Y_xolCby7cLsFh9RdzTfivcEdZ1phQrTlG5lqqIBMgKF2ClAV78bWQH4iXgegssd9zwBYCoO3KTf0VvS30FQaBlKb7ubHa2xz4tXsboJT2ZA_EMgRy4K6aEFOgm7Q',
    typeLabel: 'Interactive Lab',
    typeIcon: 'terminal'
  }
];

export const PROFESSIONAL_SKILLS: ProfessionalSkill[] = [
  {
    id: 'ps-1',
    title: 'Effective Communication',
    description: 'Mastering email etiquette and presentation skills.',
    iconName: 'message-square'
  },
  {
    id: 'ps-2',
    title: 'Time Management',
    description: 'Prioritizing tasks and managing deadlines effectively.',
    iconName: 'clock'
  },
  {
    id: 'ps-3',
    title: 'Collaborative Teamwork',
    description: 'Working across diverse teams and professional silos.',
    iconName: 'users'
  }
];

export const INTERNAL_SYSTEMS: InternalSystem[] = [
  {
    id: 'is-1',
    title: 'Time Entry Portal',
    description: 'Recording weekly billable and non-billable hours.',
    docType: 'PDF Guide'
  },
  {
    id: 'is-2',
    title: 'Benefit Enrollment',
    description: 'Managing your health and wellness selections.',
    docType: 'Video Walkthrough'
  },
  {
    id: 'is-3',
    title: 'West Monroe Intranet',
    description: 'Accessing firm-wide news and corporate policies.',
    docType: 'Internal Link'
  },
  {
    id: 'is-4',
    title: 'Office Keycard Access',
    description: 'Instructions for requesting physical office access.',
    docType: 'Article'
  }
];

export const VIDEO_TUTORIALS: VideoTutorial[] = [
  {
    id: 'vt-1',
    title: 'Intern Orientation 2024',
    description: 'Firm values and internship roadmap.',
    duration: '14:20',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAL21V-Dp8SPcaCRWly-g71A_XgATaigFDy5NuiB_QQq_nu7vSoALgvpte04ceyEFsKNEhg_snzFaYMr0fJJ3f6B5aQSA1Dmc49uGv1gxzQpJ7E-dM56Zz8ObNP9CD6OqvaKmn3s3ZNiUQU608NatmvOT9tVfW-NlFvK73Nl4SJKtJdrwV-DGBzwn2skQkGM5FLnl3xPCn-1a9u3M-2N6FRKqi7x5jG4jBRJPijxTE2_0q4tn8oBWrH3Z_sLyWcGqj6BTrgk48FA70'
  },
  {
    id: 'vt-2',
    title: 'ServiceNow Power User',
    description: 'Advanced automation and reporting.',
    duration: '08:45',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEghHV7_1X7cLGv94WMKa762x8aYKtGdR8oqZp8Ku-BUdsE9IkS4Sen8SO-o_fWXe2BOrLeAcYXpWp1MHYneFt0aEkvSmznjYfuaBmlHUFS72q1k_guEfvyBvvHgIowyg8_caGaQE7havNSlCup2h2CsNfXZloGTyJIY1LxzEdsVWgMgF3rDWS-oMPV2WibUA6_pzWwAlbw8Coh_ssHHK4vOdImznInsLf8b-NY7QP2fA0OxrYnth7ux7aKj4xGLrPAfu8WHEI5ds'
  },
  {
    id: 'vt-3',
    title: 'Consulting 101',
    description: 'The West Monroe approach to client delivery.',
    duration: '22:15',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkI9tFXUSqEQ8nTprzLpeixLiI5CDnZANgL3QWwoIL28zYOCIws749WmaFiG6AaRLKp3VIxZIf3D1NyLuyj8y9oVy4uXabt7-sm17i39vgwd7zIwxWGYBvFHrl45y4vhpB-iM3aS3Rz9q0axAmkEwumuux6fbMrp0kaeGJGG3N9HPTejHnDrurrcBgbc67IRuDfMEr8Rz2nGEZSrXG8iZxh8fEk1m2nztAk1Uf9x27g0YnJFYNssBx6KPPTWCE00MkS59VnD2CdYM'
  },
  {
    id: 'vt-4',
    title: 'Ethics & Compliance',
    description: 'Maintaining our standards of excellence.',
    duration: '12:30',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlhsJ5Cnd8p1XE5MyJ2UpWlxFTWHTm8MQ7_H5XUkD9N4XVQbkAGQfHXS2hcC3pxsSXZ34hKvWZeYYvB74Zr3pt-bqyI-7aLP9bCENkS8tFv8UNrfrSrfClNC0JmJpAIlvBzfjwUFYvM07XSDh0QxbSug49bgSQ3DhWncPmtYo1SxrzmJ-OzIzlY9_tJYJReX3IsGVGb8WJxPap0XXHV46-w0-CLajw83yLCq2NHQkFhvorrByj07gz3pnRFL5sEwNVOpXZmoohk-s'
  }
];

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'contact-1',
    name: 'Sarah Anderson',
    role: 'Career Advisor',
    department: 'Product Engineering',
    status: 'Willing to help',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhQBkLur8Qcnr9X1RQZ509yOk5irHztceU9QDrol70pd0ALSsY04zG7JPTFt-01omvuEqVTtHmYKJ61JsA-vXSMDmD-G2wvaEOzliTWd3IwyBV3z3RMf0_b6cVtCptqSeQCSUl0LD9bKaFDqW4AgJqZW7QO5yZRPzSb-HZTvpBtCc35rhlkufbXNyhW9z7H5SzVoBRzTJm2J7XszwPyrr4iLZUMOPSyY5YnSfXQre-8vaoiGYLT6pTbwD8WK16GBLWKsfe2uib4GI'
  },
  {
    id: 'contact-2',
    name: 'Marcus Chen',
    role: 'Mentor',
    department: 'Data & Analytics',
    status: 'Willing to help',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzU9z_XUzA2i2mRDEA3GdgFDX0fvc0gfA3XK4RSsMCLaM61CVwbedWRLchnKdVLIG9t-0jJsqPU3exxu2STW7SOxT8DHvCrSgaNfsEfSVAaWCXODjqLFWfDDSg6mzxHaMrjwRqFbe6SIZrTgbd0DXqKBV0nxZqOBjUJNnQlTMxpQXRXZ-rFZVk9XIlEUiibydxPAgcDtPkAs_SGdlHh87l_SiZ8R-B3n1rG4lDMMSDwHrstemlKethzRSdHXdOSrbvyqgXIGScxzY'
  },
  {
    id: 'contact-3',
    name: 'Jasmine Lee',
    role: 'Project Manager',
    department: 'Operations Excellence',
    status: 'In Meeting',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGdqcGBvWzX4W0pLtK6WK5xNDjzekwKynlTNOnSVihl0q0SrKpTV5UsU7Fgh7mdUCozYXSZzbcHKXnry8SQwoOIo3_MqdxFlC44NrKItrmou3Ip_3ywtFIOUV2mTk6wij7Lurwx64hu8f1ncQk9bMg5KctsKGNp-omd4g3H1CfK1sLqNdUGZWIM1QjZnb-LbVlz13B60JJ_n8eEmNxiavXUEhB3JZAIEVwjGbe2ABjV-ZQ_Ndwc_x5oe44U2PPSrCMDDD65BITo0w'
  },
  {
    id: 'contact-4',
    name: 'David Park',
    role: 'Mentor',
    department: 'Customer Experience',
    status: 'Willing to help',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuHLJxWkdtG2S4JlbozWO0jRwQCYOiUUc0sr6QTZXdp5SOZo36w-XRHV2awgXyM7yAII2Lt_onrAVcJhncH673qxiuzhfbmuvNFDrVrhOA0HwU5sQ7c_cQpbYy3m09MjRDYpfQkWf1dtj54dMcJOYHZnyYZoYP_VgnrXuMSiw84sicrx8N_SHH6W76sJYgcNRKvvhRuWxbQpKmDFsg7fUNpICWMesrlTeMMOvL2JCu4MfR1_SU46gjKzOxodgBJJWPi-4AYK-K6Kk'
  },
  {
    id: 'contact-5',
    name: 'Elena Rodriguez',
    role: 'Career Advisor',
    department: 'Product Engineering',
    status: 'Willing to help',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIZeHsQeLEk5ikBraGzVgdsJqjS2nl1WIjZmarGYhzjh4m-nRNMefLEZDmebvBYRze3hBdQJiv79B3SFapHeFXpb5jVlxYqE22ShIfQu6JkrK7kL_YdYbtH1k-18FggOBhHYqYmFKyg0RSPvjFUj3w8Oqv6ASx57Js3iIU71qmtiHvlIyu511SwpqThzshlpXZTH8i3VxW5ilKER2lmP1HXTC-ZtjgogrFFdoE3X3gDa2is3oUdjGcf4MQd9lYVhTFK4-_voJAjsM'
  },
  {
    id: 'contact-6',
    name: 'Thomas Wright',
    role: 'Project Manager',
    department: 'Data & Analytics',
    status: 'Offline',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBq150J1Esqj7wvuKg1A9Jlpt40Y6DPaXdD8hLk3kQMNdgL3OCYi0kWvQbRbo2zGoxsNbAEY4I7qozuozElACw38BLNXzm-5en7G3MSeCAZnxFadzLNYh2yZN7pjNnRbY6dxadX3OBNGgxb13IX9373iuHq6juTAZOHSMg1y7Q-G54EnV0YQTJXa_sw3St9lZtXe1fxn1fJYrZsQhlRww5G83uMS9k0meI8znmnWYdhSGoQSAwUroD1OxFgLColRVCGSTFw3ineWs'
  }
];

export const INITIAL_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'scheduling',
    question: 'How do I report my weekly hours?',
    answer: 'You should submit your hours through the "Project Board" tab by EOD every Friday. Ensure you categorize your hours correctly according to the project codes provided in your onboarding packet.'
  },
  {
    id: 'faq-2',
    category: 'scheduling',
    question: 'What is the policy for requesting a personal day?',
    answer: 'Personal days should be requested at least 72 hours in advance. Use the "Get Support" button to submit a request to your program coordinator.'
  },
  {
    id: 'faq-3',
    category: 'technical',
    question: "I'm having trouble with my Single Sign-On (SSO).",
    answer: 'Try clearing your browser cache and cookies first. If the problem persists, please contact the West Monroe IT Helpdesk at extension 1102.'
  },
  {
    id: 'faq-4',
    category: 'professional',
    question: 'What is the dress code for client meetings?',
    answer: 'Our firm standard is business casual (chinos, structured slacks, blouses, collared shirts, and dress shoes). When attending on-site client meetings, match the client’s environment but err on the side of high-contrast professionalism.'
  },
  {
    id: 'faq-5',
    category: 'technical',
    question: 'How do I configure my secure VPN tunnel connection?',
    answer: 'Initialize your GlobalProtect agent client, input "portal.westmonroe.com" as your gateway node, log in with password credentials, and complete mobile MFA push authorization.'
  },
  {
    id: 'faq-6',
    category: 'professional',
    question: 'How should I communicate a brief delay for standing sprints?',
    answer: 'Send a responsive alert message to your buddy/manager via Teams or Slack. Include an estimated timestamp of arrival (ETA), and review notes to catch up on any action items you missed.'
  }
];
