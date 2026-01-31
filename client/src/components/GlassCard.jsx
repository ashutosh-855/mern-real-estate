import React from 'react';

const GlassCard = ({ children, className = '', hover = true }) => {
    return (
        <div className={`
      bg-white/70 backdrop-blur-md 
      border border-white/30 
      rounded-3xl shadow-xl 
      overflow-hidden
      ${hover ? 'hover:shadow-2xl hover:scale-[1.02] transition-all duration-300' : ''}
      ${className}
    `}>
            {children}
        </div>
    );
};

export default GlassCard;
