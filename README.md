# Capilla País 2026 — Sitio de campaña

## Configuración

### 1. Variables de entorno
Edita el archivo `.env.local` y completa:
```
NEXT_PUBLIC_SUPABASE_URL=https://thswtyjleeitgndbrptm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_publishable_key_aqui
```

### 2. SQL en Supabase
Ejecuta este SQL en el SQL Editor de Supabase:

```sql
create table donantes (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  monto integer not null,
  pieza_tipo text not null,
  pieza_nombre text,
  mensaje text,
  created_at timestamp default now()
);

create table piezas (
  id uuid default gen_random_uuid() primary key,
  tipo text not null,
  nombre text not null,
  precio integer not null,
  total integer not null,
  donadas integer default 0,
  icono text
);

insert into piezas (tipo, nombre, precio, total, icono) values
  ('Estructura', 'Panel de muro', 2500000, 12, '🧱'),
  ('Techo', 'Plancha de zinc', 500000, 20, '🏠'),
  ('Ventanas', 'Ventana', 350000, 8, '🪟'),
  ('Acceso', 'Puerta principal', 800000, 2, '🚪'),
  ('Terminaciones', 'Pintura / barniz', 150000, 6, '🪣');

alter table donantes enable row level security;
alter table piezas enable row level security;

create policy "público puede leer donantes" on donantes for select using (true);
create policy "público puede insertar donantes" on donantes for insert with check (true);
create policy "público puede leer piezas" on piezas for select using (true);

create or replace function incrementar_donada(tipo_param text)
returns void language plpgsql as $$
begin
  update piezas set donadas = donadas + 1
  where tipo = tipo_param and donadas < total;
end;
$$;
```

### 3. Variables en Vercel
En Vercel → Settings → Environment Variables agrega:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Para editar el sitio
- Abre el archivo `components/HomeClient.js` para cambiar textos
- Abre `components/HomeClient.module.css` para cambiar colores y estilos
- Edita las piezas directamente en la tabla `piezas` de Supabase
