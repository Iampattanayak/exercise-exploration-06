
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Dumbbell, Calendar, LayoutDashboard, Plus } from 'lucide-react';

const AppNavigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <NavigationMenu className="max-w-full justify-end">
      <NavigationMenuList className="gap-2">
        <NavigationMenuItem>
          <Link to="/">
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(),
                isActive('/') && "bg-accent text-accent-foreground font-medium"
              )}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/exercises">
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(),
                isActive('/exercises') && "bg-accent text-accent-foreground font-medium"
              )}
            >
              <Dumbbell className="h-4 w-4 mr-2" />
              Exercises
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/calendar">
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(),
                isActive('/calendar') && "bg-accent text-accent-foreground font-medium"
              )}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/workout/new">
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(),
                isActive('/workout/new') && "bg-accent text-accent-foreground font-medium"
              )}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Workout
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default AppNavigation;
