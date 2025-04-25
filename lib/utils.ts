import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSystemTheme() {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return 'light';
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type DistanceUnit = 'km' | 'miles' | 'm';

/**
 * Calculates the distance between two geographic coordinates using the Haversine formula
 * @param point1 First location coordinates {latitude, longitude}
 * @param point2 Second location coordinates {latitude, longitude}
 * @param unit The unit of measurement ('km', 'miles', or 'm')
 * @returns The distance between the two points in the specified unit
 */
export function calculateDistance(
  point1: Coordinates,
  point2: Coordinates,
  unit: DistanceUnit = 'km'
): number {
  // Earth's radius in kilometers
  const earthRadiusKm = 6371;

  // Convert latitude and longitude from degrees to radians
  const lat1Rad = (point1.latitude * Math.PI) / 180;
  const lon1Rad = (point1.longitude * Math.PI) / 180;
  const lat2Rad = (point2.latitude * Math.PI) / 180;
  const lon2Rad = (point2.longitude * Math.PI) / 180;

  // Haversine formula
  const dLat = lat2Rad - lat1Rad;
  const dLon = lon2Rad - lon1Rad;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distance in kilometers
  let distance = earthRadiusKm * c;

  // Convert to requested unit
  if (unit === 'miles') {
    distance = distance * 0.621371; // km to miles
  } else if (unit === 'm') {
    distance = distance * 1000; // km to meters
  }

  // Round to 2 decimal places
  return Math.round(distance * 100) / 100;
}
