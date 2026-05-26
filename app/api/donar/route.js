import { supabase } from '../../../lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const body = await req.json()
  const { nombre, monto, pieza_tipo, pieza_nombre, mensaje } = body

  if (!nombre || !monto || !pieza_tipo) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
  }

  const { error: donError } = await supabase.from('donantes').insert({
    nombre,
    monto: parseInt(monto),
    pieza_tipo,
    pieza_nombre,
    mensaje,
  })

  if (donError) return NextResponse.json({ error: donError.message }, { status: 500 })

  await supabase.rpc('incrementar_donada', { tipo_param: pieza_tipo })

  return NextResponse.json({ ok: true })
}
