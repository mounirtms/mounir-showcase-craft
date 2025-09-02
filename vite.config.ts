import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    open: true,
    cors: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: mode === 'development',
    minify: mode === 'production' ? 'terser' : false,
    target: 'es2020',
    reportCompressedSize: false,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks for external dependencies
          if (id.includes('node_modules')) {
            // Core React and React DOM
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            // Firebase services
            if (id.includes('firebase')) {
              return 'firebase';
            }
            // UI components (Radix)
            if (id.includes('@radix-ui') || id.includes('class-variance-authority') || id.includes('clsx')) {
              return 'ui-vendor';
            }
            // Router
            if (id.includes('react-router-dom')) {
              return 'router';
            }
            // Icons
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            // Form handling
            if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform')) {
              return 'forms';
            }
            // Animation libraries
            if (id.includes('framer-motion')) {
              return 'animations';
            }
            // Date utilities
            if (id.includes('date-fns')) {
              return 'date-utils';
            }
            // Charts and analytics
            if (id.includes('recharts') || id.includes('d3')) {
              return 'charts';
            }
            // File handling
            if (id.includes('file-saver')) {
              return 'file-utils';
            }
            // Other vendor packages
            return 'vendor-misc';
          }
          
          // App-specific chunks
          // Admin components
          if (id.includes('/admin/')) {
            return 'admin';
          }
          // Portfolio components (split by feature)
          if (id.includes('/portfolio/')) {
            if (id.includes('Animation') || id.includes('ScrollAnimations')) {
              return 'portfolio-animations';
            }
            if (id.includes('Project') || id.includes('Gallery')) {
              return 'portfolio-projects';
            }
            if (id.includes('Skill') || id.includes('Experience')) {
              return 'portfolio-skills';
            }
            return 'portfolio';
          }
          // Shared utilities
          if (id.includes('/lib/')) {
            return 'utils';
          }
        },
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `assets/js/[name]-[hash].js`;
        },
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
      external: (id) => {
        // Don't bundle these as they should be loaded separately
        return id.includes('web-vitals') && mode === 'production';
      },
    },
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
        pure_funcs: mode === 'production' ? ['console.log', 'console.warn'] : [],
      },
      mangle: {
        safari10: true,
      },
    },
  },
  base: mode === 'production' ? '/' : '/',
  define: {
    'process.env': {},
    'import.meta.env.MODE': JSON.stringify(mode),
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      'react-hook-form',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      'lucide-react'
    ],
    exclude: ['@firebase/app-check'],
  },
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
    legalComments: 'none',
  },
}));
