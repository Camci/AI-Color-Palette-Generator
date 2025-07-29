
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-12 h-12 border-4 border-t-4 border-gray-600 border-t-cyan-400 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
