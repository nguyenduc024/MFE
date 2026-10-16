import React from 'react';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';

export default function Breadcrumb({ items = [], onBack, navigate }) {
  return (
    <div className="bg-white px-6 py-2.5 shadow-xs select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <nav className="flex items-center space-x-1.5 text-xs text-gray-500 font-medium">
          <button 
            onClick={() => navigate('home')}
            className="flex items-center gap-1 hover:text-sky-700 transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-gray-400" />
            <span>Home</span>
          </button>

          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <React.Fragment key={idx}>
                <ChevronRight className="w-3 h-3 text-gray-400" />
                {isLast || !item.path ? (
                  <span className={`${isLast ? 'text-gray-800 font-semibold' : 'text-gray-500'}`}>
                    {item.label}
                  </span>
                ) : (
                  <button
                    onClick={() => navigate(item.path)}
                    className="hover:text-sky-700 transition-colors"
                  >
                    {item.label}
                  </button>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-sky-700 font-medium px-2 py-0.5 rounded hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        )}
      </div>
    </div>
  );
}
