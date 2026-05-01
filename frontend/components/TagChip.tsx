interface Props {
  label: string
  small?: boolean
}

export default function TagChip({ label, small = false }: Props) {
  const display = label.replace(/-/g, ' ')
  return (
    <span
      className={`inline-block rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-semibold tracking-wide capitalize ${
        small ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
      }`}
    >
      {display}
    </span>
  )
}
