import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { formatCurrency } from '../lib/utils'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const customIcon = new L.Icon({
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize:   [20, 32],
  iconAnchor: [10, 32],
  popupAnchor:[0, -32],
  shadowSize: [32, 32],
})

const LOCATION_COORDS = {
  'Uberaba, MG':        [-19.7476, -47.9307],
  'Três Corações, MG':  [-21.6917, -45.2670],
  'Chapecó, SC':        [-27.1007, -52.6152],
  'Passo Fundo, RS':    [-28.2577, -52.4071],
  'Jataí, GO':          [-17.8802, -51.7128],
  'Barretos, SP':       [-20.5571, -48.5678],
  'Rondonópolis, MT':   [-16.4727, -54.6361],
  'Maringá, PR':        [-23.4273, -51.9375],
  'Dourados, MS':       [-22.2208, -54.8055],
  'Petrolina, PE':      [-9.3891,  -40.5019],
  'Toledo, PR':         [-24.7257, -53.7418],
  'Concórdia, SC':      [-27.2345, -52.0277],
  'Londrina, PR':       [-23.3045, -51.1696],
  'Cascavel, PR':       [-24.9578, -53.4595],
  'Araxá, MG':          [-19.5928, -46.9405],
  'Montes Claros, MG':  [-16.7290, -43.8586],
  'Mossoró, RN':        [-5.1875,  -37.3444],
  'Goiânia, GO':        [-16.6869, -49.2648],
  'Holambra, SP':       [-22.6356, -47.0586],
  'Lavras, MG':         [-21.2451, -44.9993],
  'Itajubá, MG':        [-22.4230, -45.4524],
  'Bauru, SP':          [-22.3246, -49.0721],
  'Bagé, RS':           [-31.3289, -54.1069],
  'Patos de Minas, MG': [-18.5787, -46.5185],
}

function getCoords(location) {
  if (!location) return [-15.7801, -47.9292]
  if (LOCATION_COORDS[location]) return LOCATION_COORDS[location]
  const hash = [...location].reduce((a, c) => a + c.charCodeAt(0), 0)
  return [-10 - (hash % 20), -45 - (hash % 20)]
}

function FitBounds({ animals }) {
  const map = useMap()
  useEffect(() => {
    if (!animals.length) return
    const coords = animals.map((a) => getCoords(a.location || [a.cidade, a.estado].filter(Boolean).join(', ')))
    if (coords.length === 1) {
      map.setView(coords[0], 7)
    } else {
      map.fitBounds(L.latLngBounds(coords), { padding: [40, 40] })
    }
  }, [animals, map])
  return null
}

export default function MapaCatalogo({ animals }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))] px-5 py-3">
        <p className="text-xs font-bold text-[hsl(var(--muted-fg))] uppercase tracking-wide">
          Mapa de lotes — {animals.length} resultado{animals.length !== 1 ? 's' : ''}
        </p>
        <p className="text-xs text-[hsl(var(--muted-fg))]">Clique no marcador para detalhes</p>
      </div>
      <MapContainer
        center={[-15.7801, -47.9292]}
        zoom={5}
        style={{ height: 520, width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds animals={animals} />
        {animals.map((animal) => {
          const loc = animal.location || [animal.cidade, animal.estado].filter(Boolean).join(', ')
          const [lat, lng] = getCoords(loc)
          return (
            <Marker key={animal.id} position={[lat, lng]} icon={customIcon}>
              <Popup maxWidth={240}>
                <div className="min-w-[180px]">
                  <img
                    src={animal.image ?? '/assets/hero-farm.jpg'}
                    alt={animal.title}
                    className="mb-2 h-24 w-full object-cover rounded-sm"
                  />
                  <p className="font-bold text-sm leading-tight">{animal.title}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{loc}</p>
                  <p className="mt-1 text-sm font-black text-emerald-700">{formatCurrency(animal.price)}</p>
                  <p className="text-xs text-gray-400">
                    {animal.quantity || animal.quantidade} cabeças
                    {animal.traceability ? ` · ${animal.traceability}%` : ''}
                  </p>
                  <Link
                    to={`/anuncio/${animal.id}`}
                    className="mt-2 block w-full bg-emerald-600 px-3 py-1.5 text-center text-xs font-bold text-white hover:bg-emerald-700 transition rounded-sm"
                  >
                    Ver anúncio →
                  </Link>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
