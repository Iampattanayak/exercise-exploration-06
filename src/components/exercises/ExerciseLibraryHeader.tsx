
import React from 'react';
import PageHeader from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { RefreshCw, BookOpen, Plus, Database } from 'lucide-react';

interface ExerciseLibraryHeaderProps {
  onRefresh: () => void;
  onAddExercise: () => void;
  onOpenCurated: () => void;
  onOpenBackup?: () => void;
}

const ExerciseLibraryHeader: React.FC<ExerciseLibraryHeaderProps> = ({
  onRefresh,
  onAddExercise,
  onOpenCurated,
  onOpenBackup,
}) => {
  return (
    <PageHeader
      title="Exercise Library"
      description="Browse and manage your exercises"
      action={
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={onOpenCurated}>
            <BookOpen className="h-4 w-4 mr-2" />
            Add Curated Exercises
          </Button>
          {onOpenBackup && (
            <Button variant="outline" size="sm" onClick={onOpenBackup}>
              <Database className="h-4 w-4 mr-2" />
              Backup & Restore
            </Button>
          )}
          <Button onClick={onAddExercise}>
            <Plus className="h-4 w-4 mr-2" />
            Add Exercise
          </Button>
        </div>
      }
    />
  );
};

export default ExerciseLibraryHeader;
