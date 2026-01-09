'use client';

import { useEffect, useRef } from 'react';

interface AdBannerProps {
  type: 'native' | 'banner300x250';
  className?: string;
}

export default function AdBanner({ type, className = '' }: AdBannerProps) {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const adLoaded = useRef(false);

  useEffect(() => {
    if (!adContainerRef.current || adLoaded.current) return;

    if (type === 'native') {
      // Native ad with container
      const script = document.createElement('script');
      script.src = 'https://pl28437139.effectivegatecpm.com/5d86b8760678d939397f93a2f6ec1958/invoke.js';
      script.async = true;
      
      // Create container with specific ID
      const container = document.createElement('div');
      container.id = 'container-5d86b8760678d939397f93a2f6ec1958';
      adContainerRef.current.appendChild(container);
      adContainerRef.current.appendChild(script);
      adLoaded.current = true;
    } else if (type === 'banner300x250') {
      // 300x250 Banner ad
      (window as any).atOptions = {
        'key': 'd38148816b162d8fa23e7fb2ec10374f',
        'format': 'iframe',
        'height': 250,
        'width': 300,
        'params': {}
      };

      const script = document.createElement('script');
      script.src = 'https://www.highperformanceformat.com/d38148816b162d8fa23e7fb2ec10374f/invoke.js';
      script.async = true;
      adContainerRef.current.appendChild(script);
      adLoaded.current = true;
    }
  }, [type]);

  return (
    <div className={`flex justify-center ${className}`}>
      <div className="bg-netflix-dark-gray/50 border border-gray-800 rounded-lg p-4 text-center">
        <p className="text-netflix-gray text-xs mb-2">Advertisement</p>
        <div 
          ref={adContainerRef} 
          className={`flex items-center justify-center ${type === 'banner300x250' ? 'min-h-[250px] min-w-[300px]' : 'min-h-[100px]'}`}
        />
      </div>
    </div>
  );
}
