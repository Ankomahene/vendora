// A utility for managing session storage
// Only to be imported in client components

export type SessionData = {
  email?: string;
  isPasswordReset?: boolean;
  role?: string;
  full_name?: string;
};

const SESSION_KEY = 'vendora-auth-data';

// Store authentication-related data in sessionStorage
export function storeSessionData(data: SessionData): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  }
}

// Get authentication-related data from sessionStorage
export function getSessionData(): SessionData {
  if (typeof window !== 'undefined') {
    const data = sessionStorage.getItem(SESSION_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error('Failed to parse session data', e);
      }
    }
  }
  return {};
}

// Clear authentication-related data from sessionStorage
export function clearSessionData(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(SESSION_KEY);
  }
}

// Store a specific field in the session data
export function updateSessionData(
  field: keyof SessionData,
  value: string | boolean
): void {
  const currentData = getSessionData();
  storeSessionData({
    ...currentData,
    [field]: value,
  });
}
