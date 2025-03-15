
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useExerciseData } from '@/hooks/useExerciseData';
import { Exercise, Category } from '@/lib/types';
import { useCategoryData } from '@/hooks/useCategoryData';

import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import ExerciseGrid from '@/components/exercises/ExerciseGrid';
import SearchBar from '@/components/exercises/SearchBar';
import CategoryFilter from '@/components/exercises/CategoryFilter';
import CategoryManager from '@/components/exercises/CategoryManager';
import AddExerciseDialog from '@/components/exercises/AddExerciseDialog';
import EditExerciseDialog from '@/components/exercises/EditExerciseDialog';
import DeleteExerciseDialog from '@/components/exercises/DeleteExerciseDialog';
import CuratedExercisesDialog from '@/components/exercises/CuratedExercisesDialog';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, BookOpen, FileText } from 'lucide-react';
import { toast } from 'sonner';

const ExerciseLibrary: React.FC = () => {
  const {
    exercises,
    categories,
    filteredExercises,
    exercisesLoading,
    categoriesLoading,
    exercisesError,
    categoriesError,
    searchTerm,
    selectedCategory,
    handleSearchChange,
    handleCategoryChange,
    handleCreateExercise,
    handleUpdateExercise,
    handleDeleteExercise,
    handleCreateMultipleExercises,
    refreshAllData
  } = useExerciseData();

  const {
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory
  } = useCategoryData();

  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false);
  const [isEditExerciseOpen, setIsEditExerciseOpen] = useState(false);
  const [isDeleteExerciseOpen, setIsDeleteExerciseOpen] = useState(false);
  const [isCuratedExercisesOpen, setIsCuratedExercisesOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  const handleOpenAddExercise = () => {
    if (categories.length === 0) {
      toast.error("Please create at least one category first");
      setShowCategoryManager(true);
      return;
    }
    setIsAddExerciseOpen(true);
  };

  const handleOpenCuratedExercises = () => {
    if (categories.length === 0) {
      toast.error("Please create at least one category first");
      setShowCategoryManager(true);
      return;
    }
    setIsCuratedExercisesOpen(true);
  };

  const handleOpenEditExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsEditExerciseOpen(true);
  };

  const handleOpenDeleteExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsDeleteExerciseOpen(true);
  };

  const handleDeleteExerciseSubmit = async () => {
    if (selectedExercise) {
      const success = await handleDeleteExercise(selectedExercise.id);
      if (success) {
        toast.success(`Deleted "${selectedExercise.name}" successfully`);
      }
      return success;
    }
    return false;
  };

  const handleUpdateExerciseSubmit = async (exerciseData: Partial<Exercise>, uploadedImage: File | null) => {
    if (!selectedExercise) return false;
    const success = await handleUpdateExercise(selectedExercise.id, exerciseData, uploadedImage);
    if (success) {
      toast.success(`Updated "${exerciseData.name}" successfully`);
    }
    return success;
  };

  const handleCreateExerciseSubmit = async (exerciseData: Partial<Exercise>, uploadedImage: File | null) => {
    const success = await handleCreateExercise(exerciseData, uploadedImage);
    if (success) {
      toast.success(`Created "${exerciseData.name}" successfully`);
    }
    return success;
  };

  const handleRefresh = () => {
    refreshAllData();
  };

  const toggleCategoryManager = () => {
    setShowCategoryManager(!showCategoryManager);
  };

  // Display error states if present
  if (exercisesError && !exercisesLoading) {
    console.error("Exercise loading error:", exercisesError);
  }
  
  if (categoriesError && !categoriesLoading) {
    console.error("Category loading error:", categoriesError);
  }

  return (
    <>
      <Helmet>
        <title>Exercise Library | FitTrack</title>
      </Helmet>
      <PageContainer>
        {!showCategoryManager ? (
          <>
            <PageHeader
              title="Exercise Library"
              description="Browse and manage your exercises"
              action={
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={handleRefresh}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleOpenCuratedExercises}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Add Curated Exercises
                  </Button>
                  <Button onClick={handleOpenAddExercise}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Exercise
                  </Button>
                </div>
              }
            />

            <div className="flex flex-col space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <SearchBar 
                    searchTerm={searchTerm} 
                    onSearchChange={handleSearchChange} 
                  />
                </div>
                <div className="flex-none">
                  <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                    onManageCategories={toggleCategoryManager}
                  />
                </div>
              </div>

              <ExerciseGrid 
                exercises={filteredExercises} 
                categories={categories}
                isLoading={exercisesLoading || categoriesLoading}
                onEdit={handleOpenEditExercise}
                onDelete={handleOpenDeleteExercise}
              />
              
              {filteredExercises.length === 0 && !exercisesLoading && (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No exercises found</h3>
                  <p className="text-muted-foreground mb-4">
                    {exercises.length === 0 
                      ? "Your exercise library is empty. Add your first exercise to get started."
                      : "No exercises match your current filters."}
                  </p>
                  {exercises.length === 0 && (
                    <Button onClick={handleOpenAddExercise}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Exercise
                    </Button>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <CategoryManager
            categories={categories}
            exercises={exercises}
            onBack={toggleCategoryManager}
            onCategoryAdd={handleAddCategory}
            onCategoryUpdate={handleUpdateCategory}
            onCategoryDelete={handleDeleteCategory}
          />
        )}

        <AddExerciseDialog
          isOpen={isAddExerciseOpen}
          onOpenChange={setIsAddExerciseOpen}
          categories={categories}
          onSubmit={handleCreateExerciseSubmit}
        />

        <EditExerciseDialog
          isOpen={isEditExerciseOpen}
          onOpenChange={setIsEditExerciseOpen}
          exercise={selectedExercise}
          categories={categories}
          onSubmit={handleUpdateExerciseSubmit}
          onDelete={() => handleOpenDeleteExercise(selectedExercise as Exercise)}
        />

        <DeleteExerciseDialog
          isOpen={isDeleteExerciseOpen}
          onOpenChange={setIsDeleteExerciseOpen}
          exercise={selectedExercise}
          onDelete={handleDeleteExerciseSubmit}
        />

        <CuratedExercisesDialog
          isOpen={isCuratedExercisesOpen}
          onOpenChange={setIsCuratedExercisesOpen}
          existingExercises={exercises}
          categories={categories}
          onAddExercises={handleCreateMultipleExercises}
        />
      </PageContainer>
    </>
  );
};

export default ExerciseLibrary;
