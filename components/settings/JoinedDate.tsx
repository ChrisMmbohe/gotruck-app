"use client";
import React from "react";

interface JoinedDateProps {
  date?: string;
}

export const JoinedDate: React.FC<JoinedDateProps> = ({ date }) => {
  if (!date) return <span>N/A</span>;
  const d = new Date(date);
  // Format as yyyy-MM-dd for SSR/client consistency
  const formatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return <span>{formatted}</span>;
};
