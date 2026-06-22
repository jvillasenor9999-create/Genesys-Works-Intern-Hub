export interface Task {
  id: string;
  title: string;
  status: 'backlog' | 'todo' | 'progress' | 'review' | 'done';
  type: 'Feature' | 'Bug Fix' | 'Opportunity' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  assigneeUserId?: string;
  assignee?: {
    name: string;
    avatar: string;
  };
  commentsCount?: number;
  progress?: number; // 0 to 100 for progress bars
  description?: string;
  startDaysOffset?: number;
  durationDays?: number;
  comments?: {
    id: string;
    author: string;
    avatar: string;
    text: string;
    date: string;
  }[];
}

export interface ProjectMilestone {
  id: string;
  title: string;
  date: string;
  category: 'architecture' | 'delivery' | 'review' | 'presentation' | 'intern';
  status: 'completed' | 'current' | 'upcoming';
  description?: string;
  createdByUserId?: string;
  createdByName?: string;
}

export interface Shoutout {
  id: string;
  nominee: string;
  nomineeAvatar: string;
  text: string;
  recognizedBy: string;
  timeAgo: string;
  starred?: boolean;
}

export interface QuickLink {
  id: string;
  title: string;
  iconName: string; // name matching Lucide icon identifier
}

export interface Meeting {
  id: string;
  title: string;
  dateMonth: string;
  dateDay: string;
  time: string;
  location: string;
}

export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming' | 'locked';
  subtasks?: { label: string; checked: boolean }[];
  category: 'pre-arrival' | 'week-1' | '30-day';
  actionLabel?: string;
  actionGuide?: string;
}

export interface OnboardingContentSlot {
  id: string;
  title: string;
  description: string;
}

export interface OnboardingCultureValuesContent {
  eyebrow: string;
  title: string;
  description: string;
  expectations: OnboardingContentSlot[];
  values: OnboardingContentSlot[];
  footerNote: string;
}

export interface TechnicalGuide {
  id: string;
  title: string;
  description: string;
  image: string;
  typeLabel: string;
  typeIcon: 'book' | 'video' | 'file' | 'terminal';
}

export interface ProfessionalSkill {
  id: string;
  title: string;
  description: string;
  iconName: 'message-square' | 'clock' | 'users';
}

export interface InternalSystem {
  id: string;
  title: string;
  description: string;
  docType: string;
}

export interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
}

export interface Contact {
  id: string;
  name: string;
  role: 'Career Advisor' | 'Mentor' | 'Project Manager';
  department: 'Product Engineering' | 'Customer Experience' | 'Operations Excellence' | 'Data & Analytics';
  status: 'Willing to help' | 'In Meeting' | 'Offline';
  email: string;
  linkedinUrl?: string;
  avatar: string;
}

export interface MentorVolunteerRequest {
  id: string;
  name: string;
  email: string;
  linkedinUrl?: string;
  interestedRoles: string[];
  submittedAt: string;
  status: 'pending' | 'approved' | 'declined';
}

export interface FaqItem {
  id: string;
  category: 'scheduling' | 'technical' | 'professional';
  question: string;
  answer: string;
  status?: 'published' | 'pending';
  submittedDetails?: string;
  answeredAt?: string;
}

export type UserRole = 'admin' | 'intern';

export type InternHardwarePreference = 'MacBook Pro' | 'Lenovo ThinkPad';

export type InternMentorPreference = 'Marcus Chen' | 'David Park' | 'Sarah Anderson';

export type ManagedUserRole = 'Administrator' | 'Program Coordinator' | 'Technical Mentor' | 'Summer Intern';

export type ManagedUserDepartment = 'Product Engineering' | 'Data & Analytics' | 'Customer Experience' | 'Operations' | 'Career Development';

export interface InternProfile {
  id: string;
  name: string;
  email: string;
  hardwarePreference: InternHardwarePreference;
  mentorPreference: InternMentorPreference;
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: ManagedUserRole;
  department: ManagedUserDepartment;
  status: 'Active' | 'On Vacation' | 'Provisioning' | 'Inactive';
  lastLogin: string;
  hardware: InternHardwarePreference;
  avatar: string;
  mentorPreference?: InternMentorPreference;
}

export type CohortChecklistCategory = 'Pre-Arrival' | 'Week 1' | '30-Day';

export interface CohortChecklistItem {
  id: string;
  title: string;
  category: CohortChecklistCategory;
  checked: boolean;
}

export type CohortCourseType = 'video' | 'lab' | 'course';

export interface CohortCourse {
  id: string;
  title: string;
  progress: number;
  category: string;
  type: CohortCourseType;
}

export interface CohortInternProfile {
  userId: string;
  onboardingChecklist: CohortChecklistItem[];
  courses: CohortCourse[];
}

export interface UserPermissions {
  allowInternsToDeleteTasks: boolean;
  allowInternsToCreateFAQ: boolean;
  allowInternsToSyncMeetings: boolean;
  allowInternsToSelfApproveMilestones: boolean;
}
