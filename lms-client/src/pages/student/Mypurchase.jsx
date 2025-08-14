import React from 'react';
import { X } from 'lucide-react';

export default function Mypurchase({ onClose }) {
  // Later you can fetch actual purchase data here
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-4">My Purchases</h2>

        <div className="space-y-2">
          <p className="text-gray-600">You have no purchases yet.</p>
          {/* Example purchased course */}
          {/* <div className="p-3 border rounded">Course Name - ₹499</div> */}
        </div>

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}
