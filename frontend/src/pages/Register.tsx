import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Header from '../components/Header';
import { FileEdit, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import GoogleLoginButton from '../components/GoogleLoginButton';

// ===== Validation Schema =====
const registerSchema = z.object({
  fullName: z.string()
    .min(1, 'Full name is required')
    .max(100, 'Full name must be less than 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    setFieldErrors({});
    
    const result = await registerUser(data);
    if (result.success) {
      navigate('/dashboard');
    } else {
      if (result.errors) {
        setFieldErrors(result.errors);
      }
      setServerError(result.error || 'Registration failed. Please try again.');
    }
  };

  const getFieldError = (fieldName: string) => {
    const clientError = errors[fieldName as keyof RegisterFormData]?.message;
    const serverFieldErrors = fieldErrors[fieldName] || fieldErrors[fieldName.charAt(0).toUpperCase() + fieldName.slice(1)];
    return clientError || (serverFieldErrors ? serverFieldErrors[0] : null);
  };

  return (
    <div className="bg-background-light min-h-screen sakura-bg">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-10 animate-fadeIn">
        <div className="w-full max-w-[520px] bg-white rounded-xl shadow-xl p-8 border border-[#e7cfdb]">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <FileEdit className="text-primary" size={30} />
            </div>
            <h1 className="text-[#1b0d14] text-[32px] font-bold leading-tight text-center">Create Your Account</h1>
            <p className="text-[#64324d] text-base mt-2 text-center">Start your Japanese journey today.</p>
          </div>

          {/* Server Error Alert */}
          {serverError && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
              <p className="text-red-600 text-sm">{serverError}</p>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label className="flex flex-col w-full">
                <p className="text-[#1b0d14] text-sm font-medium pb-2">Full Name</p>
                <input
                  {...register('fullName')}
                  className={`form-input flex w-full rounded-lg text-[#1b0d14] focus:ring-2 focus:ring-primary/50 border ${getFieldError('fullName') ? 'border-red-400' : 'border-[#e7cfdb]'} bg-transparent h-14 p-4 transition-all`}
                  placeholder="Enter your full name"
                  type="text"
                  disabled={isLoading}
                />
              </label>
              {getFieldError('fullName') && (
                <p className="text-red-500 text-xs px-1">{getFieldError('fullName')}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="flex flex-col w-full">
                <p className="text-[#1b0d14] text-sm font-medium pb-2">Email Address</p>
                <input
                  {...register('email')}
                  className={`form-input flex w-full rounded-lg text-[#1b0d14] focus:ring-2 focus:ring-primary/50 border ${getFieldError('email') ? 'border-red-400' : 'border-[#e7cfdb]'} bg-transparent h-14 p-4 transition-all`}
                  placeholder="Enter your email address"
                  type="email"
                  disabled={isLoading}
                />
              </label>
              {getFieldError('email') && (
                <p className="text-red-500 text-xs px-1">{getFieldError('email')}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="flex flex-col w-full">
                <p className="text-[#1b0d14] text-sm font-medium pb-2">Password</p>
                <input
                  {...register('password')}
                  className={`form-input flex w-full rounded-lg text-[#1b0d14] focus:ring-2 focus:ring-primary/50 border ${getFieldError('password') ? 'border-red-400' : 'border-[#e7cfdb]'} bg-transparent h-14 p-4 transition-all`}
                  placeholder="••••••••"
                  type="password"
                  disabled={isLoading}
                />
              </label>
              {getFieldError('password') && (
                <p className="text-red-500 text-xs px-1">{getFieldError('password')}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
              <label className="flex flex-col w-full">
                <p className="text-[#1b0d14] text-sm font-medium pb-2">Confirm Password</p>
                <input
                  {...register('confirmPassword')}
                  className={`form-input flex w-full rounded-lg text-[#1b0d14] focus:ring-2 focus:ring-primary/50 border ${getFieldError('confirmPassword') ? 'border-red-400' : 'border-[#e7cfdb]'} bg-transparent h-14 p-4 transition-all`}
                  placeholder="••••••••"
                  type="password"
                  disabled={isLoading}
                />
              </label>
              {getFieldError('confirmPassword') && (
                <p className="text-red-500 text-xs px-1">{getFieldError('confirmPassword')}</p>
              )}
            </div>

            <button 
              className="w-full flex cursor-pointer items-center justify-center rounded-lg h-14 px-5 bg-primary text-white text-base font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e7cfdb]"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Google Login */}
          <GoogleLoginButton />

          <div className="mt-8 text-center">
            <p className="text-[#64324d] text-sm">
              Already have an account?{' '}
              <Link className="text-primary font-bold hover:underline ml-1" to="/login">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;