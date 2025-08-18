import React from "react";
import { ThemedText } from '../ThemedText';

function timeAgo(iso: string) {
  const then = new Date(iso).getTime();
  const diff = Math.max(0, Date.now() - then);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

export const TimeAgo = ({ iso }: { iso: string }) => (
  <ThemedText type="placeholder">{timeAgo(iso)}</ThemedText>
);
