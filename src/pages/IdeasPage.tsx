import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Lightbulb,
  MoreVertical,
  Pencil,
  Trash2,
  Sparkles,
  ExternalLink,
  Users
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Idea } from '@/types';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function IdeasPage() {
  const { ideas, addIdea, updateIdea, deleteIdea, students } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | Idea['status']>('all');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    problemSolved: '',
    proposedSolution: '',
    ownerType: 'student' as Idea['ownerType'],
    studentIds: [] as string[],
    targetAudience: '',
    industry: '',
    geography: 'local' as Idea['geography'],
    goal: 'learning' as Idea['goal'],
    status: 'draft' as Idea['status']
  });

  const filteredIdeas = ideas.filter(idea => {
    if (statusFilter !== 'all' && idea.status !== statusFilter) return false;
    if (searchQuery) {
      return idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter an idea title');
      return;
    }

    if (editingIdea) {
      updateIdea(editingIdea.id, formData);
      toast.success('Idea updated successfully');
    } else {
      addIdea(formData);
      toast.success('Idea added successfully');
    }
    
    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      problemSolved: '',
      proposedSolution: '',
      ownerType: 'student',
      studentIds: [],
      targetAudience: '',
      industry: '',
      geography: 'local',
      goal: 'learning',
      status: 'draft'
    });
    setEditingIdea(null);
  };

  const handleEdit = (idea: Idea) => {
    setEditingIdea(idea);
    setFormData({
      title: idea.title,
      description: idea.description,
      problemSolved: idea.problemSolved || '',
      proposedSolution: idea.proposedSolution || '',
      ownerType: idea.ownerType,
      studentIds: idea.studentIds,
      targetAudience: idea.targetAudience || '',
      industry: idea.industry || '',
      geography: idea.geography || 'local',
      goal: idea.goal || 'learning',
      status: idea.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteIdea(id);
    toast.success('Idea deleted');
  };

  const getStudentNames = (studentIds: string[]) => {
    return studentIds
      .map(id => students.find(s => s.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const statusColors = {
    draft: 'bg-slate-100 text-slate-700 border-slate-200',
    researching: 'bg-blue-100 text-blue-700 border-blue-200',
    validated: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    archived: 'bg-gray-100 text-gray-500 border-gray-200'
  };

  const goalLabels = {
    learning: 'Learning Project',
    validation: 'Validation',
    startup: 'Startup Attempt'
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <Lightbulb className="w-7 h-7 text-idea" />
            Ideas
          </h1>
          <p className="text-muted-foreground mt-1">
            Document and track student business ideas
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Idea
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">
                {editingIdea ? 'Edit Idea' : 'Document New Idea'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Idea Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., EcoWear - Sustainable Fashion Marketplace"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the business idea in detail..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="problem">Problem Being Solved</Label>
                  <Textarea
                    id="problem"
                    value={formData.problemSolved}
                    onChange={(e) => setFormData({ ...formData, problemSolved: e.target.value })}
                    placeholder="What problem does this solve?"
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="solution">Proposed Solution</Label>
                  <Textarea
                    id="solution"
                    value={formData.proposedSolution}
                    onChange={(e) => setFormData({ ...formData, proposedSolution: e.target.value })}
                    placeholder="How does it solve the problem?"
                    rows={2}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ownerType">Idea Owner</Label>
                  <Select
                    value={formData.ownerType}
                    onValueChange={(value: Idea['ownerType']) => 
                      setFormData({ ...formData, ownerType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="team">Team</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="class">Class Exercise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="goal">Goal</Label>
                  <Select
                    value={formData.goal}
                    onValueChange={(value: Idea['goal']) => 
                      setFormData({ ...formData, goal: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="learning">Learning Project</SelectItem>
                      <SelectItem value="validation">Validation</SelectItem>
                      <SelectItem value="startup">Startup Attempt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="audience">Target Audience</Label>
                  <Input
                    id="audience"
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    placeholder="Who is this for?"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="e.g., EdTech, Fashion"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="geography">Geography</Label>
                  <Select
                    value={formData.geography}
                    onValueChange={(value: Idea['geography']) => 
                      setFormData({ ...formData, geography: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Local</SelectItem>
                      <SelectItem value="national">National</SelectItem>
                      <SelectItem value="global">Global</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: Idea['status']) => 
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="researching">Researching</SelectItem>
                      <SelectItem value="validated">Validated</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingIdea ? 'Update' : 'Save Idea'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search ideas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          {(['all', 'draft', 'researching', 'validated', 'archived'] as const).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Ideas Grid */}
      {filteredIdeas.length === 0 ? (
        <Card className="card-elevated">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Lightbulb className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-center">
              {searchQuery || statusFilter !== 'all' 
                ? 'No ideas match your filters' 
                : 'No ideas yet. Document your first idea!'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredIdeas.map((idea) => (
            <Card key={idea.id} className="card-elevated card-hover group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={statusColors[idea.status]}>
                        {idea.status}
                      </Badge>
                      {idea.aiResearchHistory.length > 0 && (
                        <span className="ai-indicator text-[10px]">
                          <Sparkles className="w-3 h-3" />
                          {idea.aiResearchHistory.length} research
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground line-clamp-2">
                      {idea.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {idea.description}
                    </p>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(idea)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(idea.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {idea.industry && (
                      <Badge variant="secondary" className="text-xs">
                        {idea.industry}
                      </Badge>
                    )}
                    {idea.goal && (
                      <Badge variant="secondary" className="text-xs">
                        {goalLabels[idea.goal]}
                      </Badge>
                    )}
                  </div>
                  
                  {idea.studentIds.length > 0 && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {getStudentNames(idea.studentIds)}
                    </p>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Updated {format(new Date(idea.updatedAt), 'MMM d, yyyy')}
                  </span>
                  <Link to={`/idea-research?ideaId=${idea.id}`}>
                    <Button size="sm" variant="ghost" className="gap-1 text-primary">
                      <Sparkles className="w-3 h-3" />
                      Research
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
