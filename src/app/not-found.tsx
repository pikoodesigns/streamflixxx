export default function NotFound() {
  return (
    <div className="min-h-screen bg-netflix-black flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl md:text-9xl font-bold text-netflix-red mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl text-white mb-4">Lost your way?</h2>
        <p className="text-netflix-light-gray mb-8 max-w-md mx-auto">
          Sorry, we can't find that page. You'll find lots to explore on the home page.
        </p>
        <a
          href="/"
          className="inline-block px-8 py-3 bg-white text-black font-semibold rounded hover:bg-netflix-light-gray transition-colors"
        >
          StreamFlix Home
        </a>
        <p className="mt-8 text-netflix-gray text-sm">
          Error Code: <span className="text-white">NSES-404</span>
        </p>
      </div>
    </div>
  );
}
