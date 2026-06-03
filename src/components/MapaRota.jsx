import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function makePin(color, label) {
  return L.divIcon({
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
    html: `<div style="
      width:36px;height:36px;border-radius:50% 50% 50% 0;
      background:${color};border:3px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.35);
      transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;">
      <span style="transform:rotate(45deg);color:white;font-size:11px;font-weight:900;">${label}</span>
    </div>`,
  })
}
const originPin = makePin('#16a34a', 'A')
const destPin   = makePin('#dc2626', 'B')

const COORDS = {
  'Fortaleza, CE':      [-3.7172,  -38.5433],
  'Recife, PE':         [-8.0476,  -34.8770],
  'Salvador, BA':       [-12.9714, -38.5014],
  'São Paulo, SP':      [-23.5505, -46.6333],
  'Rio de Janeiro, RJ': [-22.9068, -43.1729],
  'Belo Horizonte, MG': [-19.9167, -43.9345],
  'Brasília, DF':       [-15.7801, -47.9292],
  'Curitiba, PR':       [-25.4278, -49.2731],
  'Porto Alegre, RS':   [-30.0346, -51.2177],
  'Manaus, AM':         [-3.1019,  -60.0250],
  'Belém, PA':          [-1.4558,  -48.5044],
  'Goiânia, GO':        [-16.6869, -49.2648],
  'Maceió, AL':         [-9.6658,  -35.7350],
  'Natal, RN':          [-5.7945,  -35.2110],
  'Teresina, PI':       [-5.0892,  -42.8019],
  'Campo Grande, MS':   [-20.4697, -54.6201],
  'Cuiabá, MT':         [-15.6014, -56.0979],
  'Macapá, AP':         [0.0349,   -51.0694],
  'Porto Velho, RO':    [-8.7612,  -63.9004],
  'Rio Branco, AC':     [-9.9754,  -67.8249],
  'Palmas, TO':         [-10.2491, -48.3243],
  'São Luís, MA':       [-2.5364,  -44.3068],
  'João Pessoa, PB':    [-7.1195,  -34.8450],
  'Aracaju, SE':        [-10.9167, -37.0500],
  'Vitória, ES':        [-20.3155, -40.3128],
  'Florianópolis, SC':  [-27.5954, -48.5480],
  'Uberaba, MG':        [-19.7476, -47.9307],
  'Uberlândia, MG':     [-18.9113, -48.2622],
  'Ribeirão Preto, SP': [-21.1775, -47.8103],
  'Campinas, SP':       [-22.9056, -47.0608],
  'Maringá, PR':        [-23.4273, -51.9375],
  'Londrina, PR':       [-23.3045, -51.1696],
  'Cascavel, PR':       [-24.9578, -53.4595],
  'Dourados, MS':       [-22.2208, -54.8055],
  'Rondonópolis, MT':   [-16.4727, -54.6361],
  'Barretos, SP':       [-20.5571, -48.5678],
  'Jataí, GO':          [-17.8802, -51.7128],
  'Chapecó, SC':        [-27.1007, -52.6152],
  'Passo Fundo, RS':    [-28.2577, -52.4071],
  'Bagé, RS':           [-31.3289, -54.1069],
  'Petrolina, PE':      [-9.3891,  -40.5019],
  'Mossoró, RN':        [-5.1875,  -37.3444],
  'Montes Claros, MG':  [-16.7290, -43.8586],
  'Patos de Minas, MG': [-18.5787, -46.5185],
  'Araxá, MG':          [-19.5928, -46.9405],
  'Lavras, MG':         [-21.2451, -44.9993],
}

function resolveCoords(text) {
  if (!text) return null
  const exact = COORDS[text.trim()]
  if (exact) return exact
  const norm = text.toLowerCase().replace(/,.*$/, '').trim()
  const key = Object.keys(COORDS).find((k) => {
    const city = k.split(',')[0].toLowerCase()
    return city === norm || city.includes(norm) || norm.includes(city)
  })
  return key ? COORDS[key] : null
}

function fmtDist(m) {
  return m >= 1000 ? `${(m / 1000).toFixed(0)} km` : `${Math.round(m)} m`
}
function fmtTime(s) {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  return h > 0 ? `${h}h ${m}min` : `${m} min`
}
function stepArrow(maneuver = {}) {
  const { type, modifier } = maneuver
  if (type === 'depart') return '▶'
  if (type === 'arrive') return '⬛'
  if (!modifier) return '↑'
  if (modifier.includes('sharp left'))  return '↰'
  if (modifier.includes('sharp right')) return '↱'
  if (modifier.includes('left'))  return '←'
  if (modifier.includes('right')) return '→'
  if (modifier === 'uturn') return '↩'
  return '↑'
}

