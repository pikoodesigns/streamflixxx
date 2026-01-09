'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signIn, signUp } from '@/store/slices/userSlice';
import { STORAGE_KEYS } from '@/lib/constants';
import { getFromStorage } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!name.trim()) {
          setError('Please enter your name');
          return;
        }
        dispatch(signUp({ email, name, password }));
        router.push('/profiles');
      } else {
        // Check if user exists
        const savedUser = getFromStorage<{ email: string } | null>(STORAGE_KEYS.USER, null);
        if (!savedUser) {
          setError('No account found. Please sign up first.');
          return;
        }
        if (savedUser.email !== email) {
          setError('Invalid email or password');
          return;
        }
        dispatch(signIn({ email, password }));
        router.push('/profiles');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-netflix-black relative">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: 'url(https://assets.nflxext.com/ffe/siteui/vlv3/93da5c27-be66-427c-8b72-5cb39d275279/94eb5ad7-10d8-4571-b2bb-0250eeffcda3/US-en-20240226-popsignuptwoweeks-perspective_alpha_website_large.jpg)',
        }}
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-black/75 rounded-lg p-8 md:p-14"
        >
          <h1 className="text-3xl font-bold text-white mb-8">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Name"
                  className="w-full px-4 py-3 bg-[#333] text-white rounded focus:outline-none focus:ring-2 focus:ring-netflix-red"
                  required
                />
              </div>
            )}

            <div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 bg-[#333] text-white rounded focus:outline-none focus:ring-2 focus:ring-netflix-red"
                required
              />
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 bg-[#333] text-white rounded focus:outline-none focus:ring-2 focus:ring-netflix-red"
                required
                minLength={4}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-netflix-red text-white font-semibold rounded hover:bg-netflix-red-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          {/* Toggle Sign In / Sign Up */}
          <div className="mt-8 text-netflix-gray">
            {isSignUp ? (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setIsSignUp(false)}
                  className="text-white hover:underline"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                New to StreamFlix?{' '}
                <button
                  onClick={() => setIsSignUp(true)}
                  className="text-white hover:underline"
                >
                  Sign up now
                </button>
              </p>
            )}
          </div>

          {/* Demo Info */}
          <div className="mt-6 p-4 bg-[#333]/50 rounded text-sm text-netflix-light-gray">
            <p className="font-medium text-white mb-2">Secure Mode</p>
            <p>Your data isn't stored anywhere. Enjoy watching pirate.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
