import './globals.css'

export const metadata = {
  title: 'Capilla País 2026 · Pon tu ladrillo',
  description: 'Construyamos juntos la capilla de tu zona. Cada aporte cuenta.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
