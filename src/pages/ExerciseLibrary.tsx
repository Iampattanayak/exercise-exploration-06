
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useExerciseData } from '@/hooks/useExerciseData';
import { Exercise } from '@/lib/types';
import { toast } from 'sonner';

import PageContainer from '@/components/layout/PageContainer';
import ExerciseGrid from '@/components/exercises/ExerciseGrid';
import CategoryManager from '@/components/exercises/CategoryManager';
import { useCategoryData } from '@/hooks/useCategoryData';
import ExerciseLibraryHeader from '@/components/exercises/ExerciseLibraryHeader';
import FilterSection from '@/components/exercises/FilterSection';
import EmptyExerciseState from '@/components/exercises/EmptyExerciseState';
import ExerciseDialogs from '@/components/exercises/ExerciseDialogs';

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

  const handleClearFilters = () => {
    handleSearchChange('');
    handleCategoryChange('');
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
            <ExerciseLibraryHeader 
              onRefresh={refreshAllData}
              onAddExercise={handleOpenAddExercise}
              onOpenCurated={handleOpenCuratedExercises}
            />

            <div className="flex flex-col space-y-6">
              <FilterSection 
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
                categories={categories}
                onSearchChange={handleSearchChange}
                onCategoryChange={handleCategoryChange}
                onManageCategories={toggleCategoryManager}
              />

              <ExerciseGrid 
                exercises={filteredExercises} 
                categories={categories}
                isLoading={exercisesLoading || categoriesLoading}
                onEdit={handleOpenEditExercise}
                onDelete={handleOpenDeleteExercise}
              />
              
              {filteredExercises.length === 0 && !exercisesLoading && (
                <EmptyExerciseState 
                  hasExercises={exercises.length > 0}
                  onAddExercise={handleOpenAddExercise}
                  onClearFilters={handleClearFilters}
                />
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

        <ExerciseDialogs 
          isAddExerciseOpen={isAddExerciseOpen}
          isEditExerciseOpen={isEditExerciseOpen}
          isDeleteExerciseOpen={isDeleteExerciseOpen}
          isCuratedExercisesOpen={isCuratedExercisesOpen}
          selectedExercise={selectedExercise}
          exercises={exercises}
          categories={categories}
          onAddExerciseOpenChange={setIsAddExerciseOpen}
          onEditExerciseOpenChange={setIsEditExerciseOpen}
          onDeleteExerciseOpenChange={setIsDeleteExerciseOpen}
          onCuratedExercisesOpenChange={setIsCuratedExercisesOpen}
          onCreateExercise={handleCreateExerciseSubmit}
          onUpdateExercise={handleUpdateExerciseSubmit}
          onDeleteExercise={handleDeleteExerciseSubmit}
          onCreateMultipleExercises={handleCreateMultipleExercises}
        />
      </PageContainer>
    </>
  );
};

export default ExerciseLibrary;
