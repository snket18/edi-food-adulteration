import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Bell, Moon, Sun, Shield, Smartphone, Globe, Key } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [notifications, setNotifications] = useState(true);
  const [passwordSent, setPasswordSent] = useState(false);

  // Apply theme to the document HTML element so Tailwind catches it
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account preferences and application settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar Navigation */}
        <div className="space-y-1">
          <Button variant="secondary" className="w-full justify-start gap-2 shadow-sm">
            <Shield className="h-4 w-4" /> Account
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
            <Bell className="h-4 w-4" /> Notifications
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
            <Smartphone className="h-4 w-4" /> Device Integration
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
            <Globe className="h-4 w-4" /> Language & Region
          </Button>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your personal details and role information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-foreground">{user?.name || 'Unknown User'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-foreground">{user?.email || 'Not provided'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Role</p>
                <p className="text-foreground">{user?.role || 'USER'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how SpectraCheck looks on your device.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button 
                  variant={theme === 'light' ? 'default' : 'outline'} 
                  onClick={() => setTheme('light')}
                  className="flex-1 gap-2"
                >
                  <Sun className="h-4 w-4" /> Light
                </Button>
                <Button 
                  variant={theme === 'dark' ? 'default' : 'outline'} 
                  onClick={() => setTheme('dark')}
                  className="flex-1 gap-2"
                >
                  <Moon className="h-4 w-4" /> Dark
                </Button>
                <Button 
                  variant={theme === 'system' ? 'default' : 'outline'} 
                  onClick={() => setTheme('system')}
                  className="flex-1 gap-2"
                >
                  <Smartphone className="h-4 w-4" /> System
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Manage application behavior and alerts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md border">
                <div>
                  <p className="font-medium text-sm">Push Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive alerts for recent adulteration in your area.</p>
                </div>
                <button 
                  onClick={() => setNotifications(!notifications)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${notifications ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${notifications ? 'left-6' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md border opacity-60">
                <div>
                  <p className="font-medium text-sm">Auto-sync Offline Results</p>
                  <p className="text-xs text-muted-foreground">Sync pending tests when internet is restored.</p>
                </div>
                <button disabled className="w-11 h-6 rounded-full bg-primary relative cursor-not-allowed">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-6" />
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your security settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant={passwordSent ? "default" : "outline"}
                className={`w-full sm:w-auto gap-2 ${passwordSent ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                onClick={() => {
                  setPasswordSent(true);
                  setTimeout(() => setPasswordSent(false), 3000);
                }}
                disabled={passwordSent}
              >
                <Key className="h-4 w-4" /> 
                {passwordSent ? "Reset Link Sent to Email!" : "Change Password"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
