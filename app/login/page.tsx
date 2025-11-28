'use client';
// @ts-nocheck - Auth types will work after setup

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { signIn, getCurrentProfile } from '@/lib/supabase/auth';
import { BookOpen, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Sign in user
      await signIn(email, password);

      // Get user profile to determine role
      const profile = await getCurrentProfile();

      if (!profile) {
        throw new Error('Profile not found');
      }

      // Redirect based on role
      // @ts-ignore - Type will work after database setup
      if (profile.role === 'teacher') {
        router.push('/teacher/dashboard');
      } else {
        router.push('/student/dashboard');
      }

      router.refresh();
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password');
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
          <h1 className="text-3xl font-bold text-foreground">SeLaMS</h1>
          <p className="text-muted-foreground">Smart Learning Management System</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="current-password"
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
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </form>

        {/* Register Link */}
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Belum punya akun? </span>
          <Link href="/register" className="text-primary hover:underline font-medium">
            Daftar sekarang
          </Link>
        </div>

        {/* Demo Accounts Info */}
        <div className="pt-4 border-t">
          <p className="text-xs text-center text-muted-foreground mb-2">Demo Accounts (if available):</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded bg-muted/50">
              <p className="font-medium">Teacher</p>
              <p className="text-muted-foreground">teacher@test.com</p>
            </div>
            <div className="p-2 rounded bg-muted/50">
              <p className="font-medium">Student</p>
              <p className="text-muted-foreground">student@test.com</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
