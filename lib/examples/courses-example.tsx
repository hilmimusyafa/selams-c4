// Example: How to fetch and display courses
// File: app/examples/courses-example.tsx
// @ts-nocheck - Example file

'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

export default function CoursesExample() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const supabase = createClient();
        
        // Fetch published courses with teacher info
        const { data, error } = await supabase
          .from('courses')
          .select(`
            *,
            teacher:profiles!courses_teacher_id_fkey(
              id,
              display_name,
              avatar_url
            )
          `)
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setCourses(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div>Error: {error}</div>;
  if (courses.length === 0) return <div>No courses found</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((course) => (
        <Card key={course.id} className="p-4">
          {course.cover_image_url && (
            <img 
              src={course.cover_image_url} 
              alt={course.title}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
          )}
          <h3 className="font-bold text-lg mb-2">{course.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{course.description}</p>
          <div className="flex items-center gap-2">
            {course.teacher?.avatar_url && (
              <img 
                src={course.teacher.avatar_url}
                alt={course.teacher.display_name}
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="text-sm">{course.teacher?.display_name}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
