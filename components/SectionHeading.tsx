import React from "react";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionHeading({
  badge,
  title,
  subtitle,
  centered = true,
  light = false,
}: SectionHeadingProps) {
  return (
    <div className={`mb-12 ${centered ? "text-center max-w-3xl mx-auto" : "max-w-2xl"}`}>
      {badge && (
        <span
          className={`inline-block text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-3 shadow-sm ${
            light
              ? "bg-emerald-900/60 text-emerald-200 border border-emerald-700/50"
              : "bg-emerald-50 text-emerald-800 border border-emerald-200"
          }`}
        >
          {badge}
        </span>
      )}
      <h2
        className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight ${
          light ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h2>

      {/* Islamic style subtle accent ornament */}
      <div className={`flex items-center gap-2 my-3.5 ${centered ? "justify-center" : "justify-start"}`}>
        <span className={`h-0.5 w-8 rounded ${light ? "bg-amber-400/60" : "bg-emerald-600"}`} />
        <span className={`rotate-45 w-2 h-2 ${light ? "bg-amber-400" : "bg-amber-500"}`} />
        <span className={`h-0.5 w-8 rounded ${light ? "bg-amber-400/60" : "bg-emerald-600"}`} />
      </div>

      {subtitle && (
        <p className={`text-base sm:text-lg leading-relaxed ${light ? "text-emerald-100/90" : "text-slate-600"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
