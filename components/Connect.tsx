'use client'

import { useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'
import { CONNECT } from '@/lib/constants'

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontWeight: 500,
  fontSize: 10,
  letterSpacing: 'var(--track-eyebrow-sm)',
  textTransform: 'uppercase',
  color: 'var(--silver)',
  display: 'block',
  marginBottom: 8,
}

export default function Connect() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  useGSAP(
    () => {
      const reduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return

      gsap.registerPlugin(ScrollTrigger)

      gsap.fromTo(
        [headerRef.current, leftRef.current, rightRef.current],
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      )
    },
    { scope: sectionRef }
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fullName = `${firstName} ${lastName}`.trim()
    const body = `Name: ${fullName}\nEmail: ${email}\n\n${message}`
    const mailto = `mailto:${CONNECT.email}?subject=${encodeURIComponent(
      subject || 'Southern Edge Inquiry'
    )}&body=${encodeURIComponent(body)}`
    window.location.href = mailto
  }

  return (
    <section
      id="connect"
      ref={sectionRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg-deep)',
        padding: 'clamp(96px,10vw,140px) clamp(20px,5vw,60px)',
      }}
    >
      <span className="ghost-word" aria-hidden style={{ top: '-2%', left: '-2%' }}>
        CONNECT
      </span>

      <div style={{ maxWidth: 1180, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div
          ref={headerRef}
          style={{ textAlign: 'left', maxWidth: 720, marginBottom: 'clamp(48px,6vw,72px)' }}
        >
          <span className="eyebrow" style={{ marginBottom: 22 }}>
            {CONNECT.eyebrow}
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              fontSize: 'var(--fs-h1)',
              lineHeight: 'var(--lh-h1)',
              letterSpacing: '-0.01em',
              color: 'var(--cream)',
              margin: 0,
            }}
          >
            {CONNECT.headline}
          </h2>
          <p
            className="measure"
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: 'var(--fs-body)',
              lineHeight: 'var(--lh-body)',
              color: 'rgba(240,228,204,0.7)',
              margin: '24px 0 0',
            }}
          >
            {CONNECT.sub}
          </p>
        </div>

        {/* Two-column block */}
        <div className="connect-layout">
          {/* LEFT */}
          <div ref={leftRef}>
            <span className="amber-rule-left" />
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                fontSize: 16,
                lineHeight: 1.8,
                color: 'rgba(240,228,204,0.8)',
                margin: '0 0 28px',
              }}
            >
              {CONNECT.body}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                fontSize: 15,
                lineHeight: 1.8,
                color: 'rgba(240,228,204,0.6)',
                margin: '0 0 36px',
              }}
            >
              {CONNECT.locationsNote}
            </p>
            <div>
              <span style={labelStyle}>Email Us</span>
              <a
                href={`mailto:${CONNECT.email}`}
                className="underline-hover"
                style={{
                  fontFamily: 'var(--font-accent)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  fontSize: 'clamp(1.4rem,2.4vw,1.9rem)',
                  color: 'var(--amber)',
                  textDecoration: 'none',
                }}
              >
                {CONNECT.email}
              </a>
            </div>
          </div>

          {/* RIGHT — form card */}
          <div
            ref={rightRef}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--smoke)',
              borderRadius: 16,
              padding: 'clamp(24px,3vw,40px)',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 400,
                fontSize: 'clamp(1.6rem,3vw,2.2rem)',
                lineHeight: 1.1,
                letterSpacing: '0',
                color: 'var(--cream)',
                margin: '0 0 24px',
              }}
            >
              Send Us A Message
            </h3>

            <form onSubmit={handleSubmit} noValidate={false}>
              <div className="connect-name-row">
                <div>
                  <label htmlFor="connect-first" style={labelStyle}>
                    First Name
                  </label>
                  <input
                    id="connect-first"
                    className="connect-input"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFirstName(e.target.value)
                    }
                  />
                </div>
                <div>
                  <label htmlFor="connect-last" style={labelStyle}>
                    Last Name
                  </label>
                  <input
                    id="connect-last"
                    className="connect-input"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setLastName(e.target.value)
                    }
                  />
                </div>
              </div>

              <div style={{ marginTop: 18 }}>
                <label htmlFor="connect-email" style={labelStyle}>
                  Email
                </label>
                <input
                  id="connect-email"
                  className="connect-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                />
              </div>

              <div style={{ marginTop: 18 }}>
                <label htmlFor="connect-subject" style={labelStyle}>
                  Subject
                </label>
                <input
                  id="connect-subject"
                  className="connect-input"
                  type="text"
                  value={subject}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSubject(e.target.value)
                  }
                />
              </div>

              <div style={{ marginTop: 18 }}>
                <label htmlFor="connect-message" style={labelStyle}>
                  Message
                </label>
                <textarea
                  id="connect-message"
                  className="connect-input connect-textarea"
                  required
                  rows={5}
                  value={message}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setMessage(e.target.value)
                  }
                />
              </div>

              <button type="submit" className="connect-submit">
                Send Message
              </button>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 400,
                  fontSize: 12,
                  lineHeight: 1.6,
                  color: 'rgba(240,228,204,0.45)',
                  margin: '16px 0 0',
                }}
              >
                This opens your mail app with the message pre-filled — just hit send.
              </p>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .connect-layout {
          display: grid;
          grid-template-columns: 44% 56%;
          gap: clamp(40px, 5vw, 72px);
          align-items: start;
        }
        .connect-name-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .connect-input {
          width: 100%;
          box-sizing: border-box;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--smoke);
          border-radius: 8px;
          padding: 12px 16px;
          color: var(--cream);
          font-family: var(--font-body);
          font-size: 15px;
          font-weight: 300;
          transition: border-color 0.25s ease, background 0.25s ease;
        }
        .connect-input::placeholder {
          color: rgba(240,228,204,0.35);
        }
        .connect-input:focus {
          outline: none;
          border-color: var(--amber);
          background: var(--bg-void);
        }
        .connect-textarea {
          resize: vertical;
          min-height: 120px;
          line-height: 1.6;
        }
        .connect-submit {
          margin-top: 24px;
          width: 100%;
          background: var(--amber);
          color: var(--bg-void);
          border: none;
          border-radius: 8px;
          padding: 14px 24px;
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.25s ease, transform 0.15s ease;
        }
        .connect-submit:hover {
          background: var(--gold);
        }
        .connect-submit:active {
          transform: translateY(1px);
        }
        @media (max-width: 767px) {
          .connect-layout {
            grid-template-columns: 1fr;
          }
          .connect-name-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  )
}
