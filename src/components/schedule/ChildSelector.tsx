"use client";

import type { Child } from "@/data/parent";

interface ChildSelectorProps {
  children: Child[];
  selectedChildId: string | null;
  onSelectChild: (id: string) => void;
  // Fallback: manual birth year selection when no children
  birthYears: string[];
  selectedBirthYear: string;
  onSelectBirthYear: (year: string) => void;
}

export default function ChildSelector({
  children,
  selectedChildId,
  onSelectChild,
  birthYears,
  selectedBirthYear,
  onSelectBirthYear,
}: ChildSelectorProps) {
  const hasChildren = children.length > 0;

  return (
    <div className="mb-6">
      <p
        className="text-xs font-semibold mb-3 tracking-widest uppercase"
        style={{ color: "rgba(255,255,255,0.3)" }}
      >
        {hasChildren ? "בחירת ילד/ה" : "שנתון"}
      </p>

      {hasChildren ? (
        <div className="flex flex-wrap gap-2">
          {children.map((child) => {
            const isSelected = child.id === selectedChildId;
            return (
              <button
                key={child.id}
                onClick={() => onSelectChild(child.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm transition-all"
                style={
                  isSelected
                    ? {
                        background: "rgba(201,168,76,0.15)",
                        border: "1px solid rgba(201,168,76,0.5)",
                        color: "#c9a84c",
                      }
                    : {
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.55)",
                      }
                }
              >
                <span>{child.name}</span>
                <span
                  className="text-xs font-normal"
                  style={{
                    color: isSelected
                      ? "rgba(201,168,76,0.7)"
                      : "rgba(255,255,255,0.3)",
                  }}
                >
                  ({child.birthYear})
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        /* Fallback: manual birth year picker */
        <div className="flex flex-wrap gap-2">
          {birthYears.map((year) => {
            const isSelected = year === selectedBirthYear;
            return (
              <button
                key={year}
                onClick={() => onSelectBirthYear(year)}
                className="px-4 py-2 rounded-xl font-bold text-sm transition-all"
                style={
                  isSelected
                    ? {
                        background: "rgba(201,168,76,0.15)",
                        border: "1px solid rgba(201,168,76,0.5)",
                        color: "#c9a84c",
                      }
                    : {
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.55)",
                      }
                }
              >
                שנתון {year}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
