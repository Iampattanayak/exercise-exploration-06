
import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  action, 
  icon,
  className
}) => {
  return (
    <div className={cn(
      "mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
      className
    )}>
      <div className="flex items-center gap-3">
        {icon && <div className="text-primary">{icon}</div>}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="mt-1 text-lg text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {action && <div className="mt-4 sm:mt-0">{action}</div>}
    </div>
  );
};

export default PageHeader;
