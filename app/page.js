import { supabase } from '../lib/supabase'
import HomeClient from '../components/HomeClient'

export const revalidate = 0

export default async function Page() {
  const { data: piezas } = await supabase.from('piezas').select('*').order('precio', { ascending: true })
  const { data: donantes } = await supabase.from('donantes').select('*').order('created_at', { ascending: false }).limit(10)

  const totalRecaudado = donantes?.reduce((sum, d) => sum + d.monto, 0) || 0
  const meta = 80000000
  const porcentaje = Math.round((totalRecaudado / meta) * 100 * 10) / 10

  return (
    <HomeClient
      piezas={piezas || []}
      donantes={donantes || []}
      totalRecaudado={totalRecaudado}
      porcentaje={porcentaje}
      meta={meta}
    />
  )
}
