import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Activity, Beaker, FileText, LayoutDashboard, Map as MapIcon, Settings, User as UserIcon, Menu, X, Search, ShieldCheck, LogOut } from 'lucide-react';
import { cn } from '../utils/utils';
import { useAuth } from '../contexts/AuthContext';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const consumerNav: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'New Test', href: '/test', icon: Beaker },
  { name: 'Test History', href: '/history', icon: FileText },
  { name: 'Profile', href: '/profile', icon: UserIcon },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const inspectorNav: NavItem[] = [
  ...consumerNav, // Depending on requirements, inspectors may also need dashboard, or just monitoring.
  { name: 'Monitoring', href: '/monitoring', icon: Activity },
  { name: 'Analytics', href: '/analytics', icon: Search },
  { name: 'Map', href: '/map', icon: MapIcon },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Admin Tests', href: '/tests', icon: FileText },
];

export default function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const isPrivileged = user?.role === 'INSPECTOR' || user?.role === 'ADMIN';
  const navigation = isPrivileged ? inspectorNav : consumerNav;

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-card border-b no-print">
        <div className="flex items-center gap-2 text-primary font-bold text-xl">
          <ShieldCheck className="h-6 w-6" />
          SpectraCheck
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 -mr-2 text-muted-foreground">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Desktop & Mobile */}
      <aside className={cn(
        "bg-card border-r w-full md:w-64 flex-shrink-0 flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 fixed md:sticky top-0 z-40 h-screen no-print",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div>
            <div className="hidden md:flex items-center gap-2 p-6 text-primary font-bold text-2xl border-b">
              <ShieldCheck className="h-7 w-7" />
              SpectraCheck
            </div>
            <nav className="p-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
          
          <div className="mt-auto p-4 border-t">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold uppercase">
                  {user?.name?.substring(0, 2) || 'U'}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium truncate">{user?.name || 'User'}</span>
                  <span className="text-xs text-muted-foreground">{user?.role || 'Role'}</span>
                </div>
              </div>
              <button 
                onClick={logout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden w-full">
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between p-6 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-30 no-print">
          <h2 className="text-lg font-semibold text-foreground capitalize">
            {location.pathname.split('/')[1] || 'Dashboard'}
          </h2>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
