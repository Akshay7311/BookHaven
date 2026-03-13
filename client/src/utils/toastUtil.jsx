import { toast } from 'react-hot-toast';
import { Player } from '@lottiefiles/react-lottie-player';

// Reliable public Lottie Animation URLs
const SUCCESS_LOTTIE = 'https://lottie.host/7822a84d-2a1c-43f9-ba09-54b1f4864eb8/Knv0o93v9b.json';
const ERROR_LOTTIE = 'https://lottie.host/d1ed7f0f-6b2c-47bc-8f43-0b093121d51a/1o60gMowR2.json';

export const notify = {
  success: (message) => {
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-fade-in-up' : 'animate-fade-out-down'} max-w-sm w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex border border-gray-100 overflow-hidden`}>
        <div className="flex-1 w-0 p-3">
          <div className="flex items-center">
            <div className="flex-shrink-0 -ml-2">
              <Player
                autoplay
                keepLastFrame
                src={SUCCESS_LOTTIE}
                style={{ height: '60px', width: '60px' }}
              />
            </div>
            <div className="ml-0 flex-1">
              <p className="text-sm font-bold text-gray-900">
                Success!
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {message}
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-100">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-2xl p-4 flex items-center justify-center text-sm font-medium text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            Close
          </button>
        </div>
      </div>
    ), { duration: 3000 });
  },

  error: (message) => {
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-fade-in-up' : 'animate-fade-out-down'} max-w-sm w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex border border-red-50 py-1 overflow-hidden`}>
        <div className="flex-1 w-0 p-3">
          <div className="flex items-center">
            <div className="flex-shrink-0 -ml-2">
              <Player
                autoplay
                keepLastFrame
                speed={1.5}
                src={ERROR_LOTTIE}
                style={{ height: '60px', width: '60px' }}
              />
            </div>
            <div className="ml-0 flex-1">
              <p className="text-sm font-bold text-red-600">
                Oops!
              </p>
              <p className="mt-1 text-sm text-gray-600">
                {message}
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-100">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-2xl p-4 flex items-center justify-center text-sm font-medium text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    ), { duration: 4000 });
  }
};
