/**
 * AssetLoader - Enhanced utility for loading and managing assets
 */

export interface AssetLoadOptions {
  fallback?: string;
  placeholder?: string;
  timeout?: number;
  retries?: number;
  baseUrl?: string;
}

interface Asset {
  path: string;
  type: 'image' | 'style' | 'script' | 'font';
  fullPath?: string;
}

export class AssetLoader {
  private static cache = new Map<string, Promise<string>>();
  private static preloadedAssets = new Map<string, Asset>();
  private static baseUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000'
    : 'https://mounir1.github.io';

  private static assetPaths = {
    images: '/assets/images',
    icons: '/assets/icons',
    docs: '/assets/docs',
    qr: '/qr',
    css: '/css'
  };

  private static getAssetKey(asset: Asset): string {
    return `${asset.type}:${asset.path}`;
  }

  private static getAssetUrl(path: string): string {
    return new URL(path, this.baseUrl).toString();
  }

  /**
   * Load an image with fallback support
   */
  static async loadImage(src: string, options: AssetLoadOptions = {}): Promise<string> {
    const {
      fallback,
      placeholder = 'assets/images/hero-bg.webp',
      timeout = 10000,
      retries = 2
    } = options;

    // Check cache first
    if (this.cache.has(src)) {
      return this.cache.get(src)!;
    }

    const loadPromise = this.attemptImageLoad(src, fallback, placeholder, timeout, retries);
    this.cache.set(src, loadPromise);

    return loadPromise;
  }

  /**
   * Attempt to load image with retries and fallbacks
   */
  private static async attemptImageLoad(
    src: string,
    fallback?: string,
    placeholder?: string,
    timeout?: number,
    retries?: number
  ): Promise<string> {
    for (let attempt = 0; attempt <= (retries || 0); attempt++) {
      try {
        const result = await this.loadSingleImage(src, timeout);
        return result;
      } catch (error) {
        console.warn(`Failed to load image ${src} (attempt ${attempt + 1}):`, error);
        
        // If this is the last attempt and we have a fallback, try it
        if (attempt === (retries || 0) && fallback) {
          try {
            return await this.loadSingleImage(fallback, timeout);
          } catch (fallbackError) {
            console.warn(`Fallback image ${fallback} also failed:`, fallbackError);
          }
        }
      }
    }

    // Return placeholder if everything fails
    return placeholder || 'assets/images/hero-bg.webp';
  }

  /**
   * Load a single image with timeout
   */
  private static loadSingleImage(src: string, timeout = 10000): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const timeoutId = setTimeout(() => {
        reject(new Error(`Image load timeout: ${src}`));
      }, timeout);

      img.onload = () => {
        clearTimeout(timeoutId);
        resolve(src);
      };

      img.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error(`Failed to load image: ${src}`));
      };

      img.src = src;
    });
  }

  /**
   * Preload critical assets for better performance
   */
  static preloadCriticalAssets(): void {
    const criticalAssets: Asset[] = [
      { path: '/qr/profile.webp', type: 'image' as const },
      { path: '/qr/profile.png', type: 'image' as const },
      { path: '/assets/images/hero-bg.webp', type: 'image' as const },
      { path: '/assets/icons/favicon-32x32.png', type: 'image' as const },
      { path: '/assets/icons/favicon-16x16.png', type: 'image' as const },
      { path: '/css/components.css', type: 'style' as const }
    ].map(asset => ({
      ...asset,
      fullPath: this.getAssetUrl(asset.path)
    }));

    criticalAssets.forEach(asset => {
      const key = this.getAssetKey(asset);
      if (!this.preloadedAssets.has(key)) {
        this.preloadAsset(asset);
        this.preloadedAssets.set(key, asset);
      }
    });
  }

  /**
   * Preload a single asset
   */
  private static preloadAsset(asset: Asset): void {
    const assetPath = asset.fullPath || this.getAssetUrl(asset.path);
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = asset.type;
    link.href = assetPath;
    
    // Add crossorigin for external assets
    if (assetPath.startsWith('http')) {
      link.crossOrigin = 'anonymous';
    }

    // For CSS files, also create a stylesheet link
    if (asset.type === 'style') {
      const styleLink = document.createElement('link');
      styleLink.rel = 'stylesheet';
      styleLink.type = 'text/css';
      styleLink.href = assetPath;
      document.head.appendChild(styleLink);
    }

    document.head.appendChild(link);
  }

  /**
   * Determine asset type for preloading
   */
  private static getAssetType(src: string): Asset['type'] {
    const extension = src.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'webp':
      case 'svg':
        return 'image';
      case 'woff':
      case 'woff2':
      case 'ttf':
      case 'otf':
        return 'font';
      case 'css':
        return 'style';
      case 'js':
        return 'script';
      default:
        return 'image';
    }
  }

  /**
   * Create responsive image sources
   */
  static createResponsiveImage(baseSrc: string, sizes: number[] = [400, 800, 1200]): string[] {
    const extension = baseSrc.split('.').pop();
    const baseName = baseSrc.replace(`.${extension}`, '');
    
    return sizes.map(size => `${baseName}-${size}w.${extension} ${size}w`);
  }

  /**
   * Load and optimize images for different screen densities
   */
  static async loadResponsiveImage(
    baseSrc: string,
    options: AssetLoadOptions & { sizes?: number[] } = {}
  ): Promise<{ src: string; srcset?: string }> {
    const { sizes = [400, 800, 1200], ...loadOptions } = options;
    
    try {
      // Try to load the base image first
      const src = await this.loadImage(baseSrc, loadOptions);
      
      // Generate responsive sources
      const srcset = this.createResponsiveImage(baseSrc, sizes).join(', ');
      
      return { src, srcset };
    } catch (error) {
      console.error('Failed to load responsive image:', error);
      return { src: loadOptions.placeholder || 'assets/images/hero-bg.webp' };
    }
  }

  /**
   * Lazy load images with Intersection Observer
   */
  static setupLazyLoading(): void {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          const fallback = img.dataset.fallback;
          
          if (src) {
            this.loadImage(src, { fallback })
              .then(loadedSrc => {
                img.src = loadedSrc;
                img.classList.remove('lazy');
                img.classList.add('loaded');
              })
              .catch(error => {
                console.error('Lazy loading failed:', error);
                img.classList.add('error');
              });
            
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  /**
   * Monitor image loading performance
   */
  static monitorImagePerformance(): void {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const resourceEntry = entry as PerformanceResourceTiming;
        if (resourceEntry.initiatorType === 'img') {
          const loadTime = resourceEntry.responseEnd - resourceEntry.startTime;
          console.log(`Image ${resourceEntry.name} loaded in ${loadTime.toFixed(2)}ms`);
          
          // Track slow loading images
          if (loadTime > 2000) {
            console.warn(`Slow image load detected: ${resourceEntry.name} (${loadTime.toFixed(2)}ms)`);
          }
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  /**
   * Clear asset cache
   */
  static clearCache(): void {
    this.cache.clear();
    this.preloadedAssets.clear();
  }

  /**
   * Get cache statistics
   */
  static getCacheStats(): { size: number; preloaded: number } {
    return {
      size: this.cache.size,
      preloaded: this.preloadedAssets.size
    };
  }
}

// Auto-initialize on module load
if (typeof window !== 'undefined') {
  // Preload critical assets when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      AssetLoader.preloadCriticalAssets();
      AssetLoader.setupLazyLoading();
      AssetLoader.monitorImagePerformance();
    });
  } else {
    AssetLoader.preloadCriticalAssets();
    AssetLoader.setupLazyLoading();
    AssetLoader.monitorImagePerformance();
  }
}