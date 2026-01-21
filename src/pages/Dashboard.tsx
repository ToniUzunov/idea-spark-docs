import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Lightbulb, 
  CheckSquare, 
  Receipt, 
  ArrowRight,
  Clock,
  Sparkles,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function Dashboard() {
  const { students, ideas, tasks, receipts } = useStore();
  
  const todoTasks = tasks.filter(t => t.status === 'todo');
  const highPriorityTasks = todoTasks.filter(t => t.priority === 'high');
  const pendingReceipts = receipts.filter(r => r.status === 'inbox');
  const activeIdeas = ideas.filter(i => i.status !== 'archived');

  const stats = [
    { 
      label: 'Students', 
      value: students.length, 
      icon: Users, 
      color: 'text-blue-600 bg-blue-100',
      link: '/students'
    },
    { 
      label: 'Active Ideas', 
      value: activeIdeas.length, 
      icon: Lightbulb, 
      color: 'text-purple-600 bg-purple-100',
      link: '/ideas'
    },
    { 
      label: 'Open Tasks', 
      value: todoTasks.length, 
      icon: CheckSquare, 
      color: 'text-emerald-600 bg-emerald-100',
      link: '/tasks'
    },
    { 
      label: 'Pending Receipts', 
      value: pendingReceipts.length, 
      icon: Receipt, 
      color: 'text-orange-600 bg-orange-100',
      link: '/receipts'
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">
          Welcome back! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your students and ideas today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.link}>
            <Card className="card-elevated card-hover cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Priority Tasks */}
        <Card className="card-elevated">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                Priority Tasks
              </CardTitle>
              <Link to="/tasks">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  View all <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {highPriorityTasks.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">
                No high priority tasks! 🎉
              </p>
            ) : (
              <div className="space-y-3">
                {highPriorityTasks.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{task.title}</p>
                      {task.dueDate && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          Due {format(new Date(task.dueDate), 'MMM d')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Ideas */}
        <Card className="card-elevated">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-purple-500" />
                Recent Ideas
              </CardTitle>
              <Link to="/ideas">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  View all <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {ideas.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">
                No ideas yet. Start adding some!
              </p>
            ) : (
              <div className="space-y-3">
                {ideas.slice(0, 4).map((idea) => (
                  <Link
                    key={idea.id}
                    to={`/ideas/${idea.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors block"
                  >
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{idea.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                        {idea.status} • {idea.ownerType}
                      </p>
                    </div>
                    {idea.aiResearchHistory.length > 0 && (
                      <span className="ai-indicator text-[10px]">
                        <Sparkles className="w-3 h-3" />
                        {idea.aiResearchHistory.length}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="card-elevated">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-display flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link to="/students">
              <Button variant="outline" className="w-full justify-start h-auto py-3 px-4">
                <Users className="w-5 h-5 mr-3 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium">Add Student</p>
                  <p className="text-xs text-muted-foreground">Register new student</p>
                </div>
              </Button>
            </Link>
            <Link to="/ideas">
              <Button variant="outline" className="w-full justify-start h-auto py-3 px-4">
                <Lightbulb className="w-5 h-5 mr-3 text-purple-600" />
                <div className="text-left">
                  <p className="font-medium">New Idea</p>
                  <p className="text-xs text-muted-foreground">Document an idea</p>
                </div>
              </Button>
            </Link>
            <Link to="/idea-research">
              <Button variant="outline" className="w-full justify-start h-auto py-3 px-4">
                <Sparkles className="w-5 h-5 mr-3 text-primary" />
                <div className="text-left">
                  <p className="font-medium">AI Research</p>
                  <p className="text-xs text-muted-foreground">Analyze an idea</p>
                </div>
              </Button>
            </Link>
            <Link to="/receipts">
              <Button variant="outline" className="w-full justify-start h-auto py-3 px-4">
                <Receipt className="w-5 h-5 mr-3 text-orange-600" />
                <div className="text-left">
                  <p className="font-medium">Scan Receipt</p>
                  <p className="text-xs text-muted-foreground">Upload & organize</p>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
