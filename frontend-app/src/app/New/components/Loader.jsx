import React from 'react'
import { FaUniversity, FaCircleNotch } from 'react-icons/fa';

const Loader = () => {
    return (
        <div className="h-screen w-full z-10 flex flex-col items-center justify-center  bg-opacity-20 ">
          {/* Logo and Institution Container */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <img 
                src="/DTU,_Delhi_official_logo.png" 
                alt="DTU Logo" 
                className="h-20 w-20 object-contain"
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Delhi Technological University
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              
            </p>
          </div>
    
          {/* Loading Indicator */}
          <div className="relative">
            <FaCircleNotch className="w-12 h-12 text-blue-600 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <FaUniversity className="w-5 h-5 text-blue-800" />
            </div>
          </div>
    
          {/* Loading Status */}
          <div className="mt-6 text-center">
            <p className="text-black text-lg  font-bold">Loading System Data</p>
            <div className="flex justify-center mt-2 space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
            </div>
          </div>
    
          {/* Loading Progress */}
          <div className="mt-8 w-64">
            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full animate-progress"></div>
            </div>
          </div>
        </div>
      );
}

export default Loader