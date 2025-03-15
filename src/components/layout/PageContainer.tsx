
import React from "react";
import { Link } from "react-router-dom";
import { Dumbbell } from "lucide-react";
import AppNavigation from "./AppNavigation";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, className = "" }) => {
  return (
    <div className="animate-fade-in font-inter">
      <header className="border-b border-border bg-white/80 backdrop-blur-md sticky top-0 z-40 w-full">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center font-semibold text-xl text-primary hover:opacity-80 transition-opacity"
          >
            <Dumbbell className="h-6 w-6 mr-2 text-primary" />
            FitTrack
          </Link>

          <AppNavigation />
        </div>
      </header>
      
      <div className={`container mx-auto px-4 py-8 ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
