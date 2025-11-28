// Example: Server-side data fetching
// File: app/examples/server-courses-example.tsx
// @ts-nocheck - Example file

import { createClient } from '@/lib/supabase/server';
import { getPublishedCourses } from '@/lib/supabase/queries';
import { Card } from '@/components/ui/card';

export default async function ServerCoursesExample() {
  const supabase = await createClient();
  
  // Method 1: Using helper function
  const courses = await getPublishedCourses(supabase);
  
  // Method 2: Direct query
  // const { data: courses } = await supabase
  //   .from('courses')
  //   .select('*')
  //   .eq('is_published', true);

  if (!courses || courses.length === 0) {
    return <div>No courses available</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((course) => (
        <Card key={course.id} className="p-4">
          <h3 className="font-bold text-lg mb-2">{course.title}</h3>
          <p className="text-sm text-gray-600">{course.description}</p>
          <div className="mt-2">
            <span className="text-xs">Teacher: {course.teacher?.display_name}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
