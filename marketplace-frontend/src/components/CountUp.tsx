import { useEffect, useState } from 'react';
import { Typography, type TypographyProps } from '@mui/material';
import { useInView } from 'framer-motion';

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
  const ref = useInView();

  useEffect(() => {
    if (!ref) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / duration;

      if (progress < 1) {
        setValue(end * progress);
        animationFrame = requestAnimationFrame(animate);
      } else {
        setValue(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return (
    <Typography ref={ref} {...props}>
      {prefix}{value.toFixed(decimals)}{suffix}
    </Typography>
  );
}
