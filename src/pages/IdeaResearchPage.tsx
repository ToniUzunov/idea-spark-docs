import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Sparkles,
  Lightbulb,
  Target,
  TrendingUp,
  AlertTriangle,
  Wrench,
  CheckCircle,
  Loader2,
  ChevronRight,
  FileText,
  History,
  Users,
  Globe,
  MessageSquare,
  Info,
  ArrowRight
} from 'lucide-react';
import { AIResearchResult, Idea } from '@/types';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Mock AI research generator
const generateMockResearch = (idea: Idea): Omit<AIResearchResult, 'id' | 'ideaId' | 'createdAt'> => {
  return {
    summary: {
      rewrite: `${idea.title} is a ${idea.goal === 'learning' ? 'learning-focused' : idea.goal === 'validation' ? 'validation-stage' : 'startup'} venture that aims to ${idea.problemSolved || 'solve a specific market problem'} through ${idea.proposedSolution || 'an innovative approach'}.`,
      assumptions: [
        `Target customers (${idea.targetAudience || 'the target market'}) actively seek solutions for this problem`,
        'Customers are willing to pay for a better solution than current alternatives',
        'The team has the capability to execute on the proposed solution',
        'Market conditions will remain favorable during development'
      ]
    },
    market: {
      audienceProfile: idea.targetAudience || 'General consumers interested in innovative solutions',
      audienceNeeds: [
        'Convenience and ease of use',
        'Cost-effective solutions',
        'Quality and reliability',
        'Personalized experience'
      ],
      marketSize: Math.random() > 0.5 ? 'large' : Math.random() > 0.5 ? 'medium' : 'small',
      marketSizeEstimate: `$${Math.floor(Math.random() * 50 + 5)}B globally (AI-estimated)`,
      trends: [
        `Growing interest in ${idea.industry || 'this sector'}`,
        'Increasing digital adoption accelerating market growth',
        'Consumer preferences shifting towards sustainable solutions',
        'Technology making solutions more accessible'
      ]
    },
    competitors: [
      {
        name: 'Established Player A',
        howTheySolve: 'Traditional approach with broad market presence',
        differentiation: `${idea.title} offers a more focused, ${idea.geography === 'local' ? 'locally-tailored' : 'globally-scalable'} solution`
      },
      {
        name: 'Startup Competitor B',
        howTheySolve: 'Tech-first approach targeting early adopters',
        differentiation: 'Different target segment and unique value proposition'
      },
      {
        name: 'Indirect Alternative C',
        howTheySolve: 'Partial solution through adjacent product/service',
        differentiation: 'More comprehensive and dedicated solution'
      }
    ],
    feasibility: {
      demandStrength: Math.random() > 0.6 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
      differentiationLevel: Math.random() > 0.5 ? 'medium' : Math.random() > 0.3 ? 'high' : 'low',
      executionDifficulty: Math.random() > 0.6 ? 'moderate' : Math.random() > 0.3 ? 'easy' : 'hard',
      risks: [
        'Market timing and competitive response',
        'Customer acquisition cost may be higher than expected',
        'Technical complexity in scaling the solution',
        'Regulatory or compliance considerations'
      ]
    },
    improvements: {
      quickWins: [
        'Create a landing page to validate interest before building',
        'Conduct 10 customer interviews in the next 2 weeks',
        'Build a simple prototype or mockup for feedback'
      ],
      pivots: [
        `Consider focusing on a specific niche within ${idea.targetAudience || 'the target market'} first`,
        'Explore a B2B angle if B2C proves challenging'
      ],
      mvpExperiment: `Launch a "concierge MVP" where you manually deliver the service to 5-10 customers to validate the core value proposition before building technology.`
    },
    verdict: {
      recommendation: idea.goal === 'learning' ? 'learning' : (Math.random() > 0.5 ? 'promising' : 'high-risk'),
      advice: idea.goal === 'learning' 
        ? 'This is a great learning opportunity. Focus on the process of customer discovery and lean experimentation rather than outcomes.'
        : `Given the ${idea.geography || 'local'} focus and ${idea.industry || 'market'} context, this idea has potential but requires thorough validation before significant investment.`,
      nextActions: [
        'Interview 10 potential customers in the next 2 weeks',
        'Analyze the top 3 competitors in detail',
        'Define success metrics for a small-scale test',
        'Create a one-page business model canvas'
      ],
      interviewQuestions: [
        'Tell me about the last time you experienced this problem?',
        'What solutions have you tried? What did you like/dislike?',
        'How often does this problem occur for you?',
        'Would you pay for a solution? How much would be reasonable?',
        'Who else do you know that faces this challenge?'
      ]
    }
  };
};

