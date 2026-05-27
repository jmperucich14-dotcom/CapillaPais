'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './HomeClient.module.css'

function formatCLP(n) {
  return '$' + Number(n).toLocaleString('es-CL')
}

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000
  if (diff < 60) return 'ahora'
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`
  return `hace ${Math.floor(diff / 86400)} d`
}

function initials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

const AVATAR_COLORS = ['#29ABE2', '#0093C4', '#007AAD', '#005F8A', '#0080C0']

// Logo SVG oficial Capilla País — cruz geométrica amarilla sobre azul
function CapillaLogo({ size = 48 }) {
  return (
    <img 
      src="/Logo_Capilla.png" 
      alt="Capilla País" 
      width={size} 
      height={size} 
      style={{ borderRadius: '10px', objectFit: 'cover' }}
    />
  )
}

export default function HomeClient({ piezas, donantes, totalRecaudado, porcentaje, meta }) {
  const router = useRouter()
  const [selectedPieza, setSelectedPieza] = useState(null)
  const [nombre, setNombre] = useState('')
  const [monto, setMonto] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const canSubmit = selectedPieza && nombre.trim() && monto.trim() && !loading

  async function handleDonar() {
    setLoading(true)
    setError('')
    const montoNum = parseInt(monto.replace(/\D/g, ''))
    if (!montoNum || montoNum < 1000) {
      setError('Ingresa un monto válido (mínimo $1.000)')
      setLoading(false)
      return
    }
    const res = await fetch('/api/donar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: nombre.trim(),
        monto: montoNum,
        pieza_tipo: selectedPieza.tipo,
        pieza_nombre: selectedPieza.nombre,
        mensaje: mensaje.trim(),
      }),
    })
    const data = await res.json()
    if (data.ok) {
      setSuccess(true)
      router.refresh()
    } else {
      setError('Hubo un error, intenta de nuevo.')
    }
    setLoading(false)
  }

  return (
    <div className={styles.root}>

      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles.logoWrap}>
          <CapillaLogo size={48} />
          <div>
            <div className={styles.logoName}>Capilla País</div>
            <div className={styles.logoSub}>Campaña 2026</div>
          </div>
        </div>
        <div className={styles.navActions}>
          <a href="mailto:capillapais@gmail.com" className={styles.btnGhost}>✉ Contacto</a>
          <button className={styles.btnPrimary} onClick={() => document.getElementById('donar-form').scrollIntoView({ behavior: 'smooth' })}>
            Quiero donar
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <span className={styles.campaignLabel}>Campaña · Capilla País 2026</span>
          <h1 className={styles.heroTitle}>Pon tu <span className={styles.accent}>ladrillo.</span></h1>
          <div className={styles.zoneBadge}>📍 Tu zona · Tu capilla</div>
          <p className={styles.heroDesc}>
            Cada aporte construye una parte de la <strong>capilla</strong> que quedará para la comunidad.
            Tu nombre se marca en una pieza del modelo y entras al libro de constructores.
          </p>
          <div className={styles.heroActions}>
            <button className={styles.btnPrimary} onClick={() => document.getElementById('donar-form').scrollIntoView({ behavior: 'smooth' })}>
              Quiero donar
            </button>
            <button className={styles.btnGhost} onClick={() => document.getElementById('categorias').scrollIntoView({ behavior: 'smooth' })}>
              Ver partes disponibles
            </button>
          </div>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.chapelPreview}>
            <svg viewBox="0 0 260 200" width="240" xmlns="http://www.w3.org/2000/svg">
              {/* Base */}
              <rect x="25" y="100" width="210" height="85" rx="3" fill="#c8dff0" stroke="#a0c4e0" strokeWidth="1.5"/>
              {/* Techo */}
              <polygon points="130,15 15,100 245,100" fill="#b0cfe8" stroke="#90b8d8" strokeWidth="1.5"/>
              {/* Puerta */}
              <rect x="105" y="125" width="50" height="60" rx="2" fill="#7a8fa8"/>
              <rect x="105" y="125" width="50" height="28" rx="2 2 0 0" fill="#8fa5bf"/>
              {/* Ventana izq */}
              <rect x="38" y="115" width="32" height="32" rx="2" fill="#aad4f0" stroke="#80b8e0" strokeWidth="1"/>
              <line x1="54" y1="115" x2="54" y2="147" stroke="#80b8e0" strokeWidth="0.8"/>
              <line x1="38" y1="131" x2="70" y2="131" stroke="#80b8e0" strokeWidth="0.8"/>
              {/* Ventana der */}
              <rect x="190" y="115" width="32" height="32" rx="2" fill="#aad4f0" stroke="#80b8e0" strokeWidth="1"/>
              <line x1="206" y1="115" x2="206" y2="147" stroke="#80b8e0" strokeWidth="0.8"/>
              <line x1="190" y1="131" x2="222" y2="131" stroke="#80b8e0" strokeWidth="0.8"/>
              {/* Cruz amarilla en el techo */}
              <rect x="122" y="5" width="16" height="40" fill="#FFE600"/>
              <rect x="110" y="16" width="40" height="14" fill="#FFE600"/>
              {/* Piezas donadas azul */}
              {donantes.slice(0, 4).map((_, i) => (
                <rect key={i} x={25 + i * 28} y="175" width="20" height="10" rx="2" fill="#29ABE2" opacity="0.9"/>
              ))}
              {/* Piezas disponibles */}
              {[0,1,2].map(i => (
                <rect key={i} x={140 + i * 28} y="175" width="20" height="10" rx="2" fill="none" stroke="#90c8e8" strokeWidth="1" strokeDasharray="3,2"/>
              ))}
            </svg>
            <span className={styles.chapelHint}>Modelo de la capilla</span>
          </div>
          <div className={styles.chapelLegend}>
            <span><span className={styles.dotDonated}></span>Pieza donada</span>
            <span><span className={styles.dotAvailable}></span>Disponible</span>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Recaudado</div>
          <div className={styles.statValue}>{formatCLP(totalRecaudado)}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Avance</div>
          <div className={`${styles.statValue} ${styles.accent}`}>{porcentaje}%</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Constructores</div>
          <div className={styles.statValue}>{donantes.length}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Meta total</div>
          <div className={styles.statValue}>$80M</div>
        </div>
      </div>

      {/* PROGRESS */}
      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span className={styles.progressTitle}>Progreso de la campaña</span>
          <span className={styles.progressPct}>{porcentaje}% del salón</span>
        </div>
        <div className={styles.progressBg}>
          <div className={styles.progressFill} style={{ width: `${Math.min(porcentaje, 100)}%` }}></div>
        </div>
        <div className={styles.progressMeta}>
          <span>{formatCLP(totalRecaudado)} recaudado</span>
          <span>Meta: {formatCLP(meta)}</span>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className={styles.sectionHeader} id="categorias">
        <div className={styles.sectionLabel}>Categorías de aporte</div>
        <h2 className={styles.sectionTitle}>Elige cómo quieres aportar</h2>
        <p className={styles.sectionSub}>Cada categoría tiene un costo total. <strong>Puedes aportar la pieza entera o un porcentaje</strong> — cada peso suma.</p>
      </div>

      <div className={styles.categories}>
        {piezas.map(p => {
          const pct = p.total > 0 ? Math.round((p.donadas / p.total) * 100) : 0
          const complete = p.donadas >= p.total
          return (
            <div key={p.id} className={`${styles.catCard} ${complete ? styles.catComplete : ''}`}>
              <div className={styles.catIcon}>{p.icono}</div>
              <div className={styles.catType}>{p.tipo}</div>
              <div className={styles.catName}>{p.nombre}</div>
              <div className={styles.catPrice}>{formatCLP(p.precio)}</div>
              <div className={styles.catPieces}>{p.donadas}/{p.total} piezas</div>
              <div className={styles.catBarBg}>
                <div className={styles.catBarFill} style={{ width: `${pct}%` }}></div>
              </div>
              {complete && <div className={styles.catCompleteBadge}>✓ Todas completas</div>}
              {!complete && (
                <button className={styles.catAportar} onClick={() => {
                  setSelectedPieza(p)
                  document.getElementById('donar-form').scrollIntoView({ behavior: 'smooth' })
                }}>
                  Aportar →
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* DONORS */}
      <div className={styles.donorsSection}>
        <div className={styles.sectionHeader} style={{ padding: '0 0 1rem' }}>
          <div className={styles.sectionLabel}>Últimos donantes</div>
          <h2 className={styles.sectionTitle}>Quienes ya pusieron su ladrillo</h2>
        </div>
        <div className={styles.donorsList}>
          {donantes.length === 0 && (
            <div className={styles.donorRow}>
              <div className={styles.donorAvatar} style={{ background: '#29ABE2' }}>TU</div>
              <div className={styles.donorInfo}>
                <div className={styles.donorName}>Tu nombre <span>· Primer constructor</span></div>
                <div className={styles.donorPiece}><strong>Sé el primero</strong> en poner tu ladrillo</div>
              </div>
              <div className={styles.donorTime}>ahora</div>
            </div>
          )}
          {donantes.map((d, i) => (
            <div key={d.id} className={styles.donorRow}>
              <div className={styles.donorAvatar} style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                {initials(d.nombre)}
              </div>
              <div className={styles.donorInfo}>
                <div className={styles.donorName}>{d.nombre} <span>aportó {formatCLP(d.monto)}</span></div>
                <div className={styles.donorPiece}><strong>100%</strong> de {d.pieza_nombre || d.pieza_tipo}</div>
                {d.mensaje && <div className={styles.donorMessage}>"{d.mensaje}"</div>}
              </div>
              <div className={styles.donorTime}>{timeAgo(d.created_at)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* DONATE FORM */}
      <div className={styles.donateForm} id="donar-form">
        {success ? (
          <div className={styles.successMsg}>
            <div style={{ fontSize: 52 }}>🙏</div>
            <h2>¡Gracias por poner tu ladrillo!</h2>
            <p>Tu nombre ya está en el libro de constructores.</p>
            <button className={styles.btnPrimary} onClick={() => { setSuccess(false); setNombre(''); setMonto(''); setMensaje(''); setSelectedPieza(null) }}>
              Hacer otro aporte
            </button>
          </div>
        ) : (
          <>
            <div className={styles.formTitle}>Pon tu ladrillo</div>
            <p className={styles.formSub}>Elige qué quieres aportar, ingresa el monto y tu nombre quedará marcado en el modelo.</p>

            <div className={styles.formStep}>1. ¿Qué quieres aportar?</div>
            <div className={styles.pieceGrid}>
              {piezas.filter(p => p.donadas < p.total).map(p => (
                <div
                  key={p.id}
                  className={`${styles.pieceOption} ${selectedPieza?.id === p.id ? styles.pieceSelected : ''}`}
                  onClick={() => setSelectedPieza(p)}
                >
                  <span className={styles.pieceIcon}>{p.icono}</span>
                  <div>
                    <div className={styles.pieceName}>{p.nombre}</div>
                    <div className={styles.pieceCount}>{p.total - p.donadas} disponibles · {formatCLP(p.precio)}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.formStep}>2. ¿Cuánto quieres aportar?</div>
            <input
              type="text"
              placeholder="Ej: 50000"
              value={monto}
              onChange={e => setMonto(e.target.value)}
              style={{ marginBottom: '1rem' }}
            />

            <div className={styles.formStep}>3. ¿Cuál es tu nombre?</div>
            <input
              type="text"
              placeholder="Tu nombre completo"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              style={{ marginBottom: '0.75rem' }}
            />
            <input
              type="text"
              placeholder="Mensaje opcional (aparecerá en el muro)"
              value={mensaje}
              onChange={e => setMensaje(e.target.value)}
            />

            {error && <p className={styles.errorMsg}>{error}</p>}

            <button className={styles.btnSubmit} disabled={!canSubmit} onClick={handleDonar}>
              {loading ? 'Enviando...' : 'Registrar mi aporte →'}
            </button>
          </>
        )}
      </div>

      {/* ENTERPRISE */}
      <div className={styles.enterprise}>
        <div className={styles.enterpriseIconWrap}>
          <CapillaLogo size={52} />
        </div>
        <div>
          <div className={styles.enterpriseTitle}>¿Tu empresa quiere ser parte?</div>
          <p className={styles.enterpriseSub}>Las empresas que aporten verán su logo en el modelo 3D de la capilla, sobre la pieza apadrinada.</p>
          <a href="mailto:capillapais@gmail.com" className={styles.enterpriseEmail}>capillapais@gmail.com</a>
        </div>
      </div>

      <footer className={styles.footer}>
        <CapillaLogo size={32} />
        <p>Capilla País 2026 · Hecho con ❤️ para la comunidad</p>
      </footer>

    </div>
  )
}
