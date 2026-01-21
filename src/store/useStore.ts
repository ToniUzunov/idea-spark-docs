import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Student, Idea, Task, Receipt, ReceiptCategory, DEFAULT_CATEGORIES, AIResearchResult } from '@/types';

interface AppState {
  // Students
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'createdAt'>) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  
  // Ideas
  ideas: Idea[];
  addIdea: (idea: Omit<Idea, 'id' | 'createdAt' | 'updatedAt' | 'aiResearchHistory'>) => void;
  updateIdea: (id: string, updates: Partial<Idea>) => void;
  deleteIdea: (id: string) => void;
  addResearchToIdea: (ideaId: string, research: Omit<AIResearchResult, 'id' | 'ideaId' | 'createdAt'>) => void;
  
  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  // Receipts
  receipts: Receipt[];
  receiptCategories: ReceiptCategory[];
  addReceipt: (receipt: Omit<Receipt, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateReceipt: (id: string, updates: Partial<Receipt>) => void;
  deleteReceipt: (id: string) => void;
  addCategory: (category: Omit<ReceiptCategory, 'id'>) => void;
  deleteCategory: (id: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Students
      students: [
        {
          id: '1',
          name: 'Alex Johnson',
          email: 'alex.johnson@school.edu',
          experienceLevel: 'intermediate',
          createdAt: new Date('2024-01-15'),
          notes: 'Passionate about sustainable fashion'
        },
        {
          id: '2',
          name: 'Maria Garcia',
          email: 'maria.g@school.edu',
          experienceLevel: 'beginner',
          createdAt: new Date('2024-02-01'),
          notes: 'First-time entrepreneur, very motivated'
        },
        {
          id: '3',
          name: 'James Chen',
          email: 'j.chen@school.edu',
          experienceLevel: 'advanced',
          createdAt: new Date('2024-01-20'),
          notes: 'Has prior startup experience in tech'
        }
      ],
      
      addStudent: (student) => set((state) => ({
        students: [...state.students, {
          ...student,
          id: generateId(),
          createdAt: new Date()
        }]
      })),
      
      updateStudent: (id, updates) => set((state) => ({
        students: state.students.map(s => s.id === id ? { ...s, ...updates } : s)
      })),
      
      deleteStudent: (id) => set((state) => ({
        students: state.students.filter(s => s.id !== id)
      })),
      
      // Ideas
      ideas: [
        {
          id: '1',
          title: 'EcoWear - Sustainable Fashion Marketplace',
          description: 'An online marketplace connecting sustainable fashion brands with environmentally conscious consumers',
          problemSolved: 'Difficulty finding verified sustainable fashion options',
          proposedSolution: 'Curated marketplace with sustainability verification badges',
          ownerType: 'student',
          studentIds: ['1'],
          targetAudience: 'Millennials and Gen Z interested in sustainable living',
          industry: 'Fashion & Retail',
          geography: 'national',
          goal: 'validation',
          status: 'draft',
          createdAt: new Date('2024-02-10'),
          updatedAt: new Date('2024-02-10'),
          aiResearchHistory: []
        },
        {
          id: '2',
          title: 'StudyBuddy - AI Tutoring Assistant',
          description: 'An AI-powered tutoring app that adapts to student learning styles',
          problemSolved: 'One-size-fits-all tutoring doesn\'t work for all students',
          proposedSolution: 'AI that learns how each student learns best',
          ownerType: 'team',
          studentIds: ['2', '3'],
          targetAudience: 'High school and college students',
          industry: 'EdTech',
          geography: 'global',
          goal: 'startup',
          status: 'researching',
          createdAt: new Date('2024-02-15'),
          updatedAt: new Date('2024-02-15'),
          aiResearchHistory: []
        }
      ],
      
      addIdea: (idea) => set((state) => ({
        ideas: [...state.ideas, {
          ...idea,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
          aiResearchHistory: []
        }]
      })),
      
      updateIdea: (id, updates) => set((state) => ({
        ideas: state.ideas.map(i => i.id === id ? { ...i, ...updates, updatedAt: new Date() } : i)
      })),
      
      deleteIdea: (id) => set((state) => ({
        ideas: state.ideas.filter(i => i.id !== id)
      })),
      
      addResearchToIdea: (ideaId, research) => set((state) => ({
        ideas: state.ideas.map(idea => {
          if (idea.id === ideaId) {
            return {
              ...idea,
              updatedAt: new Date(),
              aiResearchHistory: [
                {
                  ...research,
                  id: generateId(),
                  ideaId,
                  createdAt: new Date()
                },
                ...idea.aiResearchHistory
              ]
            };
          }
          return idea;
        })
      })),
      
      // Tasks
      tasks: [
        {
          id: '1',
          title: 'Review Alex\'s business plan draft',
          description: 'Check the financial projections and market analysis sections',
          priority: 'high',
          status: 'todo',
          category: 'Review',
          linkedStudentId: '1',
          createdAt: new Date('2024-02-18'),
          updatedAt: new Date('2024-02-18')
        },
        {
          id: '2',
          title: 'Schedule pitch practice session',
          description: 'Set up a mock pitch session for the team',
          priority: 'medium',
          status: 'in-progress',
          category: 'Meeting',
          linkedIdeaId: '2',
          createdAt: new Date('2024-02-17'),
          updatedAt: new Date('2024-02-17')
        },
        {
          id: '3',
          title: 'Submit grant application',
          description: 'Complete and submit the entrepreneurship education grant',
          priority: 'high',
          status: 'todo',
          category: 'Admin',
          dueDate: new Date('2024-03-01'),
          createdAt: new Date('2024-02-15'),
          updatedAt: new Date('2024-02-15')
        }
      ],
      
      addTask: (task) => {
        const newTask: Task = {
          ...task,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        set((state) => ({
          tasks: [...state.tasks, newTask]
        }));
        return newTask;
      },
      
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t)
      })),
      
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
      })),
      
      // Receipts
      receipts: [],
      receiptCategories: DEFAULT_CATEGORIES,
      
      addReceipt: (receipt) => set((state) => ({
        receipts: [...state.receipts, {
          ...receipt,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date()
        }]
      })),
      
      updateReceipt: (id, updates) => set((state) => ({
        receipts: state.receipts.map(r => r.id === id ? { ...r, ...updates, updatedAt: new Date() } : r)
      })),
      
      deleteReceipt: (id) => set((state) => ({
        receipts: state.receipts.filter(r => r.id !== id)
      })),
      
      addCategory: (category) => set((state) => ({
        receiptCategories: [...state.receiptCategories, { ...category, id: generateId() }]
      })),
      
      deleteCategory: (id) => set((state) => ({
        receiptCategories: state.receiptCategories.filter(c => c.id !== id)
      }))
    }),
    {
      name: 'mentordesk-storage',
      partialize: (state) => ({
        students: state.students,
        ideas: state.ideas,
        tasks: state.tasks,
        receipts: state.receipts,
        receiptCategories: state.receiptCategories
      })
    }
  )
);
