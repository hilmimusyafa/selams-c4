// Example: Server Action for creating course
// File: app/examples/create-course-action.ts
// @ts-nocheck - Example file

'use server';

import { createClient } from '@/lib/supabase/server';
import { createCourse } from '@/lib/supabase/queries';
import { revalidatePath } from 'next/cache';

export async function createCourseAction(formData: FormData) {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'User not authenticated' };
  }

  // Check if user is a teacher
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'teacher') {
    return { error: 'Only teachers can create courses' };
  }

  try {
    // Method 1: Using helper function
    const course = await createCourse(supabase, {
      teacher_id: user.id,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      cover_image_url: formData.get('cover_image_url') as string || null,
      is_published: false,
    });

    // Method 2: Direct insert
    // const { data: course, error } = await supabase
    //   .from('courses')
    //   .insert({
    //     teacher_id: user.id,
    //     title: formData.get('title') as string,
    //     description: formData.get('description') as string,
    //   })
    //   .select()
    //   .single();

    // Revalidate the courses page
    revalidatePath('/teacher/dashboard');
    
    return { success: true, course };
  } catch (error: any) {
    return { error: error.message };
  }
}

// Example: Enroll student to course
export async function enrollToCourse(courseId: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'User not authenticated' };
  }

  try {
    const { data, error } = await supabase
      .from('enrollments')
      .insert({
        student_id: user.id,
        course_id: courseId,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/student/dashboard');
    
    return { success: true, enrollment: data };
  } catch (error: any) {
    return { error: error.message };
  }
}

// Example: Mark material as completed
export async function markCompleted(enrollmentId: string, materialId: string) {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('course_progress')
      .upsert({
        enrollment_id: enrollmentId,
        material_id: materialId,
        is_completed: true,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/student/dashboard');
    revalidatePath(`/course/${enrollmentId}`);
    
    return { success: true, progress: data };
  } catch (error: any) {
    return { error: error.message };
  }
}
