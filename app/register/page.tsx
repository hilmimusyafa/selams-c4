'use client';
// @ts-nocheck - Auth types will work after setup

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { signUp } from '@/lib/supabase/auth';
import { BookOpen, Loader2, GraduationCap, Users } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as 'teacher' | 'student',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      setLoading(false);
      return;
    }

    try {
      // Sign up user
      await signUp(
        formData.email,
        formData.password,
        formData.displayName,
        formData.role
      );

      // Redirect based on role
      if (formData.role === 'teacher') {
        router.push('/teacher/dashboard');
      } else {
        router.push('/student/dashboard');
      }

      router.refresh();
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Terjadi kesalahan saat mendaftar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md p-8 space-y-6 shadow-xl">
        {/* Logo & Title */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Daftar SeLaMS</h1>
          <p className="text-muted-foreground">Buat akun baru untuk memulai</p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Daftar sebagai</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'student' })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.role === 'student'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
                disabled={loading}
              >
                <GraduationCap className={`w-8 h-8 mx-auto mb-2 ${
                  formData.role === 'student' ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <p className={`text-sm font-medium ${
                  formData.role === 'student' ? 'text-primary' : 'text-foreground'
                }`}>
                  Murid
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'teacher' })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.role === 'teacher'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
                disabled={loading}
              >
                <Users className={`w-8 h-8 mx-auto mb-2 ${
                  formData.role === 'teacher' ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <p className={`text-sm font-medium ${
                  formData.role === 'teacher' ? 'text-primary' : 'text-foreground'
                }`}>
                  Guru
                </p>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="displayName" className="text-sm font-medium text-foreground">
              Nama Lengkap
            </label>
            <Input
              id="displayName"
              type="text"
              placeholder="John Doe"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              required
              disabled={loading}
              autoComplete="name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="nama@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Minimal 6 karakter"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
              Konfirmasi Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Ketik ulang password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Mendaftar...
              </>
            ) : (
              'Daftar'
            )}
          </Button>
        </form>

        {/* Login Link */}
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Sudah punya akun? </span>
          <Link href="/login" className="text-primary hover:underline font-medium">
            Login di sini
          </Link>
        </div>
      </Card>
    </div>
  );
}
