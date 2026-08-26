import { useEffect, useRef, type ReactNode } from 'react';
import { Box, CircularProgress } from '@mui/material';

interface InfiniteScrollProps {
  children: ReactNode;
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  threshold?: number;
}

export default function InfiniteScroll({
                                         children,
                                         onLoadMore,
                                         hasMore,
                                         loading,
                                         threshold = 100,
                                       }: InfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      {
        rootMargin: `${threshold}px`,
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, onLoadMore, threshold]);

  return (
    <Box>
      {children}
      <div ref={sentinelRef} />
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={32} />
        </Box>
      )}
    </Box>
  );
}
