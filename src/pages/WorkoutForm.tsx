
import React from 'react';
import { ChevronLeft, Loader2, Save } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import WorkoutFormLoading from '@/components/workout/WorkoutFormLoading';
import WorkoutFormContent from '@/components/workout/WorkoutFormContent';
import { useWorkoutForm } from '@/hooks/useWorkoutForm';

const WorkoutForm = () => {
  const {
    id,
    workout,
    selectedDate,
    availableExercises,
    searchTerm,
    isLoading,
    isSaving,
    categoryMap,
    categories,
    setSelectedDate,
    setSearchTerm,
    handleInputChange,
    handleReorderExercises,
    handleMoveExercise,
    handleAddExercise,
    handleRemoveExercise,
    handleSetChange,
    handleAddSet,
    handleRemoveSet,
    saveWorkout,
    navigate
  } = useWorkoutForm();
  
  return (
    <PageContainer>
      <PageHeader 
        title={id === 'new' ? "Create Workout" : "Edit Workout"} 
        description="Plan your workout routine"
        action={
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => navigate(-1)} disabled={isSaving}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={saveWorkout} disabled={isSaving || isLoading}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Workout
                </>
              )}
            </Button>
          </div>
        }
      />
      
      {isLoading ? (
        <WorkoutFormLoading />
      ) : (
        <WorkoutFormContent
          workout={workout}
          selectedDate={selectedDate}
          availableExercises={availableExercises}
          searchTerm={searchTerm}
          categoryMap={categoryMap}
          categories={categories}
          isLoading={isLoading}
          onNameChange={handleInputChange}
          onDescriptionChange={handleInputChange}
          onDateChange={setSelectedDate}
          onSearchChange={setSearchTerm}
          onExerciseAdd={handleAddExercise}
          onRemoveExercise={handleRemoveExercise}
          onAddSet={handleAddSet}
          onRemoveSet={handleRemoveSet}
          onSetChange={handleSetChange}
          onReorderExercises={handleReorderExercises}
          onMoveExercise={handleMoveExercise}
        />
      )}
    </PageContainer>
  );
};

export default WorkoutForm;
