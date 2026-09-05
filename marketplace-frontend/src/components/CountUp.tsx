import { useEffect, useState, useRef } from 'react';
import { Typography, type TypographyProps } from '@mui/material';

interface CountUpProps extends TypographyProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export default function CountUp({
                                  end,
                                  duration = 2000,
                                  prefix = '',
                                  suffix = '',
                                  decimals = 0,
                                  ...props
                                }: CountUpProps) {
  const [value, setValue] = useState(0);
  const elementRef = useRef<HTMLElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const progress = (timestamp - startTime) / duration;

      if (progress < 1) {
        setValue(end * progress);
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setValue(end);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [end, duration]);

  return (
    <Typography ref={elementRef} {...props}>
      {prefix}{value.toFixed(decimals)}{suffix}
    </Typography>
  );
}
