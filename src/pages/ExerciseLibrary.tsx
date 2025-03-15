
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useExerciseData } from '@/hooks/useExerciseData';
import { Exercise, Category } from '@/lib/types';

import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import ExerciseGrid from '@/components/exercises/ExerciseGrid';
import SearchBar from '@/components/exercises/SearchBar';
import CategoryFilter from '@/components/exercises/CategoryFilter';
import CategoryManager from '@/components/exercises/CategoryManager';
import AddExerciseDialog from '@/components/exercises/AddExerciseDialog';
import EditExerciseDialog from '@/components/exercises/EditExerciseDialog';
import DeleteExerciseDialog from '@/components/exercises/DeleteExerciseDialog';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

const ExerciseLibrary: React.FC = () => {
  const {
    exercises,
    categories,
    filteredExercises,
    exercisesLoading,
    categoriesLoading,
    searchTerm,
    selectedCategory,
    handleSearchChange,
    handleCategoryChange,
    handleCreateExercise,
    handleUpdateExercise,
    handleDeleteExercise,
    refreshAllData
  } = useExerciseData();

  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false);
  const [isEditExerciseOpen, setIsEditExerciseOpen] = useState(false);
  const [isDeleteExerciseOpen, setIsDeleteExerciseOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const handleOpenAddExercise = () => {
    setIsAddExerciseOpen(true);
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
      return handleDeleteExercise(selectedExercise.id);
    }
    return false;
  };

  const handleUpdateExerciseSubmit = async (exerciseData: Partial<Exercise>, uploadedImage: File | null) => {
    if (!selectedExercise) return false;
    return handleUpdateExercise(selectedExercise.id, exerciseData, uploadedImage);
  };

  const handleRefresh = () => {
    refreshAllData();
  };

  return (
    <>
      <Helmet>
        <title>Exercise Library | FitTrack</title>
      </Helmet>
      <Navbar />
      <PageContainer>
        <PageHeader
          title="Exercise Library"
          description="Browse and manage your exercises"
          action={
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
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
                onManageCategories={() => setIsCategoryManagerOpen(true)}
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
        </div>

        <AddExerciseDialog
          isOpen={isAddExerciseOpen}
          onOpenChange={setIsAddExerciseOpen}
          categories={categories}
          onSubmit={handleCreateExercise}
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

        <CategoryManager
          isOpen={isCategoryManagerOpen}
          onOpenChange={setIsCategoryManagerOpen}
          categories={categories}
          exercises={exercises}
        />
      </PageContainer>
    </>
  );
};

export default ExerciseLibrary;
