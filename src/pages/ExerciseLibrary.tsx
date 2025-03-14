
import React, { useState } from 'react';
import { Exercise } from '@/lib/types';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import ExerciseGrid from '@/components/exercises/ExerciseGrid';
import CategoryFilter from '@/components/exercises/CategoryFilter';
import SearchBar from '@/components/exercises/SearchBar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Settings, Loader } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import CategoryManager from '@/components/exercises/CategoryManager';
import AddExerciseDialog from '@/components/exercises/AddExerciseDialog';
import EditExerciseDialog from '@/components/exercises/EditExerciseDialog';
import DeleteExerciseDialog from '@/components/exercises/DeleteExerciseDialog';
import { useExerciseData } from '@/hooks/useExerciseData';
import { useCategoryData } from '@/hooks/useCategoryData';

const ExerciseLibrary = () => {
  // State for managing dialogs and tabs
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('exercises');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  
  // Custom hooks for data operations
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
    handleDeleteExercise
  } = useExerciseData();
  
  const {
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory
  } = useCategoryData();

  // Dialog management functions
  const openEditDialog = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsDeleteDialogOpen(true);
  };

  const resetSelectedExercise = () => {
    setSelectedExercise(null);
  };

  // Handler functions
  const handleAddExerciseSubmit = async (exerciseData: Partial<Exercise>, uploadedImage: File | null) => {
    return await handleCreateExercise(exerciseData, uploadedImage);
  };

  const handleEditExerciseSubmit = async (exerciseData: Partial<Exercise>, uploadedImage: File | null) => {
    if (!selectedExercise) return false;
    return await handleUpdateExercise(selectedExercise.id, exerciseData, uploadedImage);
  };

  const handleDeleteExerciseSubmit = async () => {
    if (!selectedExercise) return false;
    const success = await handleDeleteExercise(selectedExercise.id);
    if (success) {
      resetSelectedExercise();
    }
    return success;
  };

  const handleCategoryDelete = async (categoryId: string) => {
    // Check if any exercises are using this category
    const exercisesUsingCategory = exercises.filter(e => e.category === categoryId).length;
    return await handleDeleteCategory(categoryId, exercisesUsingCategory);
  };

  // Loading state
  if (exercisesLoading || categoriesLoading) {
    return (
      <>
        <Navbar />
        <PageContainer>
          <div className="flex items-center justify-center h-[80vh]">
            <div className="flex flex-col items-center gap-4">
              <Loader className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading exercise library...</p>
            </div>
          </div>
        </PageContainer>
      </>
    );
  }

  // Error handling
  if (exercisesError || categoriesError) {
    return (
      <>
        <Navbar />
        <PageContainer>
          <div className="flex items-center justify-center h-[80vh]">
            <div className="flex flex-col items-center gap-4 max-w-md text-center">
              <p className="text-destructive font-semibold">Error loading data</p>
              <p className="text-muted-foreground">
                {exercisesError ? String(exercisesError) : categoriesError ? String(categoriesError) : 'Unknown error occurred'}
              </p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <PageContainer>
        <PageHeader 
          title="Exercise Library" 
          description="Browse, search, and manage your exercises"
          action={
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Exercise
            </Button>
          }
        />

        <Tabs
          defaultValue="exercises"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="exercises">Exercises</TabsTrigger>
            <TabsTrigger value="categories">
              <Settings className="h-4 w-4 mr-2" />
              Manage Categories
            </TabsTrigger>
          </TabsList>

          <TabsContent value="exercises" className="mt-0">
            <SearchBar 
              searchTerm={searchTerm} 
              onSearchChange={handleSearchChange} 
            />

            <CategoryFilter 
              categories={categories} 
              selectedCategory={selectedCategory} 
              onCategoryChange={handleCategoryChange} 
            />

            <div className="mt-6">
              {filteredExercises.length === 0 ? (
                <div className="text-center py-12 border rounded-lg">
                  <p className="text-muted-foreground">No exercises found matching your criteria.</p>
                </div>
              ) : (
                <ExerciseGrid 
                  exercises={filteredExercises}
                  onExerciseSelect={openEditDialog}
                />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="categories" className="mt-0">
            <CategoryManager 
              categories={categories} 
              onCategoryAdd={handleAddCategory}
              onCategoryUpdate={handleUpdateCategory}
              onCategoryDelete={handleCategoryDelete}
            />
          </TabsContent>
        </Tabs>

        {/* Exercise Dialogs */}
        <AddExerciseDialog 
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          categories={categories}
          onSubmit={handleAddExerciseSubmit}
        />

        <EditExerciseDialog 
          isOpen={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) resetSelectedExercise();
          }}
          exercise={selectedExercise}
          categories={categories}
          onSubmit={handleEditExerciseSubmit}
          onDelete={() => openDeleteDialog(selectedExercise as Exercise)}
        />

        <DeleteExerciseDialog 
          isOpen={isDeleteDialogOpen}
          onOpenChange={(open) => {
            setIsDeleteDialogOpen(open);
            if (!open) resetSelectedExercise();
          }}
          exercise={selectedExercise}
          onDelete={handleDeleteExerciseSubmit}
        />
      </PageContainer>
    </>
  );
};

export default ExerciseLibrary;
