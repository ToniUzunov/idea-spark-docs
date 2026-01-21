import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings, User, Bell, Shield, Palette, Database } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <Settings className="w-7 h-7 text-muted-foreground" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your MentorDesk preferences
        </p>
      </div>

      {/* Profile */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-lg font-display flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-semibold text-primary">T</span>
            </div>
            <div>
              <p className="font-medium">Teacher Account</p>
              <p className="text-sm text-muted-foreground">teacher@school.edu</p>
            </div>
          </div>
          <Button variant="outline">Edit Profile</Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-lg font-display flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Task reminders</Label>
              <p className="text-sm text-muted-foreground">Get notified about upcoming deadlines</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>AI research complete</Label>
              <p className="text-sm text-muted-foreground">Notify when AI analysis finishes</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Receipt reminders</Label>
              <p className="text-sm text-muted-foreground">Monthly expense summaries</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-lg font-display flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Dark mode</Label>
              <p className="text-sm text-muted-foreground">Use dark theme</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Compact view</Label>
              <p className="text-sm text-muted-foreground">Show more items per page</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Data */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-lg font-display flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            Export all data
          </Button>
          <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
            Clear all data
          </Button>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-lg font-display flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline">Change password</Button>
          <Button variant="outline">Manage connected accounts</Button>
        </CardContent>
      </Card>
    </div>
  );
}
