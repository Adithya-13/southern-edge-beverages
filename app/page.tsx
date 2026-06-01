export default function Home() {
  return (
    <main
      id="hero"
      style={{
        minHeight: '300vh',
        paddingTop: '6rem',
        background: 'var(--bg-void)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
      }}
    >
      {/* Placeholder — sections will be built in subsequent phases */}
      <p
        className="font-cormorant"
        style={{
          color: 'var(--cream)',
          fontSize: 'clamp(1.5rem, 4vw, 3rem)',
          marginTop: '30vh',
          opacity: 0.4,
          letterSpacing: '0.05em',
        }}
      >
        Southern Edge Fine Spirits
      </p>
      <p
        className="font-sans"
        style={{ color: 'var(--silver)', fontSize: '0.85rem', opacity: 0.4 }}
      >
        Scroll to test Navbar · Sections coming next phase
      </p>
    </main>
  )
}
