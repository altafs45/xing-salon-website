import type { KeyboardEvent } from 'react';

/** Arrow / Home / End navigation for the tabs inside a role="tablist". */
export function onTabKeyDown(e: KeyboardEvent<HTMLElement>, index: number, count: number, select: (i: number) => void) {
  let next = index;
  if (e.key === 'ArrowRight') next = (index + 1) % count;
  else if (e.key === 'ArrowLeft') next = (index - 1 + count) % count;
  else if (e.key === 'Home') next = 0;
  else if (e.key === 'End') next = count - 1;
  else return;
  e.preventDefault();
  select(next);
  e.currentTarget.closest('[role="tablist"]')?.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus();
}
