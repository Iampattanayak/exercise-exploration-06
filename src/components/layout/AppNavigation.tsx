
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, 
  Dumbbell, 
  Calendar as CalendarIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const AppNavigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { href: '/', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5 mr-2" /> },
    { href: '/exercises', label: 'Exercise Library', icon: <Dumbbell className="h-5 w-5 mr-2" /> },
    { href: '/calendar', label: 'Calendar', icon: <CalendarIcon className="h-5 w-5 mr-2" /> }
  ];

  return (
    <nav className="flex items-center space-x-1">
      {navItems.map((item) => (
        <Link key={item.href} to={item.href}>
          <Button
            variant={isActive(item.href) ? "default" : "ghost"}
            className={cn(
              "flex items-center px-4",
              isActive(item.href) ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.icon}
            {item.label}
          </Button>
        </Link>
      ))}
    </nav>
  );
};

export default AppNavigation;
