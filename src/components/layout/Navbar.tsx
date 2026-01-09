'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiBell, 
  FiChevronDown, 
  FiMenu, 
  FiX,
  FiUser,
  FiSettings,
  FiHelpCircle,
  FiLogOut
} from 'react-icons/fi';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { signOut } from '@/store/slices/userSlice';
import { setNavScrolled, setMobileMenuOpen, setSearchOpen } from '@/store/slices/uiSlice';
import { cn, getInitials } from '@/lib/utils';
import { NAV_LINKS } from '@/lib/constants';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchRef = useRef<HTMLInputElement>(null);
  
  const { isAuthenticated, activeProfile } = useAppSelector(state => state.user);
  const { isNavScrolled, isMobileMenuOpen, isSearchOpen } = useAppSelector(state => state.ui);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      dispatch(setNavScrolled(window.scrollY > 20));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch]);

  useEffect(() => {
    if (isSearchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      dispatch(setSearchOpen(false));
    }
  };

  const handleSignOut = () => {
    dispatch(signOut());
    router.push('/');
    setShowProfileMenu(false);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isNavScrolled ? 'bg-netflix-black' : 'bg-gradient-to-b from-black/80 to-transparent'
      )}
    >
      <nav className="flex items-center justify-between px-4 md:px-8 lg:px-12 py-3">
        {/* Logo */}
        <div className="flex items-center gap-6 lg:gap-10">
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-2xl md:text-3xl font-bold text-netflix-red tracking-tight">
              STREAMFLIX
            </h1>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <ul className="hidden lg:flex items-center gap-5">
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'text-sm font-medium transition-colors hover:text-white',
                      pathname === link.href ? 'text-white' : 'text-netflix-light-gray'
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Search - Available for everyone */}
          <div className="relative">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 'auto', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  onSubmit={handleSearch}
                  className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center"
                >
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Titles, people, genres"
                    className="w-48 md:w-64 px-4 py-1.5 bg-black/80 border border-white/50 text-white text-sm placeholder:text-gray-400 focus:outline-none focus:border-white"
                  />
                </motion.form>
              )}
            </AnimatePresence>
            <button
              onClick={() => dispatch(setSearchOpen(!isSearchOpen))}
              className="p-2 text-white hover:text-netflix-light-gray transition-colors"
            >
              {isSearchOpen ? <FiX size={20} /> : <FiSearch size={20} />}
            </button>
          </div>

          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <button className="hidden md:block p-2 text-white hover:text-netflix-light-gray transition-colors">
                <FiBell size={20} />
              </button>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 group"
                >
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: activeProfile?.avatar || '#E50914' }}
                  >
                    {activeProfile?.name ? getInitials(activeProfile.name) : 'U'}
                  </div>
                  <FiChevronDown
                    size={16}
                    className={cn(
                      'text-white transition-transform duration-200',
                      showProfileMenu && 'rotate-180'
                    )}
                  />
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-black/95 border border-gray-700 rounded shadow-lg overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-700">
                        <p className="text-white font-medium">{activeProfile?.name}</p>
                        <p className="text-sm text-netflix-light-gray">{activeProfile?.isKids ? 'Kids Profile' : 'Adult Profile'}</p>
                      </div>
                      <ul className="py-2">
                        <li>
                          <Link
                            href="/profiles"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center gap-3 px-4 py-2 text-netflix-light-gray hover:text-white hover:bg-white/10 transition-colors"
                          >
                            <FiUser size={18} />
                            <span>Manage Profiles</span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/account"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center gap-3 px-4 py-2 text-netflix-light-gray hover:text-white hover:bg-white/10 transition-colors"
                          >
                            <FiSettings size={18} />
                            <span>Account</span>
                          </Link>
                        </li>
                        <li>
                          <button
                            className="flex items-center gap-3 px-4 py-2 text-netflix-light-gray hover:text-white hover:bg-white/10 transition-colors w-full"
                          >
                            <FiHelpCircle size={18} />
                            <span>Help Center</span>
                          </button>
                        </li>
                      </ul>
                      <div className="border-t border-gray-700 py-2">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 px-4 py-2 text-netflix-light-gray hover:text-white hover:bg-white/10 transition-colors w-full"
                        >
                          <FiLogOut size={18} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => dispatch(setMobileMenuOpen(!isMobileMenuOpen))}
                className="lg:hidden p-2 text-white"
              >
                {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-4 py-1.5 bg-netflix-red text-white text-sm font-medium rounded hover:bg-netflix-red-hover transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isAuthenticated && isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-netflix-black border-t border-gray-800"
          >
            <ul className="py-4">
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => dispatch(setMobileMenuOpen(false))}
                    className={cn(
                      'block px-6 py-3 text-base font-medium transition-colors',
                      pathname === link.href ? 'text-white bg-white/10' : 'text-netflix-light-gray hover:text-white hover:bg-white/5'
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
