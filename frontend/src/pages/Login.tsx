import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Header from '../components/Header';
import { Brain, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import GoogleLoginButton from '../components/GoogleLoginButton';

// ===== Validation Schema =====
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    const result = await login(data);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setServerError(result.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="bg-background-light min-h-screen flex flex-col font-display">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4 py-12 sakura-bg animate-fadeIn">
        <div className="w-full max-w-[480px]">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-[#f3e7ed] transform transition-all hover:shadow-2xl">
            <div className="px-8 pt-8 pb-4 text-center">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4 animate-bounce">
                <Brain className="text-primary" size={32} />
              </div>
              <h1 className="text-[#1b0d14] text-3xl font-bold leading-tight">おかえりなさい</h1>
              <p className="text-[#9a4c73] text-base font-normal mt-2">Welcome back to your journey</p>
            </div>
            
            <div className="px-8 py-6">
              {/* Server Error Alert */}
              {serverError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                  <p className="text-red-600 text-sm">{serverError}</p>
                </div>
              )}

              <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-2">
                  <label className="text-[#1b0d14] text-sm font-semibold px-1">Email Address</label>
                  <input 
                    {...register('email')}
                    className={`w-full rounded-lg border ${errors.email ? 'border-red-400' : 'border-[#e5d5dd]'} bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-gray-400 transition-all`} 
                    placeholder="example@sakura.ai" 
                    type="email"
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs px-1">{errors.email.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[#1b0d14] text-sm font-semibold">Password</label>
                    <a className="text-primary text-xs font-medium hover:underline" href="#">Forgot Password?</a>
                  </div>
                  <input 
                    {...register('password')}
                    className={`w-full rounded-lg border ${errors.password ? 'border-red-400' : 'border-[#e5d5dd]'} bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-gray-400 transition-all`} 
                    placeholder="••••••••" 
                    type="password"
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs px-1">{errors.password.message}</p>
                  )}
                </div>
                <button 
                  className="w-full bg-primary text-white py-3.5 rounded-lg font-bold text-base shadow-lg shadow-primary/20 hover:opacity-90 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed" 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Logging in...
                    </>
                  ) : (
                    <>
                      Log In <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#e5d5dd]"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Google Login */}
              <GoogleLoginButton />
            </div>
            
            <div className="px-8 py-6 bg-gray-50 text-center border-t border-[#f3e7ed]">
              <p className="text-sm text-[#9a4c73]">
                New to NihonLet ?{' '}
                <Link className="text-primary font-bold hover:underline" to="/register">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;