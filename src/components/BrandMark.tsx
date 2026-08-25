type BrandMarkProps = {
  variant?: 'lockup' | 'monogram' | 'star'
  className?: string
  alt?: string
}

export function BrandMark({
  variant = 'lockup',
  className = '',
  alt = 'KHWEZI K',
}: BrandMarkProps) {
  switch (variant) {
    case 'monogram':
      return (
        <img
          src="/brand/monogram-cocoa.png"
          alt={alt}
          className={`brand-monogram ${className}`.trim()}
          width={48}
          height={48}
        />
      )
    case 'star':
      return (
        <img
          src="/brand/star-cream-transparent.png"
          alt={alt}
          className={`brand-star ${className}`.trim()}
        />
      )
    case 'lockup':
      return (
        <img
          src="/brand/lockup-cream-transparent.png"
          alt={alt}
          className={`brand-lockup ${className}`.trim()}
        />
      )
    default: {
      const _exhaustive: never = variant
      return _exhaustive
    }
  }
}
