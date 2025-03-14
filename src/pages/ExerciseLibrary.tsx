
import React, { useState, useEffect } from 'react';
import { 
  getAllExercises, 
  getAllCategories, 
  addExercise, 
  updateExercise, 
  deleteExercise, 
  addCategory, 
  updateCategory, 
  deleteCategory 
} from '@/lib/data';
import { uploadExerciseImage } from '@/lib/storage';
import { Exercise, Category } from '@/lib/types';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import ExerciseGrid from '@/components/exercises/ExerciseGrid';
import CategoryFilter from '@/components/exercises/CategoryFilter';
import SearchBar from '@/components/exercises/SearchBar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Settings, Loader, Trash, Edit } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import CategoryManager from '@/components/exercises/CategoryManager';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

const ExerciseLibrary = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('exercises');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  
  // Form states for adding/editing exercise
  const [exerciseForm, setExerciseForm] = useState<Partial<Exercise>>({
    name: '',
    description: '',
    category: '',
    imageUrl: ''
  });
  
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch exercises using React Query
  const { 
    data: exercises = [], 
    isLoading: exercisesLoading,
    error: exercisesError
  } = useQuery({
    queryKey: ['exercises'],
    queryFn: getAllExercises
  });

  // Fetch categories using React Query
  const { 
    data: categories = [], 
    isLoading: categoriesLoading,
    error: categoriesError
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories
  });

  // Mutations for CRUD operations
  const createExerciseMutation = useMutation({
    mutationFn: addExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      toast.success('Exercise added successfully');
      resetForm();
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to add exercise: ${error.message}`);
    }
  });

  const updateExerciseMutation = useMutation({
    mutationFn: updateExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      toast.success('Exercise updated successfully');
      resetForm();
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to update exercise: ${error.message}`);
    }
  });

  const deleteExerciseMutation = useMutation({
    mutationFn: deleteExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      toast.success('Exercise deleted successfully');
      setIsDeleteDialogOpen(false);
      setSelectedExercise(null);
    },
    onError: (error) => {
      toast.error(`Failed to delete exercise: ${error.message}`);
    }
  });

  // Filter exercises based on search term and selected category
  const filteredExercises = exercises.filter((exercise: Exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? exercise.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setExerciseForm({
      ...exerciseForm,
      [name]: value
    });
  };

  const handleCategorySelect = (value: string) => {
    setExerciseForm({
      ...exerciseForm,
      category: value
    });
  };
  
  const handleImageChange = (file: File | null, preview: string | null) => {
    setUploadedImage(file);
    setImagePreview(preview);
  };

  const resetForm = () => {
    setExerciseForm({
      name: '',
      description: '',
      category: '',
      imageUrl: ''
    });
    setUploadedImage(null);
    setImagePreview(null);
    setSelectedExercise(null);
  };

  const openEditDialog = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setExerciseForm({
      id: exercise.id,
      name: exercise.name,
      description: exercise.description,
      category: exercise.category,
      imageUrl: exercise.imageUrl
    });
    setImagePreview(exercise.imageUrl);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsDeleteDialogOpen(true);
  };

  const handleAddExercise = async () => {
    if (!exerciseForm.name || !exerciseForm.category) {
      toast.error('Exercise name and category are required');
      return;
    }
    
    try {
      // Generate a unique ID for the exercise
      const exerciseId = uuidv4();
      let imageUrl = exerciseForm.imageUrl || '';
      
      // If there's an uploaded image, process it
      if (uploadedImage) {
        const result = await uploadExerciseImage(uploadedImage);
        imageUrl = result.url;
      }
      
      // Create the exercise object
      const exercise: Exercise = {
        id: exerciseId,
        name: exerciseForm.name || '',
        description: exerciseForm.description || '',
        category: exerciseForm.category || '',
        imageUrl: imageUrl
      };
      
      // Save to database
      await createExerciseMutation.mutateAsync(exercise);
    } catch (error) {
      console.error('Error adding exercise:', error);
      toast.error('Failed to add exercise');
    }
  };

  const handleUpdateExercise = async () => {
    if (!exerciseForm.name || !exerciseForm.category || !selectedExercise) {
      toast.error('Exercise name and category are required');
      return;
    }
    
    try {
      let imageUrl = exerciseForm.imageUrl || '';
      
      // If there's an uploaded image, process it
      if (uploadedImage) {
        const result = await uploadExerciseImage(uploadedImage);
        imageUrl = result.url;
      }
      
      // Create the exercise object
      const exercise: Exercise = {
        id: selectedExercise.id,
        name: exerciseForm.name || '',
        description: exerciseForm.description || '',
        category: exerciseForm.category || '',
        imageUrl: imageUrl
      };
      
      // Update in database
      await updateExerciseMutation.mutateAsync(exercise);
    } catch (error) {
      console.error('Error updating exercise:', error);
      toast.error('Failed to update exercise');
    }
  };

  const handleDeleteExercise = async () => {
    if (!selectedExercise) return;
    
    try {
      await deleteExerciseMutation.mutateAsync(selectedExercise.id);
    } catch (error) {
      console.error('Error deleting exercise:', error);
      toast.error('Failed to delete exercise');
    }
  };
  
  const handleAddCategory = async (category: Category): Promise<void> => {
    try {
      await addCategory(category);
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category added successfully');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    }
  };
  
  const handleUpdateCategory = async (category: Category): Promise<void> => {
    try {
      await updateCategory(category);
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    }
  };
  
  const handleDeleteCategory = async (categoryId: string): Promise<void> => {
    try {
      // Check if any exercises are using this category
      const exercisesUsingCategory = exercises.filter(e => e.category === categoryId);
      
      if (exercisesUsingCategory.length > 0) {
        toast.error(`Cannot delete category. ${exercisesUsingCategory.length} exercises are using this category.`);
        return;
      }
      
      await deleteCategory(categoryId);
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  const handleExerciseSelect = (exercise: Exercise) => {
    openEditDialog(exercise);
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
            <Button onClick={() => {
              resetForm();
              setIsAddDialogOpen(true);
            }}>
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
                  onExerciseSelect={handleExerciseSelect}
                />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="categories" className="mt-0">
            <CategoryManager 
              categories={categories} 
              onCategoryAdd={handleAddCategory}
              onCategoryUpdate={handleUpdateCategory}
              onCategoryDelete={handleDeleteCategory}
            />
          </TabsContent>
        </Tabs>

        {/* Add Exercise Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Exercise</DialogTitle>
              <DialogDescription>
                Create a new exercise to add to your library
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Exercise Name *</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={exerciseForm.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Bench Press"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select onValueChange={handleCategorySelect} value={exerciseForm.category}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      value={exerciseForm.description}
                      onChange={handleInputChange}
                      placeholder="Describe how to perform this exercise..."
                      rows={4}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Exercise Image *</Label>
                    <ImageUpload
                      onImageChange={handleImageChange}
                      previewUrl={imagePreview}
                      maxSizeMB={5}
                      minWidth={500}
                      minHeight={500}
                      maxWidth={1500}
                      maxHeight={1500}
                      aspectRatio={1}
                      helpText="Square images work best (1:1 ratio). Non-square images will be auto-cropped from the center."
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="imageUrl">Or use an image URL</Label>
                    <Input 
                      id="imageUrl" 
                      name="imageUrl" 
                      value={exerciseForm.imageUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      disabled={!!imagePreview}
                    />
                    {(!imagePreview && !exerciseForm.imageUrl) && (
                      <p className="text-xs text-muted-foreground">
                        Either upload an image or provide a URL
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                resetForm();
                setIsAddDialogOpen(false);
              }}>Cancel</Button>
              <Button onClick={handleAddExercise}>Add Exercise</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Exercise Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Exercise</DialogTitle>
              <DialogDescription>
                Update the details of this exercise
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-name">Exercise Name *</Label>
                    <Input 
                      id="edit-name" 
                      name="name" 
                      value={exerciseForm.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Bench Press"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="edit-category">Category *</Label>
                    <Select onValueChange={handleCategorySelect} value={exerciseForm.category}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea 
                      id="edit-description" 
                      name="description" 
                      value={exerciseForm.description}
                      onChange={handleInputChange}
                      placeholder="Describe how to perform this exercise..."
                      rows={4}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Exercise Image</Label>
                    <ImageUpload
                      onImageChange={handleImageChange}
                      previewUrl={imagePreview}
                      maxSizeMB={5}
                      minWidth={500}
                      minHeight={500}
                      maxWidth={1500}
                      maxHeight={1500}
                      aspectRatio={1}
                      helpText="Square images work best (1:1 ratio)."
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="edit-imageUrl">Or use an image URL</Label>
                    <Input 
                      id="edit-imageUrl" 
                      name="imageUrl" 
                      value={exerciseForm.imageUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      disabled={!!imagePreview && imagePreview !== exerciseForm.imageUrl}
                    />
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => {
                        setIsEditDialogOpen(false);
                        openDeleteDialog(selectedExercise as Exercise);
                      }}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete Exercise
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                resetForm();
                setIsEditDialogOpen(false);
              }}>Cancel</Button>
              <Button onClick={handleUpdateExercise}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Delete Exercise</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedExercise?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteExercise}>
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageContainer>
    </>
  );
};

export default ExerciseLibrary;
