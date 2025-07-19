import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'wouter';

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const [location] = useLocation();

  return (
    <header className="bg-background shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold text-foreground cursor-pointer">Confessions</h1>
            </Link>
            <span className="ml-2 text-sm text-muted-foreground">Share your truth</span>
          </div>
          
          <nav className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground">Welcome, {user?.username}</span>
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className={location === '/login' ? 'bg-muted' : ''}>
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className={location === '/register' ? 'bg-primary/90' : ''}>
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
