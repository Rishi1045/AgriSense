
import React from 'react';
import * as Icons from '@phosphor-icons/react';

// Eye‑catchy advisory box with glass‑morphism and premium styling
const AdvisoryBox = ({ type, title, message, icon }) => {
    const typeMap = {
        danger: {
            bg: 'bg-red-50/70',
            border: 'border-l-4 border-red-500',
            iconColor: 'text-red-500',
        },
        warning: {
            bg: 'bg-amber-50/70',
            border: 'border-l-4 border-amber-500',
            iconColor: 'text-amber-500',
        },
        success: {
            bg: 'bg-emerald-50/70',
            border: 'border-l-4 border-emerald-500',
            iconColor: 'text-emerald-500',
        },
        default: {
            bg: 'bg-slate-50/70',
            border: 'border-l-4 border-slate-500',
            iconColor: 'text-slate-500',
        },
    };

    const style = typeMap[type] || typeMap['default'];
    const IconComponent = Icons[icon] || Icons.Info;

    return (
        <div
            className={`p-5 rounded-xl ${style.bg} ${style.border} backdrop-blur-md border-slate-200 shadow-premium transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl`}
        >
            <div className="flex items-start gap-4">
                <IconComponent size={36} weight="duotone" className={`${style.iconColor} flex-shrink-0 mt-1`} />
                <div>
                    <h4 className="font-heading font-bold text-slate-800 text-xl mb-2">{title}</h4>
                    <p className="font-body text-slate-600 text-sm leading-relaxed">{message}</p>
                </div>
            </div>
        </div>
    );
};

export default AdvisoryBox;