function FitRoute({ positions, from, to }) {
  const map = useMap()
  useEffect(() => {
    if (positions?.length > 1) {
      map.fitBounds(L.latLngBounds(positions), { padding: [60, 60] })
    } else if (from && to) {
      map.fitBounds(L.latLngBounds([from, to]), { padding: [60, 60] })
    } else if (from) {
      map.setView(from, 9)
    }
  }, [positions, from, to, map])
  return null
}

export default function MapaRota({ origin, destination }) {
  const from = resolveCoords(origin)
  const to   = resolveCoords(destination)

  const [route,     setRoute]     = useState(null)   // { positions, distance, duration, steps }
  const [altRoutes, setAltRoutes] = useState([])
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState(null)

  useEffect(() => {
    if (!from || !to) { setRoute(null); setAltRoutes([]); return }
    setLoading(true)
    setError(null)
    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${from[1]},${from[0]};${to[1]},${to[0]}` +
      `?geometries=geojson&overview=full&steps=true&alternatives=true`
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (!data.routes?.length) { setError('Rota não encontrada'); return }
        const primary = data.routes[0]
        setRoute({
          positions: primary.geometry.coordinates.map(([lon, lat]) => [lat, lon]),
          distance:  primary.distance,
          duration:  primary.duration,
          steps:     primary.legs?.[0]?.steps ?? [],
        })
        setAltRoutes(
          data.routes.slice(1).map((r) => r.geometry.coordinates.map(([lon, lat]) => [lat, lon]))
        )
      })
      .catch(() => setError('Erro ao calcular rota'))
      .finally(() => setLoading(false))
  }, [from?.[0], from?.[1], to?.[0], to?.[1]])

  const center = from || [-15.7801, -47.9292]

  return (
    <div>
      {/* Info bar */}
      {(route || loading || error) && (
        <div className="flex items-center gap-4 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))] px-4 py-2.5">
          {loading && <span className="text-xs text-[hsl(var(--muted-fg))]">Calculando rota real…</span>}
          {error   && <span className="text-xs text-red-600">{error}</span>}
          {route && !loading && (
            <>
              <span className="text-sm font-black text-brand-700">{fmtDist(route.distance)}</span>
              <span className="text-xs text-[hsl(var(--muted-fg))]">·</span>
              <span className="text-sm font-semibold text-[hsl(var(--text))]">{fmtTime(route.duration)}</span>
              {altRoutes.length > 0 && (
                <span className="ml-auto text-[11px] text-[hsl(var(--muted-fg))]">{altRoutes.length} rota alternativa disponível</span>
              )}
            </>
          )}
        </div>
      )}

      {/* Map */}
      <MapContainer center={center} zoom={5} style={{ height: 420, width: '100%' }} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
        />
        <FitRoute positions={route?.positions} from={from} to={to} />

        {/* Rotas alternativas */}
        {altRoutes.map((pos, i) => (
          <Polyline key={i} positions={pos} color="#94a3b8" weight={5} opacity={0.55} />
        ))}

        {/* Rota principal — borda branca + linha verde */}
        {route?.positions && (
          <>
            <Polyline positions={route.positions} color="white"   weight={9} opacity={0.9} />
            <Polyline positions={route.positions} color="#16a34a" weight={6} opacity={1} />
          </>
        )}

        {/* Fallback linha reta se OSRM falhou */}
        {!route?.positions && from && to && (
          <Polyline positions={[from, to]} color="#16a34a" weight={4} dashArray="10 8" opacity={0.6} />
        )}

        {from && <Marker position={from} icon={originPin} />}
        {to   && <Marker position={to}   icon={destPin}   />}
      </MapContainer>

      {/* Steps / curva a curva */}
      {route?.steps?.length > 0 && (
        <div className="border-t border-[hsl(var(--border))] max-h-52 overflow-y-auto">
          <p className="sticky top-0 bg-[hsl(var(--surface))] border-b border-[hsl(var(--border))] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--muted-fg))]">
            Instruções de rota
          </p>
          {route.steps.filter((s) => s.maneuver?.type !== 'arrive' || s === route.steps.at(-1)).map((step, i) => (
            <div key={i} className="flex items-center gap-3 border-b border-[hsl(var(--border))] px-4 py-2.5 last:border-0">
              <span className="w-6 shrink-0 text-center text-base">{stepArrow(step.maneuver)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[hsl(var(--text))] truncate">
                  {step.name || (step.maneuver?.type === 'depart' ? `Partir de ${origin}` : step.maneuver?.type === 'arrive' ? `Chegar em ${destination}` : 'Continuar')}
                </p>
              </div>
              <span className="shrink-0 text-[11px] text-[hsl(var(--muted-fg))]">{fmtDist(step.distance)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
