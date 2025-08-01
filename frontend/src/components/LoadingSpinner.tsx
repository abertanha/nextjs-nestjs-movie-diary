import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="w-16 h-16 border-4 border-t-4 border-gray-800 border-t-sky-500 rounded-full animate-spin"></div>
    </div>
  );
}