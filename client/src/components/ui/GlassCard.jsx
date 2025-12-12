import React from 'react';

// Premium glass‑morphism card component
const GlassCard = ({ children, className = '' }) => {
    return (
        <div
            className={`bg-white/30 rounded-2xl shadow-premium border border-slate-200/80 backdrop-blur-lg p-5 transition-transform duration-300 hover:scale-105 ${className}`}
        >
            {children}
        </div>
    );
};

export default GlassCard;
