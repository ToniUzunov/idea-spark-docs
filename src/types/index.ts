// Core types for MentorDesk

export interface Student {
  id: string;
  name: string;
  email?: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Date;
  notes?: string;
  avatar?: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  problemSolved?: string;
  proposedSolution?: string;
  ownerType: 'student' | 'team' | 'teacher' | 'class';
  studentIds: string[];
  targetAudience?: string;
  industry?: string;
  geography?: 'local' | 'national' | 'global';
  goal?: 'learning' | 'validation' | 'startup';
  status: 'draft' | 'researching' | 'validated' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  aiResearchHistory: AIResearchResult[];
  teacherNotes?: string;
}

export interface AIResearchResult {
  id: string;
  ideaId: string;
  createdAt: Date;
  
  // Summary & Clarity
  summary: {
    rewrite: string;
    assumptions: string[];
  };
  
  // Market & Audience
  market: {
    audienceProfile: string;
    audienceNeeds: string[];
    marketSize: 'small' | 'medium' | 'large';
    marketSizeEstimate: string;
    trends: string[];
  };
  
  // Competitors
  competitors: {
    name: string;
    howTheySolve: string;
    differentiation: string;
  }[];
  
  // Feasibility
  feasibility: {
    demandStrength: 'low' | 'medium' | 'high';
    differentiationLevel: 'low' | 'medium' | 'high';
    executionDifficulty: 'easy' | 'moderate' | 'hard';
    risks: string[];
  };
  
  // Improvements
  improvements: {
    quickWins: string[];
    pivots: string[];
    mvpExperiment: string;
  };
  
  // Verdict
  verdict: {
    recommendation: 'learning' | 'promising' | 'high-risk';
    advice: string;
    nextActions: string[];
    interviewQuestions: string[];
  };
  
  teacherNotes?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'done';
  category?: string;
  dueDate?: Date;
  linkedIdeaId?: string;
  linkedStudentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Receipt {
  id: string;
  fileName: string;
  fileUrl?: string;
  fileType: 'image' | 'pdf';
  
  // OCR extracted data
  merchant?: string;
  date?: Date;
  totalAmount?: number;
  taxAmount?: number;
  currency?: string;
  invoiceNumber?: string;
  
  // AI analysis
  category: string;
  suggestedCategory?: string;
  tags: string[];
  aiDescription?: string;
  aiConfidence?: number;
  
  // Organization
  status: 'inbox' | 'categorized' | 'exported';
  googleDriveUrl?: string;
  googleDocUrl?: string;
  
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export interface ReceiptCategory {
  id: string;
  name: string;
  color: string;
  icon?: string;
  isDefault: boolean;
}

export const DEFAULT_CATEGORIES: ReceiptCategory[] = [
  { id: 'travel', name: 'Travel', color: '#3B82F6', isDefault: true },
  { id: 'meals', name: 'Meals', color: '#F59E0B', isDefault: true },
  { id: 'office', name: 'Office Supplies', color: '#10B981', isDefault: true },
  { id: 'events', name: 'Events', color: '#8B5CF6', isDefault: true },
  { id: 'software', name: 'Software & Subscriptions', color: '#EC4899', isDefault: true },
  { id: 'equipment', name: 'Equipment', color: '#6366F1', isDefault: true },
  { id: 'inbox', name: 'Inbox / Unsorted', color: '#6B7280', isDefault: true },
];