export default function IdeaResearchPage() {
  const { ideas, students, addResearchToIdea, updateIdea } = useStore();
  const [searchParams] = useSearchParams();
  const preselectedIdeaId = searchParams.get('ideaId');
  
  const [selectedIdeaId, setSelectedIdeaId] = useState<string>(preselectedIdeaId || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('form');
  const [teacherNotes, setTeacherNotes] = useState('');
  
  // Form state for new/custom idea input
  const [customForm, setCustomForm] = useState({
    title: '',
    description: '',
    problemSolved: '',
    proposedSolution: '',
    ownerType: 'student' as Idea['ownerType'],
    studentName: '',
    experienceLevel: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    targetAudience: '',
    industry: '',
    geography: 'local' as Idea['geography'],
    goal: 'learning' as Idea['goal']
  });

  const selectedIdea = ideas.find(i => i.id === selectedIdeaId);

  useEffect(() => {
    if (selectedIdea) {
      setCustomForm({
        title: selectedIdea.title,
        description: selectedIdea.description,
        problemSolved: selectedIdea.problemSolved || '',
        proposedSolution: selectedIdea.proposedSolution || '',
        ownerType: selectedIdea.ownerType,
        studentName: selectedIdea.studentIds.length > 0 
          ? students.find(s => s.id === selectedIdea.studentIds[0])?.name || ''
          : '',
        experienceLevel: selectedIdea.studentIds.length > 0
          ? students.find(s => s.id === selectedIdea.studentIds[0])?.experienceLevel || 'beginner'
          : 'beginner',
        targetAudience: selectedIdea.targetAudience || '',
        industry: selectedIdea.industry || '',
        geography: selectedIdea.geography || 'local',
        goal: selectedIdea.goal || 'learning'
      });
    }
  }, [selectedIdea, students]);

  const handleRunResearch = async () => {
    if (!customForm.title.trim()) {
      toast.error('Please enter an idea title');
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const mockIdea: Idea = {
      id: selectedIdeaId || 'temp',
      title: customForm.title,
      description: customForm.description,
      problemSolved: customForm.problemSolved,
      proposedSolution: customForm.proposedSolution,
      ownerType: customForm.ownerType,
      studentIds: [],
      targetAudience: customForm.targetAudience,
      industry: customForm.industry,
      geography: customForm.geography,
      goal: customForm.goal,
      status: 'researching',
      createdAt: new Date(),
      updatedAt: new Date(),
      aiResearchHistory: []
    };

    const research = generateMockResearch(mockIdea);
    
    if (selectedIdeaId && selectedIdea) {
      addResearchToIdea(selectedIdeaId, research);
      updateIdea(selectedIdeaId, { status: 'researching' });
    }
    
    setIsGenerating(false);
    setActiveTab('results');
    toast.success('AI research completed!');
  };

  const latestResearch = selectedIdea?.aiResearchHistory?.[0];

  const strengthColors = {
    low: 'text-red-600 bg-red-50',
    medium: 'text-amber-600 bg-amber-50',
    high: 'text-emerald-600 bg-emerald-50'
  };

  const difficultyColors = {
    easy: 'text-emerald-600 bg-emerald-50',
    moderate: 'text-amber-600 bg-amber-50',
    hard: 'text-red-600 bg-red-50'
  };

  const recommendationConfig = {
    learning: { label: 'Learning Project', color: 'bg-blue-100 text-blue-700', icon: Lightbulb },
    promising: { label: 'Promising Niche', color: 'bg-emerald-100 text-emerald-700', icon: TrendingUp },
    'high-risk': { label: 'High Risk', color: 'bg-amber-100 text-amber-700', icon: AlertTriangle }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          AI Idea Research
        </h1>
        <p className="text-muted-foreground mt-1">
          Get AI-powered market research, competitor analysis, and improvement suggestions
        </p>
      </div>

      {/* AI Disclaimer */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> AI insights are estimates based on available information and support decision-making, not replace human judgment. Always validate findings with real customer research.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Panel - Input Form */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="card-elevated">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-display">Research Input</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Idea Selection */}
              <div className="space-y-2">
                <Label>Select Existing Idea (Optional)</Label>
                <Select
                  value={selectedIdeaId}
                  onValueChange={(value) => setSelectedIdeaId(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an idea or enter new..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Enter new idea details</SelectItem>
                    {ideas.map(idea => (
                      <SelectItem key={idea.id} value={idea.id}>
                        {idea.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="space-y-2">
                  <Label>Idea Title *</Label>
                  <Input
                    value={customForm.title}
                    onChange={(e) => setCustomForm({ ...customForm, title: e.target.value })}
                    placeholder="Business idea name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={customForm.description}
                    onChange={(e) => setCustomForm({ ...customForm, description: e.target.value })}
                    placeholder="Describe the business idea..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Problem Being Solved</Label>
                  <Textarea
                    value={customForm.problemSolved}
                    onChange={(e) => setCustomForm({ ...customForm, problemSolved: e.target.value })}
                    placeholder="What problem does this solve?"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Proposed Solution</Label>
                  <Textarea
                    value={customForm.proposedSolution}
                    onChange={(e) => setCustomForm({ ...customForm, proposedSolution: e.target.value })}
                    placeholder="How does it solve the problem?"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Owner Type</Label>
                    <Select
                      value={customForm.ownerType}
                      onValueChange={(value: Idea['ownerType']) => 
                        setCustomForm({ ...customForm, ownerType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="team">Team</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="class">Class</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Experience Level</Label>
                    <Select
                      value={customForm.experienceLevel}
                      onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => 
                        setCustomForm({ ...customForm, experienceLevel: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Input
                    value={customForm.targetAudience}
                    onChange={(e) => setCustomForm({ ...customForm, targetAudience: e.target.value })}
                    placeholder="Who is this for?"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Industry</Label>
                    <Input
                      value={customForm.industry}
                      onChange={(e) => setCustomForm({ ...customForm, industry: e.target.value })}
                      placeholder="e.g., EdTech"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Geography</Label>
                    <Select
                      value={customForm.geography}
                      onValueChange={(value: Idea['geography']) => 
                        setCustomForm({ ...customForm, geography: value })
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
                </div>

                <div className="space-y-2">
                  <Label>Goal</Label>
                  <Select
                    value={customForm.goal}
                    onValueChange={(value: Idea['goal']) => 
                      setCustomForm({ ...customForm, goal: value })
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

              <Button 
                className="w-full mt-4 gap-2" 
                size="lg"
                onClick={handleRunResearch}
                disabled={isGenerating || !customForm.title.trim()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Run AI Research
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Research History */}
          {selectedIdea && selectedIdea.aiResearchHistory.length > 0 && (
            <Card className="card-elevated">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Research History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedIdea.aiResearchHistory.map((research, index) => (
                    <button
                      key={research.id}
                      onClick={() => setActiveTab('results')}
                      className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <p className="text-sm font-medium">
                        Research #{selectedIdea.aiResearchHistory.length - index}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(research.createdAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Panel - Results */}
        <div className="lg:col-span-2">
          {latestResearch ? (
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-6 pr-4">
                {/* Summary Section */}
                <Card className="card-elevated">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-display flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-primary" />
                      Idea Summary & Clarity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <p className="text-sm leading-relaxed">{latestResearch.summary.rewrite}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Key Assumptions:</p>
                      <ul className="space-y-2">
                        {latestResearch.summary.assumptions.map((assumption, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <ChevronRight className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                            {assumption}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Market Section */}
                <Card className="card-elevated">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-display flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Market & Audience Research
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Target Audience</p>
                        <p className="text-sm">{latestResearch.market.audienceProfile}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Market Size</p>
                        <Badge className={cn('capitalize', {
                          'bg-emerald-100 text-emerald-700': latestResearch.market.marketSize === 'large',
                          'bg-amber-100 text-amber-700': latestResearch.market.marketSize === 'medium',
                          'bg-slate-100 text-slate-700': latestResearch.market.marketSize === 'small'
                        })}>
                          {latestResearch.market.marketSize}
                        </Badge>
                        <p className="text-sm mt-1 text-muted-foreground">{latestResearch.market.marketSizeEstimate}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Audience Needs:</p>
                      <div className="flex flex-wrap gap-2">
                        {latestResearch.market.audienceNeeds.map((need, i) => (
                          <Badge key={i} variant="secondary">{need}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        Industry Trends:
                      </p>
                      <ul className="space-y-2">
                        {latestResearch.market.trends.map((trend, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            {trend}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Competitors Section */}
                <Card className="card-elevated">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-display flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Competitor Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {latestResearch.competitors.map((competitor, i) => (
                        <div key={i} className="p-4 rounded-lg border bg-card">
                          <h4 className="font-medium text-sm">{competitor.name}</h4>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium text-foreground">How they solve it:</span> {competitor.howTheySolve}
                            </p>
                            <p className="text-sm text-primary">
                              <span className="font-medium">Your differentiation:</span> {competitor.differentiation}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Feasibility Section */}
                <Card className="card-elevated">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-display flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-primary" />
                      Feasibility & Risks
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="p-4 rounded-lg bg-muted/50 text-center">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Demand Strength</p>
                        <Badge className={cn('capitalize', strengthColors[latestResearch.feasibility.demandStrength])}>
                          {latestResearch.feasibility.demandStrength}
                        </Badge>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50 text-center">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Differentiation</p>
                        <Badge className={cn('capitalize', strengthColors[latestResearch.feasibility.differentiationLevel])}>
                          {latestResearch.feasibility.differentiationLevel}
                        </Badge>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50 text-center">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Execution Difficulty</p>
                        <Badge className={cn('capitalize', difficultyColors[latestResearch.feasibility.executionDifficulty])}>
                          {latestResearch.feasibility.executionDifficulty}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Major Risks:</p>
                      <ul className="space-y-2">
                        {latestResearch.feasibility.risks.map((risk, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <AlertTriangle className="w-4 h-4 mt-0.5 text-amber-500 flex-shrink-0" />
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Improvements Section */}
                <Card className="card-elevated border-primary/20 bg-primary/[0.02]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-display flex items-center gap-2">
                      <Wrench className="w-5 h-5 text-primary" />
                      Improvements & Tweaks
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2 text-emerald-700">🚀 Quick Wins (do this week):</p>
                      <ul className="space-y-2">
                        {latestResearch.improvements.quickWins.map((win, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                            {win}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2 text-amber-700">🔄 Strategic Pivots:</p>
                      <ul className="space-y-2">
                        {latestResearch.improvements.pivots.map((pivot, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <ArrowRight className="w-4 h-4 mt-0.5 text-amber-500 flex-shrink-0" />
                            {pivot}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <p className="text-sm font-medium mb-1 text-primary">💡 Suggested MVP Experiment:</p>
                      <p className="text-sm">{latestResearch.improvements.mvpExperiment}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Verdict Section */}
                <Card className="card-elevated">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-display flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      Verdict & Next Steps
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(() => {
                      const config = recommendationConfig[latestResearch.verdict.recommendation];
                      const Icon = config.icon;
                      return (
                        <div className={cn('p-4 rounded-lg flex items-center gap-3', config.color)}>
                          <Icon className="w-6 h-6" />
                          <div>
                            <p className="font-medium">{config.label}</p>
                            <p className="text-sm opacity-80">{latestResearch.verdict.advice}</p>
                          </div>
                        </div>
                      );
                    })()}

                    <div>
                      <p className="text-sm font-medium mb-2">Next Actions:</p>
                      <div className="space-y-2">
                        {latestResearch.verdict.nextActions.map((action, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                            <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0 font-medium">
                              {i + 1}
                            </span>
                            <span className="text-sm">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        User Interview Questions:
                      </p>
                      <ul className="space-y-2">
                        {latestResearch.verdict.interviewQuestions.map((question, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground italic">
                            <span className="text-primary font-medium not-italic">{i + 1}.</span>
                            "{question}"
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Teacher Notes */}
                <Card className="card-elevated">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-display flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Teacher Notes (Private)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={teacherNotes}
                      onChange={(e) => setTeacherNotes(e.target.value)}
                      placeholder="Add your private notes about this research..."
                      rows={4}
                    />
                    <div className="flex justify-end mt-3">
                      <Button variant="outline" size="sm">Save Notes</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Export Options */}
                <Card className="card-elevated">
                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-3">
                      <Button variant="outline" className="gap-2">
                        <FileText className="w-4 h-4" />
                        Export Summary
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Users className="w-4 h-4" />
                        Share with Student
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          ) : (
            <Card className="card-elevated h-[400px] flex items-center justify-center">
              <CardContent className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-display font-semibold mb-2">Ready to Research</h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Fill in the idea details on the left and click "Run AI Research" to get comprehensive market analysis and improvement suggestions.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
