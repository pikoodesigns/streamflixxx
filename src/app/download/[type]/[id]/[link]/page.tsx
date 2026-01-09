'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiAlertTriangle } from 'react-icons/fi';
import Script from 'next/script';

export default function DownloadProcessingPage() {
  const router = useRouter();
  const params = useParams();
  const [timeLeft, setTimeLeft] = useState(10);
  const [isComplete, setIsComplete] = useState(false);

  const linkNumber = params.link as string;

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
    }
  }, [timeLeft]);

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      {/* Ad Script - loads in head */}
      <Script
        src="https://pl28437089.effectivegatecpm.com/13/ba/2a/13ba2a458a513d263d79ef92472458dd.js"
        strategy="afterInteractive"
      />
      
      <div className="min-h-screen bg-netflix-black pt-16 sm:pt-20 pb-8 sm:pb-12 px-4">
      {/* Ad Section 1 */}
      <div className="max-w-4xl mx-auto mb-4 sm:mb-8">
        <div className="bg-netflix-dark-gray border border-gray-700 rounded-lg p-4 sm:p-8 text-center">
          <p className="text-netflix-gray text-xs sm:text-sm mb-2">Advertisement</p>
          <div className="h-20 sm:h-24 md:h-32 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded flex items-center justify-center">
            <p className="text-netflix-light-gray text-sm sm:text-lg">Ad Space 1</p>
          </div>
        </div>
      </div>

      {/* Processing Section */}
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-netflix-dark-gray rounded-lg p-6 sm:p-8 md:p-12 text-center"
        >
          {!isComplete ? (
            <>
              {/* Loading Animation */}
              <div className="mb-6 sm:mb-8">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto">
                  {/* Outer spinning ring */}
                  <motion.div
                    className="absolute inset-0 border-4 border-netflix-red/30 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                  {/* Inner spinning ring */}
                  <motion.div
                    className="absolute inset-2 border-4 border-t-netflix-red border-r-transparent border-b-transparent border-l-transparent rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                  {/* Center pulse */}
                  <motion.div
                    className="absolute inset-5 sm:inset-6 bg-netflix-red rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
              </div>

              {/* Processing Text */}
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-4">
                Processing Download Link {linkNumber}
              </h1>
              <p className="text-netflix-light-gray text-sm sm:text-base mb-4 sm:mb-6">
                Please wait while we prepare your download...
              </p>

              {/* Timer */}
              <div className="mb-6 sm:mb-8">
                <div className="text-4xl sm:text-5xl font-bold text-netflix-red mb-2">
                  {timeLeft}
                </div>
                <p className="text-netflix-gray text-xs sm:text-sm">seconds remaining</p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-1.5 sm:h-2 mb-2 sm:mb-4">
                <motion.div
                  className="bg-netflix-red h-1.5 sm:h-2 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${((10 - timeLeft) / 10) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-netflix-gray text-xs sm:text-sm">
                {Math.round(((10 - timeLeft) / 10) * 100)}% complete
              </p>
            </>
          ) : (
            <>
              {/* Error State */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mb-4 sm:mb-6"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
                  <FiAlertTriangle className="text-red-500 w-8 h-8 sm:w-10 sm:h-10" />
                </div>
              </motion.div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-4">
                Link is Broken
              </h1>
              <p className="text-netflix-light-gray text-sm sm:text-base mb-6 sm:mb-8">
                Sorry, this download link is no longer available or has expired.
                Please try another link or come back later.
              </p>

              {/* Back Button */}
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-black font-bold text-sm sm:text-base rounded hover:bg-white/80 transition-colors active:scale-95"
              >
                <FiArrowLeft size={18} />
                <span>Go Back</span>
              </button>
            </>
          )}
        </motion.div>
      </div>

      {/* Ad Section 2 */}
      <div className="max-w-4xl mx-auto mt-4 sm:mt-8">
        <div className="bg-netflix-dark-gray border border-gray-700 rounded-lg p-4 sm:p-8 text-center">
          <p className="text-netflix-gray text-xs sm:text-sm mb-2">Advertisement</p>
          <div className="h-20 sm:h-24 md:h-32 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded flex items-center justify-center">
            <p className="text-netflix-light-gray text-sm sm:text-lg">Ad Space 2</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="max-w-2xl mx-auto mt-6 sm:mt-8 text-center">
        <p className="text-netflix-gray text-[10px] sm:text-xs">
          This is a demo website for educational purposes only. 
          No actual downloads are provided.
        </p>
      </div>
    </div>
    </>
  );
}
