import React from "react";
import Link from "next/link";

interface LogoProps {
  light?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Logo({ light = false, size = "md" }: LogoProps) {
  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-11 h-11",
    lg: "w-14 h-14",
  };

  const titleSizes = {
    sm: "text-base font-bold",
    md: "text-lg md:text-xl font-extrabold",
    lg: "text-2xl font-black",
  };

  const subSizes = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
  };

  return (
    <Link href="/" className="inline-flex items-center gap-3 group transition-transform duration-200">
      {/* Emblem Simbol Madrasah Islami */}
      <div
        className={`relative flex items-center justify-center rounded-xl p-2 shadow-md transition-all duration-300 group-hover:scale-105 ${
          iconSizes[size]
        } ${
          light
            ? "bg-white text-emerald-800 shadow-emerald-950/20"
            : "bg-gradient-to-br from-emerald-800 to-emerald-950 text-amber-400 border border-emerald-700/40"
        }`}
      >
        {/* Star & Book SVG */}
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="currentColor">
          {/* Islamic 8-point geometric contour */}
          <path
            d="M20 2L24.5 7.5L32 6.5L33.5 14L40 18.5L36.5 25L40 31.5L33.5 36L32 43.5L24.5 42.5L20 48L15.5 42.5L8 43.5L6.5 36L0 31.5L3.5 25L0 18.5L6.5 14L8 6.5L15.5 7.5L20 2Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.35"
            transform="scale(0.8) translate(5, 5)"
          />
          {/* Open Book (Qur'an) */}
          <path
            d="M7 14C11 12 17 12 20 15C23 12 29 12 33 14V27C29 25 23 25 20 28C17 25 11 25 7 27V14Z"
            fill="currentColor"
          />
          <path d="M20 15V28" stroke="currentColor" strokeWidth="1.5" />
          {/* Radiant Sun / Nur */}
          <circle cx="20" cy="10" r="2.5" fill="#f59e0b" />
        </svg>
      </div>

      {/* Tulisan Identitas */}
      <div className="flex flex-col text-left">
        <span
          className={`leading-tight tracking-tight uppercase font-sans ${titleSizes[size]} ${
            light ? "text-white group-hover:text-amber-200" : "text-emerald-950 group-hover:text-emerald-800"
          }`}
        >
          MTs Al Falaahiyyah
        </span>
        <span
          className={`font-medium tracking-wide uppercase ${subSizes[size]} ${
            light ? "text-emerald-200/90" : "text-emerald-700"
          }`}
        >
          Cikoneng Kulon • Ganeas • Sumedang
        </span>
      </div>
    </Link>
  );
}
