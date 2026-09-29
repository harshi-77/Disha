import React, { useRef, useEffect, useState, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  threshold?: number;
}

/**
 * ScrollReveal Component:
 * Rapid, snappy responsive reveal so elements appear instantaneously without lag,
 * maintaining beautiful fluid entrance and departure.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  threshold = 0.05,
}) => {
  const domRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      {
        threshold: threshold,
        rootMargin: '100px 0px 50px 0px', // generous rootMargin for instant pre-triggering
      }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [threshold]);

  const getTransformClass = () => {
    if (isVisible) return 'opacity-100 translate-y-0 translate-x-0 scale-100';
    switch (direction) {
      case 'up':
        return 'opacity-0 translate-y-6 scale-[0.99]';
      case 'down':
        return 'opacity-0 -translate-y-6 scale-[0.99]';
      case 'left':
        return 'opacity-0 translate-x-6 scale-[0.99]';
      case 'right':
        return 'opacity-0 -translate-x-6 scale-[0.99]';
      default:
        return 'opacity-0 scale-[0.99]';
    }
  };

  return (
    <div
      ref={domRef}
      style={{ transitionDelay: `${Math.min(delay, 120)}ms` }}
      className={`transition-all duration-350 ease-out will-change-transform ${getTransformClass()} ${className}`}
    >
      {children}
    </div>
  );
};
