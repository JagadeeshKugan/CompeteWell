"use client";

import React, { useState } from "react";

interface BarData {
  label: string;
  value: number;
}

const data: BarData[] = [
  { label: "Wk 1", value: 15 },
  { label: "Wk 2", value: 25 },
  { label: "Wk 3", value: 22 },
  { label: "Wk 4", value: 32 },
  { label: "Wk 5", value: 40 },
  { label: "Wk 6", value: 28 },
  { label: "Wk 7", value: 45 },
  { label: "Wk 8", value: 50 },
];

export default function ReviewVolumeChart() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxValue = 60;
  const graphHeight = 160;

  return (
    <div className="bg-white border border-slate-100/80 p-5 rounded-2xl shadow-sm flex flex-col flex-1 h-[280px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <h3 className="font-bold text-slate-800 text-sm tracking-tight mb-0.5">
            Review Volume
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">
            Weekly reviews across tracked locations
          </span>
        </div>
        <div className="text-[10px] uppercase font-mono px-2 py-0.5 bg-slate-50 border border-slate-100 text-slate-500 rounded font-bold">
          Last 8 weeks
        </div>
      </div>

      {/* SVG Container */}
      <div className="flex-1 relative flex items-end justify-between gap-2 mt-2 h-full">
        {data.map((item, idx) => {
          const heightPercent = (item.value / maxValue) * graphHeight;
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center justify-end h-full cursor-pointer relative group"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip on hover */}
              {isHovered && (
                <div className="absolute bottom-[85%] mb-2 px-2.5 py-1 bg-slate-900 text-white text-[10px] font-bold rounded shadow-md pointer-events-none z-10 transition-all duration-200">
                  {item.value} reviews
                </div>
              )}

              {/* Bar */}
              <div
                style={{ height: `${heightPercent}px` }}
                className={`w-full max-w-[28px] rounded-t-md transition-all duration-300 ${
                  isHovered ? "bg-emerald-500 shadow-md shadow-emerald-500/20" : "bg-emerald-400/85"
                }`}
              />

              {/* Label */}
              <span className="text-[10px] text-slate-400 font-medium mt-2">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
