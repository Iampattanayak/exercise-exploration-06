
import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import SectionHeader from '@/components/layout/SectionHeader';
import WorkoutCard from '@/components/workout/WorkoutCard';
import { getAllWorkouts } from '@/lib/workouts';
import { Workout } from '@/lib/types';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious
} from '@/components/ui/pagination';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { History } from 'lucide-react';

const WORKOUTS_PER_PAGE = 9;

const WorkoutHistory: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        // In a real implementation, you would pass pagination params to this function
        const allWorkouts = await getAllWorkouts();
        
        // Calculate total pages
        const total = Math.ceil(allWorkouts.length / WORKOUTS_PER_PAGE);
        setTotalPages(total);
        
        // Get current page workouts
        const startIndex = (currentPage - 1) * WORKOUTS_PER_PAGE;
        const endIndex = startIndex + WORKOUTS_PER_PAGE;
        const paginatedWorkouts = allWorkouts.slice(startIndex, endIndex);
        
        setWorkouts(paginatedWorkouts);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <Pagination className="mt-8">
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
            </PaginationItem>
          )}
          
          {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
            // Show pages around current page
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <PaginationItem key={pageNum}>
                <PaginationLink 
                  isActive={currentPage === pageNum}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    );
  };

  const renderWorkouts = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: WORKOUTS_PER_PAGE }).map((_, i) => (
            <Card key={i} className="border rounded-lg p-5">
              <Skeleton className="h-4 w-20 mb-3" />
              <Skeleton className="h-6 w-40 mb-1" />
              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-4 w-32 mb-3" />
              <Skeleton className="h-2 w-full mb-6" />
              <div className="border-t pt-3">
                <Skeleton className="h-8 w-24" />
              </div>
            </Card>
          ))}
        </div>
      );
    }

    if (workouts.length === 0) {
      return (
        <Card className="p-8 text-center">
          <CardContent>
            <h3 className="text-lg font-medium mb-2">No workouts found</h3>
            <p className="text-muted-foreground">
              You haven't completed any workouts yet.
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workouts.map(workout => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
      </div>
    );
  };

  return (
    <PageContainer>
      <div className="mb-8">
        <SectionHeader 
          title="Workout History" 
          description="View all your completed workouts"
        />
      </div>
      
      {renderWorkouts()}
      {renderPagination()}
    </PageContainer>
  );
};

export default WorkoutHistory;
