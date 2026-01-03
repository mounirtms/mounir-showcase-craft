import React, { useEffect, useState } from 'react';
import { useTheme } from './use-theme';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeTransition({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
