'use client'

import { motion } from 'framer-motion'
import { ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const variants = {
  primary: 'btn-primary-gradient text-on-primary shadow-btn',
  secondary: 'bg-surface-high text-on-surface hover:bg-surface-highest',
  ghost: 'text-on-surface-variant hover:bg-surface-high',
}

const sizes = {
  sm: 'px-5 py-2 text-sm',
  md: 'px-7 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export default function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: Props) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`rounded-full font-bold transition-all ${variants[variant]} ${sizes[size]} ${className}`}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {children}
    </motion.button>
  )
}
