"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends Omit<HTMLMotionProps<"button">, "asChild"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  magnetic?: boolean;
  glow?: boolean;
  className?: string;
  asChild?: boolean;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ 
    children, 
    variant = "primary", 
    size = "md", 
    magnetic = false,
    glow = false,
    className,
    asChild = false,
    ...props 
  }, ref) => {
    const variants = {
      primary: "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20",
      secondary: "bg-slate-900 hover:bg-slate-800 text-white",
      outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
      ghost: "bg-transparent hover:bg-white/10 text-white",
    };

    const sizes = {
      sm: "px-6 py-2.5 text-xs",
      md: "px-8 py-3.5 text-sm",
      lg: "px-12 py-5 text-base",
    };

    const buttonClasses = cn(
      "relative font-black uppercase tracking-widest rounded-2xl transition-all duration-300 overflow-hidden",
      variants[variant],
      sizes[size],
      glow && "glow-primary",
      className
    );

    // Filter out Framer Motion props for asChild
    const framerMotionProps = [
      'whileHover', 'whileTap', 'whileFocus', 'whileDrag', 'whileInView',
      'animate', 'initial', 'exit', 'variants', 'transition', 'layout',
      'layoutId', 'drag', 'dragConstraints', 'dragElastic', 'dragMomentum',
      'onAnimationStart', 'onAnimationComplete', 'onUpdate', 'onDragStart',
      'onDrag', 'onDragEnd', 'custom', 'inherit', 'style'
    ];

    const { 
      whileHover, 
      whileTap, 
      ...domProps 
    } = props;

    const motionProps = {
      whileHover: { 
        scale: 1.05,
        boxShadow: glow ? "0 0 30px rgba(255, 127, 0, 0.5)" : undefined
      } as const,
      whileTap: { scale: 0.95 } as const,
      ...(magnetic && {
        whileHover: {
          scale: 1.05,
          transition: { type: "spring" as const, stiffness: 400, damping: 17 }
        }
      }),
      ...(whileHover && { whileHover }),
      ...(whileTap && { whileTap }),
    };

    // If asChild, clone the child and merge props (without Framer Motion props)
    if (asChild && React.isValidElement(children)) {
      const childProps = { ...domProps };
      // Remove any Framer Motion props that might have been passed
      framerMotionProps.forEach(prop => {
        delete (childProps as any)[prop];
      });

      return React.cloneElement(children as React.ReactElement<any>, {
        ...childProps,
        ref,
        className: cn(buttonClasses, (children as React.ReactElement<any>).props?.className),
      });
    }

    const buttonProps = {
      ...domProps,
      className: buttonClasses,
      ...motionProps,
    };

    return (
      <motion.button
        ref={ref}
        {...buttonProps}
      >
        <span className="relative z-10 flex items-center">{children}</span>
        {variant === "primary" && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary via-orange-500 to-primary"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        )}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export default AnimatedButton;