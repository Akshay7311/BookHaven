import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-20">
      <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
    </div>
  );
};

export default LoadingSpinner;
