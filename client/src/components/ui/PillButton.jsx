import React from 'react';

// Premium PillButton with gradient background and focus ring
const PillButton = ({ children, onClick, type = 'button', className = '', isLoading = false }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isLoading}
            className={`
        bg-gradient-to-r from-emerald-600 to-emerald-700
        text-white font-semibold py-3 px-8
        rounded-btn shadow-premium transform transition-all duration-300
        hover:-translate-y-0.5 hover:shadow-lg
        active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        focus-visible:ring-2 focus-visible:ring-emerald-500
        ${className}
      `}
        >
            {isLoading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
                children
            )}
        </button>
    );
};

export default PillButton;
