
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Calendar as CalendarIcon, 
  Menu, 
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  // Close mobile menu when location changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { href: '/', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5 mr-2" /> },
    { href: '/exercise-library', label: 'Exercise Library', icon: <Dumbbell className="h-5 w-5 mr-2" /> },
    { href: '/calendar', label: 'Calendar', icon: <CalendarIcon className="h-5 w-5 mr-2" /> },
  ];

  return (
    <header className="border-b border-border bg-white/80 backdrop-blur-md sticky top-0 z-40 w-full">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center font-semibold text-xl text-primary hover:opacity-80 transition-opacity"
        >
          <Dumbbell className="h-6 w-6 mr-2 text-primary" />
          FitTrack
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link key={item.href} to={item.href}>
              <Button
                variant={location.pathname === item.href ? "default" : "ghost"}
                className={cn(
                  "flex items-center px-4",
                  location.pathname === item.href ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.icon}
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Mobile Nav Toggle */}
        <Button 
          variant="ghost" 
          className="md:hidden" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <div className="md:hidden animate-fade-in fixed inset-0 top-16 bg-background/95 backdrop-blur-sm z-30">
          <div className="container mx-auto px-4 pt-4 pb-8">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link key={item.href} to={item.href} className="w-full">
                  <Button
                    variant={location.pathname === item.href ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start text-lg py-6",
                      location.pathname === item.href ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
