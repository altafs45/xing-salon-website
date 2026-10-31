import { useSyncExternalStore } from 'react';
import { locations } from '../data/branches';

// The visitor's chosen salon, remembered across visits and shared by the branches section, the branch picker
// and the sticky bar, so a choice made in one place applies everywhere.
const STORAGE_KEY = 'xing-branch';
const CHANGE = 'xing-branch-change';

const isBranch = (id: string | null): id is string => !!id && locations.some((salon) => salon.id === id);

/** The remembered salon id, or null if none has been chosen (or storage is unavailable). */
export function getBranch(): string | null {
  try {
    const id = localStorage.getItem(STORAGE_KEY);
    return isBranch(id) ? id : null;
  } catch {
    return null;
  }
}

export function setBranch(id: string) {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Private mode or blocked storage: the choice simply isn't remembered.
  }
  window.dispatchEvent(new Event(CHANGE));
}

/** Forgets the chosen salon ("All salons"). */
export function clearBranch() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage blocked: nothing was remembered.
  }
  window.dispatchEvent(new Event(CHANGE));
}

const subscribe = (onChange: () => void) => {
  window.addEventListener(CHANGE, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(CHANGE, onChange);
    window.removeEventListener('storage', onChange);
  };
};

/** The remembered salon id, kept in sync wherever it is changed. */
export const useBranch = () => useSyncExternalStore(subscribe, getBranch, () => null);

/**
 * The salon a link asks for: "/#branches?b=hsr-layout" or "/about#hsr-layout".
 * Returns undefined when the address names none.
 */
export function branchFromHash(hash: string): string | undefined {
  const [anchor, query = ''] = hash.replace(/^#/, '').split('?');
  const id = new URLSearchParams(query).get('b') ?? anchor;
  return isBranch(id) ? id : undefined;
}
