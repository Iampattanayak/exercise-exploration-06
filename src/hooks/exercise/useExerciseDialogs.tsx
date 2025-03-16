
import { useState } from 'react';
import { Exercise } from '@/lib/types';
import { toast } from 'sonner';

export function useExerciseDialogs({
  categories,
  handleCreateExercise,
  handleUpdateExercise,
  handleDeleteExercise,
  handleCreateMultipleExercises
}: {
  categories: any[];
  handleCreateExercise: (exerciseData: Partial<Exercise>, uploadedImage: File | null) => Promise<boolean>;
  handleUpdateExercise: (id: string, exerciseData: Partial<Exercise>, uploadedImage: File | null) => Promise<boolean>;
  handleDeleteExercise: (id: string) => Promise<boolean>;
  handleCreateMultipleExercises: (exercises: Exercise[]) => Promise<boolean>;
}) {
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false);
  const [isEditExerciseOpen, setIsEditExerciseOpen] = useState(false);
  const [isDeleteExerciseOpen, setIsDeleteExerciseOpen] = useState(false);
  const [isCuratedExercisesOpen, setIsCuratedExercisesOpen] = useState(false);
  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false);
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

  const handleOpenBackupDialog = () => {
    setIsBackupDialogOpen(true);
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

  const toggleCategoryManager = () => {
    setShowCategoryManager(!showCategoryManager);
  };

  return {
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
  };
}
