
import React, { useState } from 'react';
import { exercises, categories } from '@/lib/data';
import { Exercise } from '@/lib/types';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import ExerciseGrid from '@/components/exercises/ExerciseGrid';
import CategoryFilter from '@/components/exercises/CategoryFilter';
import SearchBar from '@/components/exercises/SearchBar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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
import Navbar from '@/components/layout/Navbar';

const ExerciseLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Form states for adding new exercise
  const [newExercise, setNewExercise] = useState({
    name: '',
    description: '',
    category: '',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=500&h=500&auto=format&fit=crop'
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

  const handleAddExercise = () => {
    // In a real app, we would save this to a database
    console.log('New exercise:', newExercise);
    
    // Close the dialog
    setIsAddDialogOpen(false);
    
    // Reset form
    setNewExercise({
      name: '',
      description: '',
      category: '',
      imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=500&h=500&auto=format&fit=crop'
    });
  };

  return (
    <>
      <Navbar />
      <PageContainer>
        <PageHeader 
          title="Exercise Library" 
          description="Browse and search through available exercises"
          action={
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Exercise
            </Button>
          }
        />

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

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Exercise</DialogTitle>
              <DialogDescription>
                Create a new exercise to add to your library
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Exercise Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={newExercise.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Bench Press"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={newExercise.description}
                  onChange={handleInputChange}
                  placeholder="Describe how to perform this exercise..."
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
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
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input 
                  id="imageUrl" 
                  name="imageUrl" 
                  value={newExercise.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleAddExercise}>Add Exercise</Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageContainer>
    </>
  );
};

export default ExerciseLibrary;
