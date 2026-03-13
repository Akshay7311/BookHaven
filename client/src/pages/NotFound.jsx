import { Link } from 'react-router-dom';
import { Ghost, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <Ghost className="mx-auto h-24 w-24 text-gray-300 mb-6 animate-bounce" />
        <h1 className="text-9xl font-extrabold text-primary-600 tracking-tight">404</h1>
        <p className="text-2xl font-bold text-gray-900 mt-4">Page not found</p>
        <p className="text-gray-500 mt-2 mb-8 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Home size={20} />
          Back to BookHaven
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
