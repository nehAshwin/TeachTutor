import React from 'react';

export default function Modal({ isOpen, onClose, message }) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl text-center">
          <h2 className="text-lg font-semibold mb-4">⚠️ Attention</h2>
          <p className="mb-6">{message}</p>
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            OK
          </button>
        </div>
      </div>
    );
  }