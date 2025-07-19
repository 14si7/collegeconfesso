import { useAuth } from '@/lib/auth';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { Moon, Sun, MessageCircle, LogOut } from 'lucide-react';
import { Link, useLocation } from 'wouter';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();

  const navItems = [
    { name: 'Confessions', path: '/', icon: MessageCircle },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 glass-card backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">
            Confessions
          </span>
        </Link>

        {/* Navigation Items */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <Link key={item.name} href={item.path}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className={`btn-hover ${isActive ? 'glow' : ''}`}
                  size="sm"
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="btn-hover"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Simple User Menu */}
          {user ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-muted-foreground">
                Welcome, {user.username}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="btn-hover"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="btn-hover">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="btn-hover glow gradient-bg text-white border-0">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}