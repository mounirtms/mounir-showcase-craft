import React, { useEffect, useState } from 'react';
import { useTheme } from './theme-provider';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeTransition({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const [isChanging, setIsChanging] = useState(false);
  const [prevTheme, setPrevTheme] = useState(theme);

  useEffect(() => {
    if (theme !== prevTheme) {
      setIsChanging(true);
      setPrevTheme(theme);
      
      const timer = setTimeout(() => {
        setIsChanging(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [theme, prevTheme]);

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {isChanging && (
          <motion.div
            key="theme-transition"
            className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />
        )}
      </AnimatePresence>
      {children}
    </div>
  );
}
