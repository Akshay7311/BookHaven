import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed?",
  confirmText = "Delete",
  cancelText = "Cancel",
  type = "danger" // danger, warning, info
}) => {
  if (!isOpen) return null;

  const typeConfig = {
    danger: {
      icon: <AlertTriangle className="text-red-600" size={24} />,
      btnClass: "bg-red-600 hover:bg-red-700 text-white",
      iconBg: "bg-red-100"
    },
    warning: {
      icon: <AlertTriangle className="text-amber-600" size={24} />,
      btnClass: "bg-amber-600 hover:bg-amber-700 text-white",
      iconBg: "bg-amber-100"
    },
    info: {
      icon: <AlertTriangle className="text-blue-600" size={24} />,
      btnClass: "bg-blue-600 hover:bg-blue-700 text-white",
      iconBg: "bg-blue-100"
    }
  };

  const config = typeConfig[type] || typeConfig.danger;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header/Close Button (Hidden or minimal for clean look) */}
        <div className="absolute top-4 right-4">
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 transition-colors rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 ${config.iconBg} rounded-full flex items-center justify-center flex-shrink-0 animate-bounce-subtle`}>
              {config.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            </div>
          </div>

          <p className="text-gray-600 text-base leading-relaxed mb-8">
            {message}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
             <button
              onClick={onClose}
              className="flex-1 px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all active:scale-95"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 px-6 py-3 text-sm font-semibold rounded-xl shadow-lg shadow-red-500/20 transition-all active:scale-95 ${config.btnClass}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
