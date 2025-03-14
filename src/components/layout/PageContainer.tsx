
import React from "react";
import AppNavigation from "./AppNavigation";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, className = "" }) => {
  return (
    <div className={`container mx-auto px-4 py-8 animate-fade-in ${className}`}>
      <div className="mb-6">
        <AppNavigation />
      </div>
      <div>
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
