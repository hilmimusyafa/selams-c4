/**
 * Database Query Helper Functions
 * Fungsi-fungsi helper untuk operasi database yang sering digunakan
 */

// @ts-nocheck - Types will be generated after running setup.sql in Supabase
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types';

type Tables = Database['public']['Tables'];

// ============================================================================
// PROFILE QUERIES
// ============================================================================

/**
 * Get user profile by ID
 */
export async function getProfile(
  supabase: SupabaseClient<Database>,
  userId: string
) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update user profile
 */
export async function updateProfile(
  supabase: SupabaseClient<Database>,
  userId: string,
  updates: Tables['profiles']['Update']
) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// COURSE QUERIES
// ============================================================================

/**
 * Get all published courses
 */
export async function getPublishedCourses(supabase: SupabaseClient<Database>) {
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
  return data;
}

/**
 * Get courses by teacher ID
 */
export async function getCoursesByTeacher(
  supabase: SupabaseClient<Database>,
  teacherId: string
) {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get course by ID with modules and materials
 */
export async function getCourseWithContent(
  supabase: SupabaseClient<Database>,
  courseId: string
) {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      teacher:profiles!courses_teacher_id_fkey(
        id,
        display_name,
        avatar_url
      ),
      modules(
        *,
        materials(
          *,
          tasks(*)
        )
      )
    `)
    .eq('id', courseId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Create new course
 */
export async function createCourse(
  supabase: SupabaseClient<Database>,
  course: Tables['courses']['Insert']
) {
  const { data, error } = await supabase
    .from('courses')
    .insert(course)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update course
 */
export async function updateCourse(
  supabase: SupabaseClient<Database>,
  courseId: string,
  updates: Tables['courses']['Update']
) {
  const { data, error } = await supabase
    .from('courses')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', courseId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete course
 */
export async function deleteCourse(
  supabase: SupabaseClient<Database>,
  courseId: string
) {
  const { error } = await supabase.from('courses').delete().eq('id', courseId);

  if (error) throw error;
}

// ============================================================================
// ENROLLMENT QUERIES
// ============================================================================

/**
 * Get student's enrolled courses
 */
export async function getStudentEnrolledCourses(
  supabase: SupabaseClient<Database>,
  studentId: string
) {
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      *,
      course:courses(
        *,
        teacher:profiles!courses_teacher_id_fkey(
          id,
          display_name,
          avatar_url
        )
      )
    `)
    .eq('student_id', studentId)
    .order('enrolled_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get students enrolled in a course
 */
export async function getCourseEnrollments(
  supabase: SupabaseClient<Database>,
  courseId: string
) {
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      *,
      student:profiles!enrollments_student_id_fkey(
        id,
        display_name,
        email,
        avatar_url
      )
    `)
    .eq('course_id', courseId)
    .order('enrolled_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Enroll student to course
 */
export async function enrollStudent(
  supabase: SupabaseClient<Database>,
  studentId: string,
  courseId: string
) {
  const { data, error } = await supabase
    .from('enrollments')
    .insert({ student_id: studentId, course_id: courseId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Check if student is enrolled in course
 */
export async function isStudentEnrolled(
  supabase: SupabaseClient<Database>,
  studentId: string,
  courseId: string
) {
  const { data, error } = await supabase
    .from('enrollments')
    .select('id')
    .eq('student_id', studentId)
    .eq('course_id', courseId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

// ============================================================================
// MODULE & MATERIAL QUERIES
// ============================================================================

/**
 * Get modules for a course
 */
export async function getCourseModules(
  supabase: SupabaseClient<Database>,
  courseId: string
) {
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Create new module
 */
export async function createModule(
  supabase: SupabaseClient<Database>,
  module: Tables['modules']['Insert']
) {
  const { data, error } = await supabase
    .from('modules')
    .insert(module)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get materials for a module
 */
export async function getModuleMaterials(
  supabase: SupabaseClient<Database>,
  moduleId: string
) {
  const { data, error } = await supabase
    .from('materials')
    .select(`
      *,
      tasks(*)
    `)
    .eq('module_id', moduleId)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Create new material
 */
export async function createMaterial(
  supabase: SupabaseClient<Database>,
  material: Tables['materials']['Insert']
) {
  const { data, error } = await supabase
    .from('materials')
    .insert(material)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// PROGRESS QUERIES
// ============================================================================

/**
 * Get student progress for a course
 */
export async function getStudentCourseProgress(
  supabase: SupabaseClient<Database>,
  studentId: string,
  courseId: string
) {
  // First get the enrollment
  const { data: enrollment, error: enrollmentError } = await supabase
    .from('enrollments')
    .select('id')
    .eq('student_id', studentId)
    .eq('course_id', courseId)
    .single();

  if (enrollmentError) throw enrollmentError;

  // Then get the progress
  const { data, error } = await supabase
    .from('course_progress')
    .select(`
      *,
      material:materials(*)
    `)
    .eq('enrollment_id', enrollment.id);

  if (error) throw error;
  return data;
}

/**
 * Mark material as completed
 */
export async function markMaterialCompleted(
  supabase: SupabaseClient<Database>,
  enrollmentId: string,
  materialId: string
) {
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
  return data;
}

// ============================================================================
// TASK & SUBMISSION QUERIES
// ============================================================================

/**
 * Get upcoming tasks/deadlines for student
 */
export async function getStudentUpcomingTasks(
  supabase: SupabaseClient<Database>,
  studentId: string
) {
  // Get enrolled courses
  const { data: enrollments, error: enrollmentError } = await supabase
    .from('enrollments')
    .select('course_id')
    .eq('student_id', studentId);

  if (enrollmentError) throw enrollmentError;

  const courseIds = enrollments.map((e) => e.course_id);

  // Get tasks from enrolled courses
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      material:materials(
        *,
        module:modules(
          *,
          course:courses(*)
        )
      )
    `)
    .gte('due_date', new Date().toISOString())
    .order('due_date', { ascending: true });

  if (error) throw error;

  // Filter tasks that belong to enrolled courses
  return data.filter((task: any) =>
    courseIds.includes(task.material?.module?.course?.id)
  );
}

/**
 * Submit task
 */
export async function submitTask(
  supabase: SupabaseClient<Database>,
  submission: Tables['submissions']['Insert']
) {
  const { data, error } = await supabase
    .from('submissions')
    .insert(submission)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get student submissions for a task
 */
export async function getTaskSubmissions(
  supabase: SupabaseClient<Database>,
  taskId: string
) {
  const { data, error } = await supabase
    .from('submissions')
    .select(`
      *,
      student:profiles!submissions_student_id_fkey(
        id,
        display_name,
        email,
        avatar_url
      )
    `)
    .eq('task_id', taskId)
    .order('submitted_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Grade submission
 */
export async function gradeSubmission(
  supabase: SupabaseClient<Database>,
  submissionId: string,
  grade: number,
  feedback?: string
) {
  const { data, error } = await supabase
    .from('submissions')
    .update({
      grade,
      feedback,
      status: 'graded',
    })
    .eq('id', submissionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
