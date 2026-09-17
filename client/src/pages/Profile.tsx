import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { User, Mail, Shield, LogOut } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) {
    return null; // Handled by ProtectedRoute
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground mt-1">
          Manage your account information and preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>
            Your current SpectraCheck identity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="flex items-center gap-4 p-4 border rounded-md bg-muted/20">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold uppercase">
              {user.name.substring(0, 2)}
            </div>
            <div>
              <h3 className="text-lg font-medium">{user.name}</h3>
              <p className="text-sm text-muted-foreground">ID: {user.id}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b">
              <User className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Full Name</p>
                <p className="text-sm text-muted-foreground">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pb-3 border-b">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email Address</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pb-3 border-b">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Role & Permissions</p>
                <p className="text-sm text-muted-foreground capitalize">{user.role.toLowerCase()}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
             <Button variant="destructive" onClick={logout} className="gap-2">
               <LogOut className="w-4 h-4" />
               Sign Out
             </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
