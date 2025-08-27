import React, { 
  useState, 
  useEffect, 
  useRef, 
  useCallback, 
  useMemo,
  CSSProperties 
} from "react";

export interface VirtualScrollProps<T> {
  // Required props
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number | ((index: number, item: T) => number);
  
  // Container props
  height: number;
  width?: number | string;
  className?: string;
  
  // Performance options
  overscan?: number; // Number of items to render outside visible area
  scrollBehavior?: "auto" | "smooth";
  
  // Callbacks
  onScroll?: (scrollTop: number, scrollDirection: "up" | "down") => void;
  onVisibleRangeChange?: (startIndex: number, endIndex: number) => void;
  
  // Advanced options
  estimatedItemHeight?: number; // For dynamic heights
  enableHorizontalScroll?: boolean;
  maintainScrollPosition?: boolean;
  
  // Loading states
  loading?: boolean;
  loadingComponent?: React.ReactNode;
  
  // Empty state
  emptyComponent?: React.ReactNode;
}

export function VirtualScroll<T>({
  items,
  renderItem,
  itemHeight,
  height,
  width = "100%",
  className = "",
  overscan = 5,
  scrollBehavior = "auto",
  onScroll,
  onVisibleRangeChange,
  estimatedItemHeight,
  enableHorizontalScroll = false,
  maintainScrollPosition = false,
  loading = false,
  loadingComponent,
  emptyComponent
}: VirtualScrollProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const previousScrollTop = useRef(0);

  // Calculate item heights
  const getItemHeight = useCallback((index: number): number => {
    if (typeof itemHeight === "function") {
      return itemHeight(index, items[index]);
    }
    return itemHeight;
  }, [itemHeight, items]);

  // Calculate total height and item positions
  const { totalHeight, itemPositions } = useMemo(() => {
    const positions: number[] = [];
    let totalHeight = 0;
    
    for (let i = 0; i < items.length; i++) {
      positions[i] = totalHeight;
      totalHeight += getItemHeight(i);
    }
    
    return { totalHeight, itemPositions: positions };
  }, [items.length, getItemHeight]);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    if (items.length === 0) return { start: 0, end: 0 };
    
    const containerHeight = height;
    const scrollStart = scrollTop;
    const scrollEnd = scrollTop + containerHeight;
    
    // Binary search for start index
    let start = 0;
    let end = items.length - 1;
    
    while (start <= end) {
      const mid = Math.floor((start + end) / 2);
      const itemTop = itemPositions[mid];
      const itemBottom = itemTop + getItemHeight(mid);
      
      if (itemBottom <= scrollStart) {
        start = mid + 1;
      } else if (itemTop >= scrollEnd) {
        end = mid - 1;
      } else {
        // Found an intersecting item, find the actual start
        while (start > 0 && itemPositions[start - 1] + getItemHeight(start - 1) > scrollStart) {
          start--;
        }
        break;
      }
    }
    
    // Find end index
    let visibleEnd = start;
    while (
      visibleEnd < items.length && 
      itemPositions[visibleEnd] < scrollEnd
    ) {
      visibleEnd++;
    }
    
    // Apply overscan
    const startIndex = Math.max(0, start - overscan);
    const endIndex = Math.min(items.length - 1, visibleEnd + overscan);
    
    return { start: startIndex, end: endIndex };
  }, [scrollTop, height, items.length, itemPositions, getItemHeight, overscan]);

  // Handle scroll
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = event.currentTarget.scrollTop;
    const direction = newScrollTop > previousScrollTop.current ? "down" : "up";
    
    setScrollTop(newScrollTop);
    setScrollDirection(direction);
    previousScrollTop.current = newScrollTop;
    
    onScroll?.(newScrollTop, direction);
  }, [onScroll]);

  // Notify visible range changes
  useEffect(() => {
    onVisibleRangeChange?.(visibleRange.start, visibleRange.end);
  }, [visibleRange.start, visibleRange.end, onVisibleRangeChange]);

  // Scroll to specific item
  const scrollToItem = useCallback((
    index: number, 
    align: "start" | "center" | "end" = "start"
  ) => {
    if (!containerRef.current || index < 0 || index >= items.length) return;
    
    const itemTop = itemPositions[index];
    const itemHeight = getItemHeight(index);
    let scrollTop: number;
    
    switch (align) {
      case "start":
        scrollTop = itemTop;
        break;
      case "center":
        scrollTop = itemTop - (height - itemHeight) / 2;
        break;
      case "end":
        scrollTop = itemTop - height + itemHeight;
        break;
    }
    
    containerRef.current.scrollTo({
      top: Math.max(0, Math.min(scrollTop, totalHeight - height)),
      behavior: scrollBehavior
    });
  }, [itemPositions, getItemHeight, height, totalHeight, scrollBehavior, items.length]);

  // Render visible items
  const visibleItems = useMemo(() => {
    const items_to_render = [];
    
    for (let i = visibleRange.start; i <= visibleRange.end; i++) {
      if (i >= items.length) break;
      
      const item = items[i];
      const top = itemPositions[i];
      const height = getItemHeight(i);
      
      items_to_render.push(
        <div
          key={`virtual-item-${i}`}
          style={{
            position: "absolute",
            top: top,
            left: 0,
            width: "100%",
            height: height
          }}
        >
          {renderItem(item, i)}
        </div>
      );
    }
    
    return items_to_render;
  }, [visibleRange, items, itemPositions, getItemHeight, renderItem]);

  // Container styles
  const containerStyle: CSSProperties = {
    height,
    width,
    overflow: "auto",
    position: "relative"
  };

  const innerStyle: CSSProperties = {
    height: totalHeight,
    width: "100%",
    position: "relative"
  };

  // Loading state
  if (loading && loadingComponent) {
    return (
      <div style={containerStyle} className={className}>
        {loadingComponent}
      </div>
    );
  }

  // Empty state
  if (items.length === 0 && emptyComponent) {
    return (
      <div style={containerStyle} className={className}>
        {emptyComponent}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={containerStyle}
      className={className}
      onScroll={handleScroll}
    >
      <div style={innerStyle}>
        {visibleItems}
      </div>
    </div>
  );
}

export default VirtualScroll;