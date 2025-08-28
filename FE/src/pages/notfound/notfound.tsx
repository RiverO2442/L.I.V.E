import { useNavigate } from "react-router-dom";
import { navigatePath } from "../../utility/router-config";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const handleGoHome = () => {
    // In a real app, you'd use your router's navigation
    navigate(`/${navigatePath.home}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        {/* Illustration/Emoji */}
        <div className="mb-8 animate-bounce">
          <span className="text-8xl">🧭</span>
        </div>

        {/* 404 Text with Gradient */}
        <h1 className="text-8xl md:text-9xl font-black mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          404
        </h1>

        {/* Error Message */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          Oops! The page you're looking for doesn't exist. It might have been
          moved, deleted, or you entered the wrong URL.
        </p>

        {/* Go Home Button */}
        <button
          onClick={handleGoHome}
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Go Home
        </button>

        {/* Additional Help Text */}
        <div className="mt-8 text-sm text-gray-500">
          <p>
            Need help? Try going back to the{" "}
            <button
              onClick={handleGoHome}
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              homepage
            </button>{" "}
            or contact support.
          </p>
        </div>
      </div>

      {/* Floating Elements for Visual Interest */}
      <div className="fixed top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="fixed bottom-10 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      <div className="fixed top-1/2 right-20 w-16 h-16 bg-indigo-200 rounded-full opacity-20 animate-pulse delay-500"></div>
    </div>
  );
}
