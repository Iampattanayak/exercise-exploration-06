
import React from 'react';
import { Helmet } from 'react-helmet';
import { useExerciseData } from '@/hooks/useExerciseData';
import { useCategoryData } from '@/hooks/useCategoryData';
import { useExerciseDialogs } from '@/hooks/exercise/useExerciseDialogs';

import PageContainer from '@/components/layout/PageContainer';
import ExerciseLibraryHeader from '@/components/exercises/ExerciseLibraryHeader';
import ExerciseContent from '@/components/exercises/ExerciseContent';
import CategoryManager from '@/components/exercises/CategoryManager';
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

  const {
    isAddExerciseOpen,
    isEditExerciseOpen,
    isDeleteExerciseOpen,
    isCuratedExercisesOpen,
    isBackupDialogOpen,
    selectedExercise,
    showCategoryManager,
    setIsAddExerciseOpen,
    setIsEditExerciseOpen,
    setIsDeleteExerciseOpen,
    setIsCuratedExercisesOpen,
    setIsBackupDialogOpen,
    handleOpenAddExercise,
    handleOpenCuratedExercises,
    handleOpenEditExercise,
    handleOpenDeleteExercise,
    handleOpenBackupDialog,
    handleDeleteExerciseSubmit,
    handleUpdateExerciseSubmit,
    handleCreateExerciseSubmit,
    toggleCategoryManager
  } = useExerciseDialogs({
    categories,
    handleCreateExercise,
    handleUpdateExercise,
    handleDeleteExercise,
    handleCreateMultipleExercises
  });

  const handleClearFilters = () => {
    handleSearchChange('');
    handleCategoryChange('');
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
              onOpenBackup={handleOpenBackupDialog}
            />

            <ExerciseContent
              exercises={exercises}
              filteredExercises={filteredExercises}
              categories={categories}
              isLoading={exercisesLoading || categoriesLoading}
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              onSearchChange={handleSearchChange}
              onCategoryChange={handleCategoryChange}
              onManageCategories={toggleCategoryManager}
              onOpenAddExercise={handleOpenAddExercise}
              onEditExercise={handleOpenEditExercise}
              onDeleteExercise={handleOpenDeleteExercise}
              onClearFilters={handleClearFilters}
            />
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
          isBackupDialogOpen={isBackupDialogOpen}
          selectedExercise={selectedExercise}
          exercises={exercises}
          categories={categories}
          onAddExerciseOpenChange={setIsAddExerciseOpen}
          onEditExerciseOpenChange={setIsEditExerciseOpen}
          onDeleteExerciseOpenChange={setIsDeleteExerciseOpen}
          onCuratedExercisesOpenChange={setIsCuratedExercisesOpen}
          onBackupDialogOpenChange={setIsBackupDialogOpen}
          onCreateExercise={handleCreateExerciseSubmit}
          onUpdateExercise={handleUpdateExerciseSubmit}
          onDeleteExercise={handleDeleteExerciseSubmit}
          onCreateMultipleExercises={handleCreateMultipleExercises}
          onRefreshData={refreshAllData}
        />
      </PageContainer>
    </>
  );
};

export default ExerciseLibrary;
