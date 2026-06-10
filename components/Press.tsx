export default function Press() {
  return (
    <section
      id="press"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg-void)',
        padding: 'clamp(84px,8vw,116px) clamp(20px,5vw,60px)',
      }}
    >
      {/* Ghosted oversized wordmark behind the header (type-as-texture) */}
      <span className="ghost-word" aria-hidden style={{ top: '-2%', left: '-2%' }}>
        PRESS
      </span>

      <div style={{ maxWidth: 1180, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'left', maxWidth: 720 }}>
          <p className="eyebrow" style={{ margin: 0 }}>
            Press
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              fontSize: 'var(--fs-h1)',
              lineHeight: 'var(--lh-h1)',
              letterSpacing: '-0.01em',
              color: 'var(--cream)',
              margin: '22px 0 0',
            }}
          >
            Press Center
          </h2>
          <p
            className="measure"
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: 'var(--fs-lead)',
              lineHeight: 1.6,
              color: 'rgba(240,228,204,0.72)',
              margin: '18px 0 0',
            }}
          >
            Latest news, press releases, and media resources for SE Beverages.
          </p>
        </div>
      </div>
    </section>
  )
}
