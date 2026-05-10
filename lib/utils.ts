import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function addDaysIso(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function normalizeUrl(value = "") {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function currencyOpportunity(score: number) {
  if (score >= 76) return "$4k-$12k/mo growth opportunity";
  if (score >= 56) return "$2k-$7k/mo growth opportunity";
  if (score >= 31) return "$1k-$4k/mo improvement opportunity";
  return "Early-stage research opportunity";
}
