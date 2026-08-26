import { Suspense, lazy, type ComponentType } from 'react';
import LoadingSpinner from './LoadingSpinner';

export function lazyLoad<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  fallback = <LoadingSpinner />
) {
  const LazyComponent = lazy(factory);

  return function LazyWrapper(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}
