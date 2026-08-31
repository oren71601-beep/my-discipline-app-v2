import React from 'react';

interface Option<T> {
  value: T;
  label: string;
}

interface SlashOptionSelectorProps<T extends string | number> {
  options: Option<T>[];
  selectedValue: T | null;
  onChange: (value: T) => void;
  disabled?: boolean;
  highlightColor?: 'green' | 'amber' | 'red' | 'indigo' | 'rose' | 'emerald' | 'blue';
  markStyle?: 'circle' | 'v';
}

export function SlashOptionSelector<T extends string | number>({
  options,
  selectedValue,
  onChange,
  disabled = false,
  highlightColor = 'indigo',
  markStyle = 'circle',
}: SlashOptionSelectorProps<T>) {
  
  // Custom hand-drawn outline circles based on theme
  const getHighlightClass = (isActive: boolean) => {
    if (!isActive) return 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/70';
    
    switch (highlightColor) {
      case 'green':
        return 'text-emerald-700 bg-emerald-50 border-emerald-500 border-2 rounded-[52%_48%_50%_50%_/_48%_52%_48%_52%] scale-105';
      case 'rose':
        return 'text-rose-700 bg-rose-50 border-rose-500 border-2 rounded-[46%_54%_50%_50%_/_54%_46%_50%_50%] scale-105 font-medium';
      case 'red':
        return 'text-red-700 bg-red-50 border-red-500 border-2 rounded-[48%_52%_45%_55%_/_50%_48%_52%_50%] scale-105 font-medium';
      case 'amber':
        return 'text-amber-700 bg-amber-50 border-amber-500 border-2 rounded-[50%_50%_48%_52%_/_52%_48%_52%_48%] scale-105';
      case 'emerald':
        return 'text-emerald-700 bg-emerald-50 border-emerald-500 border-2 rounded-[52%_48%_51%_49%_/_49%_51%_49%_51%] scale-105';
      case 'blue':
        return 'text-blue-700 bg-blue-50 border-blue-500 border-2 rounded-[49%_51%_50%_50%_/_51%_49%_52%_48%] scale-105';
      case 'indigo':
      default:
        return 'text-indigo-700 bg-indigo-50 border-indigo-500 border-2 rounded-[47%_53%_49%_51%_/_53%_47%_51%_49%] scale-105 font-medium';
    }
  };

  return (
    <div 
      className={`inline-flex items-center flex-wrap justify-center gap-x-1.5 gap-y-1 text-sm select-none ${
        disabled ? 'opacity-40 pointer-events-none' : ''
      }`}
      dir="rtl"
    >
      {options.map((opt, idx) => {
        const isActive = selectedValue === opt.value;
        return (
          <React.Fragment key={String(opt.value)}>
            {idx > 0 && <span className="text-slate-300 font-light mx-0.5">/</span>}
            <button
              type="button"
              onClick={() => {
                if (!disabled) {
                  // To toggle selection or change
                  onChange(isActive ? (null as unknown as T) : opt.value);
                }
              }}
              className={`relative px-2 py-0.5 transition-all duration-200 cursor-pointer ease-out whitespace-nowrap focus:outline-none ${getHighlightClass(
                isActive
              )}`}
            >
              {/* Optional tiny Check mark overlay if markStyle is 'v' */}
              {isActive && markStyle === 'v' && (
                <span className="absolute -top-1.5 -right-1 text-red-600 drop-shadow-sm text-[10px] font-bold">
                  ✓
                </span>
              )}
              
              <span className="relative z-10">{opt.label}</span>
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}
