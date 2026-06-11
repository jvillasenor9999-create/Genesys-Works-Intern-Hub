export interface Task {
  id: string;
  title: string;
  status: 'backlog' | 'todo' | 'progress' | 'review' | 'done';
  type: 'Feature' | 'Bug Fix' | 'Opportunity' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
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
  avatar: string;
}

export interface FaqItem {
  id: string;
  category: 'scheduling' | 'technical' | 'professional';
  question: string;
  answer: string;
}

export type UserRole = 'admin' | 'intern';

export interface UserPermissions {
  allowInternsToDeleteTasks: boolean;
  allowInternsToCreateFAQ: boolean;
  allowInternsToSyncMeetings: boolean;
  allowInternsToSelfApproveMilestones: boolean;
}
