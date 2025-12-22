import React from 'react';
import { motion, Variants } from 'framer-motion';

type VariantKey = 'fadeUp' | 'fade' | 'scale' | 'none';

interface MotionZoneProps {
  children?: React.ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  variant?: VariantKey | Variants;
  once?: boolean;
  threshold?: number; // intersection observer amount
  duration?: number;
  delay?: number;
  stagger?: number; // seconds
}

const defaultVariants: Record<string, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 18 },
    visible: (custom = {}) => ({
      opacity: 1,
      y: 0,
      transition: { duration: (custom.duration ?? 0.45), delay: (custom.delay ?? 0), when: 'beforeChildren', staggerChildren: custom.stagger ?? 0 }
    })
  },
  fade: {
    hidden: { opacity: 0 },
    visible: (custom = {}) => ({ opacity: 1, transition: { duration: (custom.duration ?? 0.45), delay: (custom.delay ?? 0) } })
  },
  scale: {
    hidden: { opacity: 0, scale: 0.98 },
    visible: (custom = {}) => ({ opacity: 1, scale: 1, transition: { duration: (custom.duration ?? 0.45), delay: (custom.delay ?? 0) } })
  }
};

const MotionZone = React.forwardRef<HTMLDivElement, MotionZoneProps>((props, ref) => {
  const {
    children,
    className = '',
    id,
    style,
    variant = 'fadeUp',
    once = true,
    threshold = 0.12,
    duration = 0.45,
    delay = 0,
    stagger = 0
  } = props;

  if (variant === 'none') return (
    <div ref={ref} id={id} style={style} className={className}>
      {children}
    </div>
  );

  const resolvedVariants: Variants = typeof variant === 'string' && defaultVariants[variant]
    ? defaultVariants[variant]
    : (variant as Variants);

  return (
    <motion.div
      ref={ref}
      id={id}
      style={style}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      variants={resolvedVariants}
      custom={{ duration, delay, stagger }}
    >
      {children}
    </motion.div>
  );
});

export default MotionZone;
