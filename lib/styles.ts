// Shared style objects. Values copied byte-for-byte from Footer.tsx.
// NOTE: the label-ish styles in ThePour (letterSpacing 0.25em, fontSize 11),
// ProductCard (0.2em, fontSize 10) and Footer (0.2em, fontSize '10px') all DIFFER,
// so they are intentionally NOT merged here.

import type { CSSProperties } from 'react'

export const LABEL_STYLE: CSSProperties = {
  fontFamily: 'var(--font-dm-sans)',
  fontWeight: 500,
  fontSize: '10px',
  color: 'var(--silver)',
  letterSpacing: '0.2em',
  marginBottom: '20px',
  textTransform: 'uppercase',
  display: 'block',
}

export const LINK_STYLE: CSSProperties = {
  fontFamily: 'var(--font-dm-sans)',
  fontWeight: 300,
  fontSize: '14px',
  color: 'rgba(240,228,204,0.55)',
  display: 'block',
  marginBottom: '12px',
  textDecoration: 'none',
}
