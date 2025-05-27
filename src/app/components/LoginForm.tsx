'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormInputItem } from '.';
import Image from 'next/image';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      await login(data);
      router.push('/dashboard');
    } catch (err) {
      setError('root', {
        type: 'manual',
        message: 'Invalid username or password. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center" style={{
      background: 'linear-gradient(180deg, #142B41 3.22%, #20202D 108.1%)'
    }}>
      {/* Starry sky background */}
      <Image
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/db5a42eef379029f302ca7e9bbe66a1adb978372?placeholderIfAbsent=true"
        alt=""
        fill
        className="object-cover z-0"
        priority
      />

      <div className="flex flex-col items-center z-10">
        {/* Logo */}
        <Image
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/0eaa331fb9140e483fd2289f2249a35661630c38?placeholderIfAbsent=true"
          alt="Logo"
          width={248}
          height={140}
          className="shadow-lg rounded "
        />

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-[0px_12px_70px_0px_rgba(255,255,255,0.40)] flex flex-col items-start px-8 py-16 mt-8" style={{ width: 364, minHeight: 512 }}>
          {/* Title */}
          <div className="mb-6">
            <div className="font-ibm text-[32px] font-semibold text-[#142B41]">Login</div>
            <div className="font-ibm text-[18px] text-[#142B41]">Welcome to login</div>
            <div className="h-1 mt-2 w-[180px] bg-[#2A4B6A] rounded mx-auto" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7 w-[300px]">
            <FormInputItem
              name="username"
              control={control}
              label="Username"
              placeholder="User Name"
              required
              error={errors.username?.message}
              prefix={
                <svg width="24" height="24" /* ...user icon SVG... */ />
              }
            />
            <FormInputItem
              name="password"
              control={control}
              label="Password"
              type="password"
              placeholder="Password"
              required
              error={errors.password?.message}
              prefix={
                <svg width="24" height="24" /* ...lock icon SVG... */ />
              }
              suffix={
                <svg width="24" height="24" /* ...eye icon SVG... */ />
              }
            />


            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-[#D9D9D9] accent-[#265ED6]" />
              <label htmlFor="remember" className="font-ibm text-[14px] text-[#2A2A2A]">Remember</label>
            </div>

            {errors.root && (
              <div className="rounded-md bg-red-50 p-4 w-full">
                <div className="flex">
                  <svg className="h-5 w-5 text-red-400" /* ...error icon SVG... */ />
                  <span className="ml-3 text-sm font-medium text-red-800">{errors.root.message}</span>
                </div>
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 rounded-full text-[16px] font-medium font-ibm bg-[#142B41] text-white shadow-md hover:bg-[#1a3350] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" /* ...spinner SVG... */ />
                  Signing in...
                </>
              ) : (
                'LOGIN'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 