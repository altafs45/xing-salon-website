import { useState } from 'react';

/**
 * True when the build already painted this page's opening section as plain HTML (#first-paint, see SHELLS in
 * vite.config.ts). That markup stays put, so the page then skips drawing the section itself.
 */
export const useHasShell = () => useState(() => !!document.getElementById('first-paint'))[0];
