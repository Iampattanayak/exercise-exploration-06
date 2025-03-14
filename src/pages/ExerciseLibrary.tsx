
import React, { useState } from 'react';
import { exercises, categories, addExercise, updateExercise, deleteExercise, addCategory, updateCategory, deleteCategory } from '@/lib/data';
import { Exercise, Category } from '@/lib/types';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import ExerciseGrid from '@/components/exercises/ExerciseGrid';
import CategoryFilter from '@/components/exercises/CategoryFilter';
import SearchBar from '@/components/exercises/SearchBar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Settings } from 'lucide-react';
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
import Navbar from '@/components/layout/Navbar';
import CategoryManager from '@/components/exercises/CategoryManager';
import { toast } from 'sonner';

const ExerciseLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('exercises');
  
  // Form states for adding new exercise
  const [newExercise, setNewExercise] = useState({
    name: '',
    description: '',
    category: '',
    imageUrl: ''
  });
  
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
    setNewExercise({
      ...newExercise,
      [name]: value
    });
  };

  const handleCategorySelect = (value: string) => {
    setNewExercise({
      ...newExercise,
      category: value
    });
  };
  
  const handleImageChange = (file: File | null, preview: string | null) => {
    setUploadedImage(file);
    setImagePreview(preview);
  };

  const handleAddExercise = () => {
    if (!newExercise.name || !newExercise.category) {
      toast.error('Exercise name and category are required');
      return;
    }
    
    // Check if we have an image (either uploaded or URL)
    if (!imagePreview && !newExercise.imageUrl) {
      toast.error('Please provide an image for the exercise');
      return;
    }
    
    // Generate a unique ID based on the name
    const id = newExercise.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-4);
    
    const exercise: Exercise = {
      id,
      name: newExercise.name,
      description: newExercise.description,
      category: newExercise.category,
      imageUrl: imagePreview || newExercise.imageUrl
    };
    
    // If we have an uploaded image, store its path reference
    if (uploadedImage) {
      exercise.imagePath = URL.createObjectURL(uploadedImage);
    }
    
    // Add the exercise to our data
    addExercise(exercise);
    
    // Show success toast
    toast.success(`Exercise "${exercise.name}" added successfully`);
    
    // Close the dialog
    setIsAddDialogOpen(false);
    
    // Reset form
    setNewExercise({
      name: '',
      description: '',
      category: '',
      imageUrl: ''
    });
    setUploadedImage(null);
    setImagePreview(null);
  };
  
  const handleAddCategory = (category: Category) => {
    addCategory(category);
  };
  
  const handleUpdateCategory = (category: Category) => {
    updateCategory(category);
  };
  
  const handleDeleteCategory = (categoryId: string) => {
    // Check if any exercises are using this category
    const exercisesUsingCategory = exercises.filter(e => e.category === categoryId);
    
    if (exercisesUsingCategory.length > 0) {
      toast.error(`Cannot delete category. ${exercisesUsingCategory.length} exercises are using this category.`);
      return;
    }
    
    deleteCategory(categoryId);
  };

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
                <ExerciseGrid exercises={filteredExercises} />
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
                      value={newExercise.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Bench Press"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select onValueChange={handleCategorySelect}>
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
                      value={newExercise.description}
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
                      value={newExercise.imageUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      disabled={!!imagePreview}
                    />
                    {(!imagePreview && !newExercise.imageUrl) && (
                      <p className="text-xs text-muted-foreground">
                        Either upload an image or provide a URL
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddExercise}>Add Exercise</Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageContainer>
    </>
  );
};

export default ExerciseLibrary;
