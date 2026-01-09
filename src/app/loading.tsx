export default function Loading() {
  return (
    <div className="min-h-screen bg-netflix-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Netflix-style Loading Animation */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-netflix-red/30 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-netflix-red rounded-full animate-spin"></div>
        </div>
        <p className="text-netflix-light-gray">Loading...</p>
      </div>
    </div>
  );
}
