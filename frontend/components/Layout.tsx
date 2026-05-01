interface Props {
  children: React.ReactNode
  className?: string
}

export default function Layout({ children, className = '' }: Props) {
  return (
    <div className={`min-h-dvh px-5 py-6 bg-surface ${className}`}>
      {children}
    </div>
  )
}
